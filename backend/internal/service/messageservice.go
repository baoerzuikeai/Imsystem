package service

import (
	"context"

	"github.com/baoerzuikeai/Imsystem/internal/domain"
	"github.com/baoerzuikeai/Imsystem/internal/repository/interfaces"
)

type messageService struct {
	messageRepo interfaces.MessageRepository
	chatRepo    interfaces.ChatRepository
}

func NewMessageService(messageRepo interfaces.MessageRepository, chatRepo interfaces.ChatRepository) MessageService {
	return &messageService{
		messageRepo: messageRepo,
		chatRepo:    chatRepo,
	}
}

func (s *messageService) Create(ctx context.Context, message *domain.Message) error {
	return s.messageRepo.Create(ctx, message)
}

func (s *messageService) GetByChatID(ctx context.Context, chatID string, limit, offset int) ([]*domain.Message, error) {
	return s.messageRepo.GetByChatID(ctx, chatID, limit, offset)
}

func (s *messageService) GetChatMembers(ctx context.Context, chatID string) ([]*domain.User, error) {
	// 假设有一个 repository 方法可以根据 chatID 查询成员
	return s.chatRepo.GetChatMembers(ctx, chatID)
}
