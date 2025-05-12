package domain

import (
    "time"

    "go.mongodb.org/mongo-driver/bson/primitive"
)

type File struct {
    ID         primitive.ObjectID  `bson:"_id,omitempty" json:"id"`
    Name       string              `bson:"name" json:"name"`
    Type       string              `bson:"type" json:"type"` // 文件类型 (MIME)
    Size       int64               `bson:"size" json:"size"` // 文件大小 (字节)
    URL        string              `bson:"url" json:"url"`   // 文件存储路径或 URL
    UploaderID primitive.ObjectID  `bson:"uploaderId" json:"uploaderId"`
    ChatID     *primitive.ObjectID `bson:"chatId,omitempty" json:"chatId,omitempty"` // 可选字段
    Downloads  int64               `bson:"downloads" json:"downloads"`
    CreatedAt  time.Time           `bson:"createdAt" json:"createdAt"`
}