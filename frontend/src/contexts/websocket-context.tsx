// src/contexts/websocket-context.tsx
import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Message, Chat } from '@/types'; // 确保你的类型定义路径正确

// 定义发送消息的负载类型，根据后端 WSMessage 结构
// 从你提供的 websocket/message.go，后端期望的结构是 WSMessage
interface SendMessagePayload {
  chatId: string;
  type: 'chat' | 'code' | 'file'; // 对应后端 WSMessageType
  content: any; // 例如: string for 'chat', { language: string, content: string } for 'code', string (fileId) for 'file'
  language?: string; // 仅用于 type 'code'
  fileName?: string; // 仅用于 type 'file'
}

interface WebSocketContextType {
  ws: WebSocket | null;
  isConnected: boolean;
  sendMessage: (payload: SendMessagePayload) => boolean;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: React.ReactNode;
  userId: string;
  onNewMessage: (message: Message) => void;
  onUserStatusChange: (userId: string, isOnline: boolean) => void; // 保留，以防将来使用或后端发送此类消息
  onChatUpdate: (chat: Chat) => void; // 保留，以防将来使用或后端发送此类消息
}

const WEBSOCKET_URL ="ws://localhost:8080/api/v1/ws";

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
  userId,
  onNewMessage,
  onUserStatusChange, // 虽然目前没有明确处理，但保留接口
  onChatUpdate,       // 虽然目前没有明确处理，但保留接口
}) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) {
      if (ws) {
        ws.close();
        setWs(null);
        setIsConnected(false);
      }
      return;
    }

    const socket = new WebSocket(WEBSOCKET_URL); // 假设认证通过 cookie 或其他 HTTP 头处理

    socket.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
      setWs(socket);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string);
        console.log('WebSocket message received:', data);

        // 后端 client.go -> c.Manager.Broadcast(wsMessage.ChatID, messageJSON)
        // messageJSON 是 domain.Message 序列化后的结果。
        // domain.Message 结构: { id, chatId, senderId, type, content, createdAt }
        // type 是 "text", "code", "file"
        // content 是 { text, code: { language, content }, fileId, fileName }

        // 我们需要确保 data 的结构与前端的 Message 类型兼容
        // 或者在这里进行转换
        if (data.id && data.chatId && data.senderId && data.type && data.content && data.createdAt) {
          // 假设 data 结构与前端 Message 类型基本一致或可直接使用
          // 你可能需要将后端的 MessageType ("text", "code", "file") 映射到前端的 Message.type
          // 以及将后端的 MessageContent 映射到前端的 Message.content
          const newMessage: Message = {
            id: data.id,
            chatId: data.chatId,
            senderId: data.senderId,
            type: data.type, // domain.MessageType ("text", "code", "file")

            // 前端 Message.type 是 "text" | "file". 你需要确保类型对齐
            // 如果后端发送 "code", 前端 Message 类型也需要支持 "code"
            content: data.content, // domain.MessageContent

            // 前端 MessageContent { text?, file?: { fileId, fileName } }
            // 需要转换
            createdAt: new Date(data.createdAt), // 确保是 Date 对象
            readBy: [],
            message: undefined
          };

          // 进行 content 结构的转换 (如果需要)
          if (newMessage.type === 'text' && typeof data.content.text !== 'undefined') {
            newMessage.content = { text: data.content.text };
          } else if (newMessage.type === 'file' && data.content.fileId) {
            newMessage.content = {  fileId: data.content.fileId, fileName: data.content.fileName || '' };
          } else if (newMessage.type === 'code' && data.content.code) {
             // 如果前端 Message 类型要支持 code, 需要添加相应处理
             // newMessage.content = { code: { language: data.content.code.language, codeText: data.content.code.content } };
             // 当前前端 MessageContent 没有 code 字段，所以这里可能需要调整 Message 类型或忽略 code 类型的消息
             console.warn("Received 'code' message type, but frontend Message.content doesn't explicitly support it. Data:", data);
             // 暂时作为文本处理或特定处理
             newMessage.content = { text: `Code: ${data.content.code.language}\n${data.content.code.content}` };
          } else {
            console.warn('Received message with unhandled content structure for type:', newMessage.type, data.content);
            // 可以选择丢弃或者尝试以某种通用方式处理
            return; // 或者不调用 onNewMessage
          }

          onNewMessage(newMessage);

        } else if (data.type === 'user_status_update') { // 示例: 如果后端发送用户状态
          onUserStatusChange(data.payload.userId, data.payload.isOnline);
        } else if (data.type === 'chat_update') { // 示例: 如果后端发送聊天更新
          // 确保 data.payload 结构与 Chat 类型匹配
          onChatUpdate(data.payload as Chat);
        } else {
          console.warn('Received unknown WebSocket message structure:', data);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket Disconnected');
      setIsConnected(false);
      setWs(null);
    };

    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setIsConnected(false);
      setWs(null);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
      setIsConnected(false);
      setWs(null);
    };
  }, [userId, onNewMessage, onUserStatusChange, onChatUpdate]);

  const sendMessage = useCallback((payload: SendMessagePayload): boolean => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      // 构建的消息直接是后端 client.go 中 ReadPump 解析的 WSMessage 结构
      // WSMessage: { Type, ChatID, Content, Language?, FileName? }
      // payload.type 已经是 'chat', 'code', 'file' (对应 WSMessageType)
      // payload.content 对于 'chat' 是 string, 对于 'code' 是 string (code content), 对于 'file' 是 string (fileId)
      // 根据后端 client.go:
      // case WSMessageTypeChat: msg.Content.Text = wsMessage.Content.(string)
      // case WSMessageTypeCode: msg.Content.Code = &domain.Code{Language: wsMessage.Language, Content: wsMessage.Content.(string)}
      // case WSMessageTypeFile: msg.Content.FileID = wsMessage.Content.(string); msg.Content.FileName = wsMessage.FileName
      const messageToSend: any = {
        type: payload.type, // 'chat', 'code', 'file'
        chatId: payload.chatId,
        content: payload.content, // 根据 type，这个 content 的结构要匹配后端期望
      };

      if (payload.type === 'code' && payload.language) {
        messageToSend.language = payload.language;
      }
      if (payload.type === 'file' && payload.fileName) {
        messageToSend.fileName = payload.fileName;
      }

      try {
        ws.send(JSON.stringify(messageToSend));
        console.log('WebSocket message sent:', messageToSend);
        return true;
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
        return false;
      }
    } else {
      console.warn('WebSocket is not connected or not available.');
      return false;
    }
  }, [ws]);

  return (
    <WebSocketContext.Provider value={{ ws, isConnected, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};