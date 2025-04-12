package interfaces

import (
	"context"

	"github.com/baoerzuikeai/Imsystem/internal/domain"
)

type MessageRepository interface {
	Create(ctx context.Context, message *domain.Message) error
	GetByChatID(ctx context.Context, chatID string, limit, offset int) ([]*domain.Message, error)
	GetByID(ctx context.Context, id string) (*domain.Message, error)
	Delete(ctx context.Context, id string) error
}
