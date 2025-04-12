package websocket

type WSMessageType string

const (
	WSMessageTypeChat WSMessageType = "chat"
	WSMessageTypeCode WSMessageType = "code"
	WSMessageTypeFile WSMessageType = "file"
)

type WSMessage struct {
	Type     WSMessageType `json:"type"`
	ChatID   string        `json:"chatId"`
	Content  interface{}   `json:"content"`
	Language string        `json:"language,omitempty"` // 用于代码消息
	FileName string        `json:"fileName,omitempty"` // 用于文件消息
}
