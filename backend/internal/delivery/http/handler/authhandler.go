package handler

import (
	"net/http"

	"github.com/baoerzuikeai/Imsystem/internal/delivery/http/dto"
	"github.com/baoerzuikeai/Imsystem/internal/service"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authService *service.AuthService
}

func NewAuthHandler(authService *service.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
	}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req dto.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.authService.Register(c.Request.Context(), req.Username, req.Email, req.Password, req.Nickname)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User registered successfully",
		"user": dto.UserInfo{
			ID:       user.ID.Hex(),
			Username: user.Username,
			Email:    user.Email,
			Nickname: user.Profile.Nickname,
			Avatar:   user.Avatar,
		},
	})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req dto.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, token, err := h.authService.Login(c.Request.Context(), req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.SetCookie("token", token, 3600, "/", "", false, true)
	c.JSON(http.StatusOK, dto.AuthResponse{
		Token: token,
		User: &dto.UserInfo{
			ID:       user.ID.Hex(),
			Username: user.Username,
			Email:    user.Email,
			Nickname: user.Profile.Nickname,
			Avatar:   user.Avatar,
		},
	})
}

func (h *AuthHandler) GetUserDetail(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "userID not found in context"})
		return
	}

	userIDString, ok := userID.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid userID type in context"})
		return
	}

	user, err := h.authService.GetUserByID(c.Request.Context(), userIDString)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK,user)
}


func (h *AuthHandler) SearchUsers(c *gin.Context) {
    keyword := c.Query("keyword") // 从查询参数中获取搜索关键字
    if keyword == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "搜索关键字不能为空"})
        return
    }

    users, err := h.authService.SearchUsers(c.Request.Context(), keyword)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, users)
}