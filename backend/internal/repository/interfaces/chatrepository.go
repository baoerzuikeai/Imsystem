package interfaces

import (
	"context"

	"github.com/baoerzuikeai/Imsystem/internal/domain"
)

type ChatRepository interface {
	// 根据 ChatID 获取聊天成员
	GetChatMembers(ctx context.Context, chatID string) ([]*domain.User, error)

	// 根据 ChatID 获取聊天详情
	GetChatByID(ctx context.Context, chatID string) (*domain.Chat, error)

	// 创建新的聊天
	CreateChat(ctx context.Context, chat *domain.Chat) error

	// 更新聊天信息
	UpdateChat(ctx context.Context, chat *domain.Chat) error

	// 删除聊天
	DeleteChat(ctx context.Context, chatID string) error

	// 根据用户ID和聊天类型查询聊天
	GetChatsByUserAndType(ctx context.Context, userID string, chatType string) ([]*domain.Chat, error)
	
	//添加聊私聊成员
	CreatePrivateChat(ctx context.Context, chat *domain.Chat) error

	//获取chat
	GetAllChatsByUserID(ctx context.Context, userID string) ([]*domain.Chat, error)

	CreateGroupChat(ctx context.Context, chat *domain.Chat) error
}
