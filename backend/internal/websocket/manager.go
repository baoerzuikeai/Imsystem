package websocket

import (
	"context"
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
	clients        map[string]*Client
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
		clients:        make(map[string]*Client),
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
			m.clients[client.ID] = client
			m.mutex.Unlock()
		case client := <-m.unregister:
			if _, ok := m.clients[client.ID]; ok {
				m.mutex.Lock()
				delete(m.clients, client.ID)
				close(client.Send)
				m.mutex.Unlock()
			}
		case broadcastMsg := <-m.broadcast:
			m.handleBroadcast(broadcastMsg)
		}
	}
}

func (m *Manager) handleBroadcast(broadcastMsg *BroadcastMessage) {
	// 根据 ChatID 查询成员列表
	members, err := m.messageService.GetChatMembers(context.Background(), broadcastMsg.ChatID)
	if err != nil {
		return
	}

	m.mutex.RLock()
	defer m.mutex.RUnlock()

	// 遍历成员列表，检查是否在线
	for _, member := range members {
		if client, ok := m.clients[member.ID.Hex()]; ok {
			select {
			case client.Send <- broadcastMsg.Message:
			default:
				close(client.Send)
				delete(m.clients, client.ID)
			}
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
