package interfaces

import (
    "context"

    "github.com/baoerzuikeai/Imsystem/internal/domain"
)

type AIChatRepository interface {
    SaveAIChat(ctx context.Context, aiChat *domain.AIChat) error
    GetAIChatsByUserID(ctx context.Context, userID string) ([]*domain.AIChat, error)
}