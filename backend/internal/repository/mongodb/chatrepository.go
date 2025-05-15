package mongodb

import (
	"context"
	"errors"

	"github.com/baoerzuikeai/Imsystem/internal/domain"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type chatRepository struct {
	collection *mongo.Collection
	userColl   *mongo.Collection
}

// NewChatRepository 创建一个新的 ChatRepository 实例
func NewChatRepository(db *mongo.Database) *chatRepository {
	return &chatRepository{
		collection: db.Collection("chats"),
		userColl:   db.Collection("users"),
	}
}

// GetChatMembers 根据 ChatID 获取聊天成员
func (r *chatRepository) GetChatMembers(ctx context.Context, chatID string) ([]*domain.User, error) {
	// 将字符串 chatID 转换为 ObjectId
	chatObjectID, err := primitive.ObjectIDFromHex(chatID)
	if err != nil {
		return nil, err // 如果转换失败，返回错误
	}

	// 查询 Chat 文档，获取成员列表
	var chat domain.Chat
	err = r.collection.FindOne(ctx, bson.M{"_id": chatObjectID}).Decode(&chat)
	if err != nil {
		return nil, err
	}

	// 遍历成员列表，查询每个成员的详细信息
	var users []*domain.User
	for _, member := range chat.Members {
		// 将成员的 userId 转换为 ObjectId
		// 查询用户信息
		var user domain.User
		err = r.userColl.FindOne(ctx, bson.M{"_id": member.UserID}).Decode(&user)
		if err != nil {
			continue // 如果查询失败，跳过该成员
		}

		users = append(users, &user)
	}

	return users, nil
}

// GetChatByID 根据 ChatID 获取聊天详情
func (r *chatRepository) GetChatByID(ctx context.Context, chatID string) (*domain.Chat, error) {
	var chat domain.Chat
	err := r.collection.FindOne(ctx, bson.M{"_id": chatID}).Decode(&chat)
	if err != nil {
		return nil, err
	}
	return &chat, nil
}

// CreateChat 创建新的聊天
func (r *chatRepository) CreateChat(ctx context.Context, chat *domain.Chat) error {
	_, err := r.collection.InsertOne(ctx, chat)
	return err
}

// UpdateChat 更新聊天信息
func (r *chatRepository) UpdateChat(ctx context.Context, chat *domain.Chat) error {
	filter := bson.M{"_id": chat.ID}
	update := bson.M{"$set": chat}
	_, err := r.collection.UpdateOne(ctx, filter, update, options.Update().SetUpsert(false))
	return err
}

// DeleteChat 删除聊天
func (r *chatRepository) DeleteChat(ctx context.Context, chatID string) error {
	_, err := r.collection.DeleteOne(ctx, bson.M{"_id": chatID})
	return err
}

func (r *chatRepository) GetChatsByUserAndType(ctx context.Context, userID string, chatType string) ([]*domain.Chat, error) {
	userObjID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}
	filter := bson.M{
		"type": chatType,
		"members": bson.M{
			"$elemMatch": bson.M{
				"userId": userObjID,
			},
		},
	}
	cursor, err := r.collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var chats []*domain.Chat
	if err := cursor.All(ctx, &chats); err != nil {
		return nil, err
	}
	return chats, nil
}

func (r *chatRepository) CreatePrivateChat(ctx context.Context, chat *domain.Chat) error {
	// 检查是否已经存在相同成员的私聊
	filter := bson.M{
		"type": "private",
		"$and": []bson.M{
			{"members": bson.M{"$elemMatch": bson.M{"userId": chat.Members[0].UserID}}},
			{"members": bson.M{"$elemMatch": bson.M{"userId": chat.Members[1].UserID}}},
		},
	}
	existingChat := r.collection.FindOne(ctx, filter)
	if existingChat.Err() == nil {
		return errors.New("私聊已存在")
	}
	_, err := r.collection.InsertOne(ctx, chat)
	return err
}

func (r *chatRepository) GetAllChatsByUserID(ctx context.Context, userID string) ([]*domain.Chat, error) {
	userObjID,_ := primitive.ObjectIDFromHex(userID)
	filter := bson.M{
		"members": bson.M{
			"$elemMatch": bson.M{"userId": userObjID},
		},
	}

	cursor, err := r.collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var chats []*domain.Chat
	if err := cursor.All(ctx, &chats); err != nil {
		return nil, err
	}
	return chats, nil
}


func (r *chatRepository) CreateGroupChat(ctx context.Context, chat *domain.Chat) error {
    _, err := r.collection.InsertOne(ctx, chat)
    return err
}