package handler

import (
	"log"
	"net/http"

	ws "github.com/baoerzuikeai/Imsystem/internal/websocket"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // 在生产环境中需要更严格的检查
	},
}

type Handler struct {
	manager *ws.Manager
}

func NewHandler(manager *ws.Manager) *Handler {
	return &Handler{
		manager: manager,
	}
}

func (h *Handler) HandleWebSocket(c *gin.Context) {
	userID := c.GetString("userID") // 从JWT中获取
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Printf("Failed to upgrade connection: %v", err)
		return
	}

	client := &ws.Client{
		ID:      userID,
		UserID:  userID,
		Socket:  conn,
		Send:    make(chan []byte, 256),
		Manager: h.manager,
	}

	h.manager.Register(client)

	// 启动读写goroutines
	go client.ReadPump()
	go client.WritePump()
}
