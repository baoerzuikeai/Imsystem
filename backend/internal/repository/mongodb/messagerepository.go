package mongodb

import (
	"context"
	"github.com/baoerzuikeai/Imsystem/internal/domain"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type messageRepository struct {
	collection *mongo.Collection
}

func NewMessageRepository(db *mongo.Database) *messageRepository {
	return &messageRepository{
		collection: db.Collection("messages"),
	}
}

func (r *messageRepository) Create(ctx context.Context, message *domain.Message) error {
	if message.ID.IsZero() {
		message.ID = primitive.NewObjectID()
	}
	_, err := r.collection.InsertOne(ctx, message)
	return err
}

func (r *messageRepository) GetByChatID(ctx context.Context, chatID string, limit, offset int) ([]*domain.Message, error) {
	opts := options.Find().
		SetSort(bson.D{{Key: "createdAt", Value: 1}}). // 按时间倒序
		SetSkip(int64(offset)).
		SetLimit(int64(limit))

	cursor, err := r.collection.Find(ctx, bson.M{"chatId": chatID}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var messages []*domain.Message
	if err = cursor.All(ctx, &messages); err != nil {
		return nil, err
	}
	return messages, nil
}

func (r *messageRepository) GetByID(ctx context.Context, id string) (*domain.Message, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var message domain.Message
	err = r.collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&message)
	if err != nil {
		return nil, err
	}
	return &message, nil
}

func (r *messageRepository) Delete(ctx context.Context, id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = r.collection.DeleteOne(ctx, bson.M{"_id": objectID})
	return err
}
