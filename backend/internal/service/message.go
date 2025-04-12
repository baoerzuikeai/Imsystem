package service

import (
	"context"

	"github.com/baoerzuikeai/Imsystem/internal/domain"
)

type MessageService interface {
	Create(ctx context.Context, message *domain.Message) error
	GetByChatID(ctx context.Context, chatID string, limit, offset int) ([]*domain.Message, error)
}
