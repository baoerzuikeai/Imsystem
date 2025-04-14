package domain

import "time"

// Chat 表示聊天的领域模型
type Chat struct {
	ID            string       `bson:"_id" json:"id"`                            // 聊天 ID
	Type          string       `bson:"type" json:"type"`                         // 聊天类型 ('private' 或 'group')
	Title         string       `bson:"title,omitempty" json:"title,omitempty"`   // 群聊名称（私聊为 null）
	Avatar        string       `bson:"avatar,omitempty" json:"avatar,omitempty"` // 群聊头像（私聊为 null）
	Members       []ChatMember `bson:"members" json:"members"`                   // 成员列表
	LastMessageAt time.Time    `bson:"lastMessageAt" json:"lastMessageAt"`       // 最后消息时间
	CreatedBy     string       `bson:"createdBy" json:"createdBy"`               // 创建者 ID
	CreatedAt     time.Time    `bson:"createdAt" json:"createdAt"`               // 创建时间
}

// ChatMember 表示聊天成员的结构
type ChatMember struct {
	UserID   string    `bson:"userId" json:"userId"`     // 成员 ID
	Role     string    `bson:"role" json:"role"`         // 成员角色 ('owner', 'member')
	JoinedAt time.Time `bson:"joinedAt" json:"joinedAt"` // 加入时间
}
