package websocket

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"github.com/gorilla/websocket"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/baoerzuikeai/Imsystem/internal/domain"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	maxMessageSize = 512
)

func (c *Client) ReadPump() {
	defer func() {
		c.Manager.Unregister(c)
		c.Socket.Close()
	}()

	c.Socket.SetReadLimit(maxMessageSize)
	c.Socket.SetReadDeadline(time.Now().Add(pongWait))
	c.Socket.SetPongHandler(func(string) error {
		c.Socket.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		_, message, err := c.Socket.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}

		// 解析消息
		var wsMessage WSMessage
		if err := json.Unmarshal(message, &wsMessage); err != nil {
			log.Printf("error parsing message: %v", err)
			continue
		}

		// 保存消息到数据库
		msg := &domain.Message{
			ID:        primitive.NewObjectID(),
			ChatID:    wsMessage.ChatID,
			SenderID:  c.UserID,
			CreatedAt: time.Now(),
		}

		switch wsMessage.Type {
		case WSMessageTypeChat:
			msg.Type = domain.TextMessage
			msg.Content.Text = wsMessage.Content.(string)
		case WSMessageTypeCode:
			msg.Type = domain.CodeMessage
			msg.Content.Code = &domain.Code{
				Language: wsMessage.Language,
				Content:  wsMessage.Content.(string),
			}
		case WSMessageTypeFile:
			msg.Type = domain.FileMessage
			msg.Content.FileID = wsMessage.Content.(string)
			msg.Content.FileName = wsMessage.FileName
		}

		if err := c.Manager.messageService.Create(context.Background(), msg); err != nil {
			log.Printf("error saving message: %v", err)
			continue
		}

		// 广播消息
		messageJSON, _ := json.Marshal(msg)
		c.Manager.Broadcast(wsMessage.ChatID, messageJSON)
	}
}

func (c *Client) WritePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.Socket.Close()
	}()

	for {
		select {
		case message, ok := <-c.Send:
			c.Socket.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.Socket.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.Socket.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			n := len(c.Send)
			for i := 0; i < n; i++ {
				w.Write([]byte{'\n'})
				w.Write(<-c.Send)
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.Socket.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.Socket.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
