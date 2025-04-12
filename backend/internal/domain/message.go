package domain

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type MessageType string

const (
	TextMessage MessageType = "text"
	CodeMessage MessageType = "code"
	FileMessage MessageType = "file"
)

type Message struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	ChatID    string             `bson:"chatId" json:"chatId"`
	SenderID  string             `bson:"senderId" json:"senderId"`
	Type      MessageType        `bson:"type" json:"type"`
	Content   MessageContent     `bson:"content" json:"content"`
	CreatedAt time.Time          `bson:"createdAt" json:"createdAt"`
}

type MessageContent struct {
	Text     string `bson:"text,omitempty" json:"text,omitempty"`
	Code     *Code  `bson:"code,omitempty" json:"code,omitempty"`
	FileID   string `bson:"fileId,omitempty" json:"fileId,omitempty"`
	FileName string `bson:"fileName,omitempty" json:"fileName,omitempty"`
}

type Code struct {
	Language string `bson:"language" json:"language"`
	Content  string `bson:"content" json:"content"`
}
