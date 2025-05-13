package service

import (
	"context"
	"time"

	"github.com/baoerzuikeai/Imsystem/internal/domain"
	"github.com/baoerzuikeai/Imsystem/internal/repository/interfaces"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AIChatService interface {
	GetAIResponse(ctx context.Context, userID string, history []Message, question string) ([]Choice, error)
	SaveAIChat(ctx context.Context, userID, question, answer string) error
	GetAIChatsByUserID(ctx context.Context, userID string) ([]*domain.AIChat, error)
}

type aiChatService struct {
	aiChatRepo interfaces.AIChatRepository
	aiClient   *DeepSeekClient
}

func NewAIChatService(aiChatRepo interfaces.AIChatRepository, aiClient *DeepSeekClient) AIChatService {
	return &aiChatService{
		aiChatRepo: aiChatRepo,
		aiClient:   aiClient,
	}
}

func (s *aiChatService) GetAIResponse(ctx context.Context, userID string, history []Message, question string) ([]Choice, error) {
	// 调用 AI 客户端获取回答
	return s.aiClient.GetResponse(ctx, history, question)
}

func (s *aiChatService) SaveAIChat(ctx context.Context, userID, question, answer string) error {
	aiChat := &domain.AIChat{
		ID:        primitive.NewObjectID(),
		UserID:    userID,
		Question:  question,
		Answer:    answer,
		Type:      "qa",
		CreatedAt: time.Now(),
	}
	return s.aiChatRepo.SaveAIChat(ctx, aiChat)
}

func (s *aiChatService) GetAIChatsByUserID(ctx context.Context, userID string) ([]*domain.AIChat, error) {
	return s.aiChatRepo.GetAIChatsByUserID(ctx, userID)
}
