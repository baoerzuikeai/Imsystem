package service

import (
	"context"
	"errors"
	"time"

	"github.com/baoerzuikeai/Imsystem/internal/domain"
	"github.com/baoerzuikeai/Imsystem/internal/repository/interfaces"
	"github.com/baoerzuikeai/Imsystem/pkg/jwt"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	userRepo  interfaces.UserRepository
	jwtSecret string
	jwtExpiry int64
}

func NewAuthService(userRepo interfaces.UserRepository, jwtSecret string, jwtExpiry int64) *AuthService {
	return &AuthService{
		userRepo:  userRepo,
		jwtSecret: jwtSecret,
		jwtExpiry: jwtExpiry,
	}
}

func (s *AuthService) Register(ctx context.Context, username, email, password, nickname string) (*domain.User, error) {
	// 检查邮箱是否已存在
	if _, err := s.userRepo.GetByEmail(ctx, email); err == nil {
		return nil, errors.New("email already exists")
	}

	// 检查用户名是否已存在
	if _, err := s.userRepo.GetByUsername(ctx, username); err == nil {
		return nil, errors.New("username already exists")
	}

	// 密码加密
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &domain.User{
		ID:       primitive.NewObjectID(),
		Username: username,
		Email:    email,
		Password: string(hashedPassword),
		Profile: domain.Profile{
			Nickname: nickname,
		},
		Status: domain.UserStatus{
			Online:   true,
			LastSeen: time.Now(),
		},
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := s.userRepo.Create(ctx, user); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *AuthService) Login(ctx context.Context, email, password string) (*domain.User, string, error) {
	user, err := s.userRepo.GetByEmail(ctx, email)
	if err != nil {
		return nil, "", errors.New("invalid email or password")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, "", errors.New("invalid email or password")
	}

	// 生成JWT token
	token, err := jwt.GenerateToken(user.ID.Hex(), s.jwtSecret, s.jwtExpiry)
	if err != nil {
		return nil, "", err
	}

	// 更新用户状态
	user.Status.Online = true
	user.Status.LastSeen = time.Now()
	user.UpdatedAt = time.Now()

	if err := s.userRepo.Update(ctx, user); err != nil {
		return nil, "", err
	}

	return user, token, nil
}