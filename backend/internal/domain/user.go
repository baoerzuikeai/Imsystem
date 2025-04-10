package domain

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Username  string             `bson:"username" json:"username"`
	Email     string             `bson:"email" json:"email"`
	Password  string             `bson:"password" json:"-"`
	Avatar    string             `bson:"avatar" json:"avatar"`
	Status    UserStatus         `bson:"status" json:"status"`
	Profile   Profile            `bson:"profile" json:"profile"`
	CreatedAt time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time          `bson:"updatedAt" json:"updatedAt"`
}

type UserStatus struct {
	Online   bool      `bson:"online" json:"online"`
	LastSeen time.Time `bson:"lastSeen" json:"lastSeen"`
}

type Profile struct {
	Nickname string `bson:"nickname" json:"nickname"`
	Bio      string `bson:"bio" json:"bio"`
}
