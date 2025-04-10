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