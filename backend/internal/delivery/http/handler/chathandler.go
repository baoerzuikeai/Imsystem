package handler

import (
    "net/http"

    "github.com/baoerzuikeai/Imsystem/internal/service"
    "github.com/gin-gonic/gin"
)

type ChatHandler struct {
    chatService service.ChatService
}

func NewChatHandler(chatService service.ChatService) *ChatHandler {
    return &ChatHandler{
        chatService: chatService,
    }
}

// GetPrivateChatFriends 从 gin.Context 中获取当前用户ID并返回好友列表
func (h *ChatHandler) GetPrivateChatFriends(c *gin.Context) {
    // 假设认证中间件已经将 "userID" 写入 gin.Context
    userID, exists := c.Get("userID")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "用户未登录"})
        return
    }
    strUserID, ok := userID.(string)
    if !ok {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "用户ID格式错误"})
        return
    }

    friends, err := h.chatService.GetPrivateChatFriends(c.Request.Context(), strUserID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, friends)
}