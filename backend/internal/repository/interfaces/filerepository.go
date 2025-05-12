package interfaces

import (
    "context"

    "github.com/baoerzuikeai/Imsystem/internal/domain"
)

type FileRepository interface {
    Save(ctx context.Context, file *domain.File) error
    GetByID(ctx context.Context, id string) (*domain.File, error)
}