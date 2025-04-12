package websocket

import (
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
		broadcast      chan []byte
	register       chan *Client
	unregister     chan *Client
	mutex          sync.RWMutex
	messageService service.MessageService
}

func NewManager(messageService service.MessageService) *Manager {
	return &Manager{
		clients:        make(map[string]*Client),
		broadcast:      make(chan []byte),
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
		case message := <-m.broadcast:
			m.mutex.RLock()
			for _, client := range m.clients {
				select {
				case client.Send <- message:
				default:
					close(client.Send)
					delete(m.clients, client.ID)
				}
			}
			m.mutex.RUnlock()
		}
	}
}

func (m *Manager) Register(client *Client) {
	m.register <- client // 实际上就是往 register 通道发送数据
}

func (m *Manager) Unregister(client *Client) {
	m.unregister <- client // 实际上就是往 unregister 通道发送数据
}

func (m *Manager) Broadcast(message []byte) {
	m.broadcast <- message // 实际上就是往 broadcast 通道发送数据
}
