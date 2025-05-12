package mongodb

import (
    "context"

    "github.com/baoerzuikeai/Imsystem/internal/domain"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "go.mongodb.org/mongo-driver/mongo"
)

type aiChatRepository struct {
    collection *mongo.Collection
}

func NewAIChatRepository(db *mongo.Database) *aiChatRepository {
    return &aiChatRepository{
        collection: db.Collection("ai_chats"),
    }
}

func (r *aiChatRepository) SaveAIChat(ctx context.Context, aiChat *domain.AIChat) error {
    _, err := r.collection.InsertOne(ctx, aiChat)
    return err
}

func (r *aiChatRepository) GetAIChatsByUserID(ctx context.Context, userID string) ([]*domain.AIChat, error) {
    userObjID, err := primitive.ObjectIDFromHex(userID)
    if err != nil {
        return nil, err
    }

    filter := bson.M{"userId": userObjID}
    cursor, err := r.collection.Find(ctx, filter)
    if err != nil {
        return nil, err
    }
    defer cursor.Close(ctx)

    var aiChats []*domain.AIChat
    if err := cursor.All(ctx, &aiChats); err != nil {
        return nil, err
    }
    return aiChats, nil
}