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

func (h *ChatHandler) GetPrivateChatByUserID(c *gin.Context) {
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
	chats, err := h.chatService.GetPrivateChatByUserID(c.Request.Context(), strUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, chats)
}

func (h *ChatHandler) GetGroupChatByUserID(c *gin.Context) {
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
	chats, err := h.chatService.GetGroupChatByUserID(c.Request.Context(), strUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, chats)
}

func (h *ChatHandler) CreatePrivateChat(c *gin.Context) {
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

	var request struct {
		TargetUserID string `json:"targetUserId"` // 目标用户 ID
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "请求参数错误"})
		return
	}

	// 创建 Private Chat
	chat, err := h.chatService.CreatePrivateChat(c.Request.Context(), strUserID, request.TargetUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"chat": chat, "message": "创建成功"})
}

func (h *ChatHandler) GetAllChats(c *gin.Context) {
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

	chats, err := h.chatService.GetAllChatsByUserID(c.Request.Context(), strUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, chats)
}

func (h *ChatHandler) GetChatMembers(c *gin.Context) {
	chatID := c.Param("chatId")
	if chatID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "chatId 不能为空"})
		return
	}

	users, err := h.chatService.GetChatMembers(c.Request.Context(), chatID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, users)
}

func (h *ChatHandler) CreateGroupChat(c *gin.Context) {
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

	var request struct {
		Title     string   `json:"title"`     // 群聊标题
		MemberIDs []string `json:"memberIds"` // 成员用户ID列表
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "请求参数错误"})
		return
	}

	for i, member := range request.MemberIDs {
		if member == strUserID {
			request.MemberIDs = append(request.MemberIDs[:i], request.MemberIDs[i+1:]...)
			break
		}
	}
	// 创建群聊
	chat, err := h.chatService.CreateGroupChat(c.Request.Context(), strUserID, request.Title, request.MemberIDs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return 
	}

	c.JSON(http.StatusOK, gin.H{"chat": chat, "message": "创建成功"})
}
