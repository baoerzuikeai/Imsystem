package service

import (
	"context"

	"github.com/baoerzuikeai/Imsystem/internal/domain"
	"github.com/baoerzuikeai/Imsystem/internal/repository/interfaces"
)

type messageService struct {
	messageRepo interfaces.MessageRepository
}

func NewMessageService(messageRepo interfaces.MessageRepository) MessageService {
	return &messageService{
		messageRepo: messageRepo,
	}
}

func (s *messageService) Create(ctx context.Context, message *domain.Message) error {
	return s.messageRepo.Create(ctx, message)
}

func (s *messageService) GetByChatID(ctx context.Context, chatID string, limit, offset int) ([]*domain.Message, error) {
	return s.messageRepo.GetByChatID(ctx, chatID, limit, offset)
}
