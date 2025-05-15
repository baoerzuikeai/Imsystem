package service

import (
	"context"
	"time"

	"github.com/baoerzuikeai/Imsystem/internal/domain"
	"github.com/baoerzuikeai/Imsystem/internal/repository/interfaces"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ChatService interface {
	// 返回该用户的所有私聊好友（去重后的好友列表）
	GetPrivateChatFriends(ctx context.Context, currentUserID string) ([]*domain.User, error)
	GetPrivateChatByUserID(ctx context.Context, userID string) ([]*domain.Chat, error)
	GetGroupChatByUserID(ctx context.Context, userID string) ([]*domain.Chat, error)
	CreatePrivateChat(ctx context.Context, userID1, userID2 string) (*domain.Chat, error)
	GetAllChatsByUserID(ctx context.Context, userID string) ([]*domain.Chat, error)
	GetChatMembers(ctx context.Context, chatID string) ([]*domain.User, error)
}

type chatService struct {
	chatRepo interfaces.ChatRepository
}

func NewChatService(chatRepo interfaces.ChatRepository) ChatService {
	return &chatService{
		chatRepo: chatRepo,
	}
}

// GetPrivateChatFriends 根据当前用户ID查询参与的 private 聊天，然后返回其它聊天成员作为好友信息
func (s *chatService) GetPrivateChatFriends(ctx context.Context, currentUserID string) ([]*domain.User, error) {
	// 查询当前用户参与的私聊
	chats, err := s.chatRepo.GetChatsByUserAndType(ctx, currentUserID, "private")
	if err != nil {
		return nil, err
	}
	userObjID, err := primitive.ObjectIDFromHex(currentUserID)
	if err != nil {
		return nil, err
	}
	friendMap := make(map[string]*domain.User)
	for _, chat := range chats {
		// 获取聊天成员
		strChatId := chat.ID.Hex()
		users, err := s.chatRepo.GetChatMembers(ctx, strChatId)
		if err != nil {
			// 出错可选择忽略该聊天
			continue
		}
		// 遍历聊天成员，排除自己
		for _, u := range users {
			if u.ID != userObjID {
				friendMap[u.ID.Hex()] = u
			}
		}
	}

	var friends []*domain.User
	for _, friend := range friendMap {
		friends = append(friends, friend)
	}
	return friends, nil
}

func (s *chatService) GetPrivateChatByUserID(ctx context.Context, userID string) ([]*domain.Chat, error) {
	return s.chatRepo.GetChatsByUserAndType(ctx, userID, "private")
}

func (s *chatService) GetGroupChatByUserID(ctx context.Context, userID string) ([]*domain.Chat, error) {
	return s.chatRepo.GetChatsByUserAndType(ctx, userID, "group")
}

func (s *chatService) CreatePrivateChat(ctx context.Context, userID1, userID2 string) (*domain.Chat, error) {
	// 创建聊天对象
	ObjectUserID1, _ := primitive.ObjectIDFromHex(userID1)
	ObjectUserID2, _ := primitive.ObjectIDFromHex(userID2)
	chat := &domain.Chat{
		ID:   primitive.NewObjectID(),
		Type: "private",
		Members: []domain.ChatMember{
			{UserID: ObjectUserID1, Role: "member", JoinedAt: time.Now()},
			{UserID: ObjectUserID2, Role: "member", JoinedAt: time.Now()},
		},
		CreatedAt: time.Now(),
		CreatedBy: userID1,
	}

	// 保存到数据库
	if err := s.chatRepo.CreatePrivateChat(ctx, chat); err != nil {
		return nil, err
	}

	return chat, nil
}

func (s *chatService) GetAllChatsByUserID(ctx context.Context, userID string) ([]*domain.Chat, error) {
    return s.chatRepo.GetAllChatsByUserID(ctx, userID)
}

func (s *chatService) GetChatMembers(ctx context.Context, chatID string) ([]*domain.User, error) {
	// 获取聊天成员
	users, err := s.chatRepo.GetChatMembers(ctx, chatID)
	if err != nil {
		return nil, err
	}
	return users, nil
}