package handler

import (
	"net/http"

	"github.com/baoerzuikeai/Imsystem/internal/service"
	"github.com/gin-gonic/gin"
)

type AIChatHandler struct {
	aiChatService service.AIChatService
}

func NewAIChatHandler(aiChatService service.AIChatService) *AIChatHandler {
	return &AIChatHandler{
		aiChatService: aiChatService,
	}
}

func (h *AIChatHandler) HandleAIChat(c *gin.Context) {
	// 从 JWT 中获取用户 ID
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

	// 解析前端传递的请求体
	var request struct {
		History  []service.Message `json:"history"`
		Question string            `json:"question"` // 用户提问
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "请求参数错误"})
		return
	}

	// 调用 AI 服务获取回答
	answer, err := h.aiChatService.GetAIResponse(c.Request.Context(), strUserID, request.History, request.Question)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "AI 服务请求失败"})
		return
	}
	// 存储 AI 聊天记录到数据库
	err = h.aiChatService.SaveAIChat(c.Request.Context(), strUserID, request.Question, answer[0].Message.Content)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "存储聊天记录失败"})
		return
	}

	// 返回 AI 的回答给前端
	c.JSON(http.StatusOK, gin.H{
		"question": request.Question,
		"chioce":   answer,
	})
}
