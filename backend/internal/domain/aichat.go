package domain

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AIChat struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    string             `bson:"userId" json:"userId"`
	Question  string             `bson:"question" json:"question"`
	Answer    string             `bson:"answer" json:"answer"`
	Type      string             `bson:"type" json:"type"` // 类型，例如 "qa", "code_review"
	CreatedAt time.Time          `bson:"createdAt" json:"createdAt"`
}
