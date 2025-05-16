package websocket

import (
	"context"
	"log"
	"sync"

	"github.com/baoerzuikeai/Imsystem/internal/service"
	"github.com/gorilla/websocket"
)

type Client struct {
	ID      string
	UserID  string
	Socket  *websocket.Conn
	Send    chan []byte
	Manager *Manager
}

type Manager struct {
	userClients    map[string]map[string]*Client
	broadcast      chan *BroadcastMessage
	register       chan *Client
	unregister     chan *Client
	mutex          sync.RWMutex
	messageService service.MessageService
}

type BroadcastMessage struct {
	ChatID  string
	Message []byte
}

func NewManager(messageService service.MessageService) *Manager {
	return &Manager{
		userClients:    make(map[string]map[string]*Client),
		broadcast:      make(chan *BroadcastMessage),
		register:       make(chan *Client),
		unregister:     make(chan *Client),
		messageService: messageService,
	}
}

func (m *Manager) Start() {
	for {
		select {
		case client := <-m.register:
			m.mutex.Lock()
			if _, ok := m.userClients[client.UserID]; !ok {
				m.userClients[client.UserID] = make(map[string]*Client)
			}
			m.userClients[client.UserID][client.ID] = client // client.ID 现在是唯一的 connectionID
			log.Printf("Client registered: UserID %s, ConnectionID %s", client.UserID, client.ID)
			m.mutex.Unlock()
		case client := <-m.unregister:
			m.mutex.Lock()
			if userConnections, ok := m.userClients[client.UserID]; ok {
				if _, connOk := userConnections[client.ID]; connOk {
					delete(m.userClients[client.UserID], client.ID)
					if len(m.userClients[client.UserID]) == 0 {
						delete(m.userClients, client.UserID) // 如果该用户已无任何连接，则删除用户条目
					}
					close(client.Send) // 关闭此特定连接的发送通道
					log.Printf("Client unregistered: UserID %s, ConnectionID %s", client.UserID, client.ID)
				}
			}
			m.mutex.Unlock()
		case broadcastMsg := <-m.broadcast:
			m.handleBroadcast(broadcastMsg)
		}
	}
}

func (m *Manager) handleBroadcast(broadcastMsg *BroadcastMessage) {
	members, err := m.messageService.GetChatMembers(context.Background(), broadcastMsg.ChatID) // 这返回 []*domain.User
	if err != nil {
		log.Printf("Error getting chat members for broadcast: %v", err)
		return
	}

	m.mutex.RLock() // 加读锁来安全地读取 userClients

	clientsToNotify := []*Client{}
	for _, member := range members { // member 是 *domain.User
		userID := member.ID.Hex()
		if userConnections, ok := m.userClients[userID]; ok { // 检查该用户是否有活动的连接
			for _, clientInstance := range userConnections { // 遍历该用户的所有连接
				clientsToNotify = append(clientsToNotify, clientInstance)
			}
		}
	}
	m.mutex.RUnlock() // 释放读锁

	// 在锁外部进行发送操作，避免长时间持有锁
	for _, clientInstance := range clientsToNotify {
		select {
		case clientInstance.Send <- broadcastMsg.Message:
			// 消息已发送
		default:
			// 发送通道已满，可能客户端处理慢或已断开。
			// writePump 中有超时和错误处理，它会负责关闭连接并触发 unregister。
			// 这里可以考虑记录日志，表明某个客户端的通道满了。
			log.Printf("Client send channel full for UserID %s, ConnectionID %s. Message not sent to this connection.", clientInstance.UserID, clientInstance.ID)
			// 注意：不要在这里直接 close(clientInstance.Send) 或 delete from map，
			// 这些操作应由 unregister 统一处理，以避免竞态条件和死锁。
		}
	}
}

func (m *Manager) Register(client *Client) {
	m.register <- client
}

func (m *Manager) Unregister(client *Client) {
	m.unregister <- client
}

func (m *Manager) Broadcast(chatID string, message []byte) {
	m.broadcast <- &BroadcastMessage{
		ChatID:  chatID,
		Message: message,
	}
}
