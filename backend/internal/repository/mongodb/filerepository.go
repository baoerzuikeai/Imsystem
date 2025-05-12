package mongodb

import (
    "context"

    "github.com/baoerzuikeai/Imsystem/internal/domain"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "go.mongodb.org/mongo-driver/mongo"
)

type fileRepository struct {
    collection *mongo.Collection
}

func NewFileRepository(db *mongo.Database) *fileRepository {
    return &fileRepository{
        collection: db.Collection("files"),
    }
}

func (r *fileRepository) Save(ctx context.Context, file *domain.File) error {
    if file.ID.IsZero() {
        file.ID = primitive.NewObjectID()
    }
    _, err := r.collection.InsertOne(ctx, file)
    return err
}

func (r *fileRepository) GetByID(ctx context.Context, id string) (*domain.File, error) {
    objectID, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        return nil, err
    }

    var file domain.File
    err = r.collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&file)
    if err != nil {
        return nil, err
    }

    return &file, nil
}