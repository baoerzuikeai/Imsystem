"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { Message } from "@/types"

// 简化的WebSocket上下文，不依赖实际的WebSocket连接
interface WebSocketContextType {
  isConnected: boolean
  connect: () => void
  disconnect: () => void
  sendMessage: (chatId: string, content: string, attachments?: any[]) => void
  sendTyping: (chatId: string, isTyping: boolean) => void
  markAsRead: (chatId: string, messageIds: string[]) => void
  typingUsers: Record<string, string[]> // chatId -> userIds[]
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

interface WebSocketProviderProps {
  children: React.ReactNode
  userId: string
  onNewMessage?: (chatId: string, message: Message) => void
  onUserStatusChange?: (userId: string, isOnline: boolean) => void
  onChatUpdate?: (chat: any) => void
}

export function WebSocketProvider({
  children,
  userId,
  onNewMessage,
  onUserStatusChange,
  onChatUpdate,
}: WebSocketProviderProps) {
  const [isConnected, setIsConnected] = useState(true)
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({})

  // 模拟连接
  const connect = () => {
    setIsConnected(true)
    console.log("Mock WebSocket connected")
  }

  // 模拟断开连接
  const disconnect = () => {
    setIsConnected(false)
    console.log("Mock WebSocket disconnected")
  }

  // 模拟发送消息
  const sendMessage = (chatId: string, content: string, attachments?: any[]) => {
    console.log("Mock sending message to", chatId, content, attachments)
    // 这里不需要实际发送消息，因为我们在ChatLayout中直接处理了消息的添加
  }

  // 模拟发送正在输入状态
  const sendTyping = (chatId: string, isTyping: boolean) => {
    console.log("Mock sending typing status", chatId, isTyping)

    // 模拟本地状态更新
    if (isTyping) {
      setTypingUsers((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), userId],
      }))
    } else {
      setTypingUsers((prev) => ({
        ...prev,
        [chatId]: (prev[chatId] || []).filter((id) => id !== userId),
      }))
    }
  }

  // 模拟标记消息为已读
  const markAsRead = (chatId: string, messageIds: string[]) => {
    console.log("Mock marking messages as read", chatId, messageIds)
    // 这里不需要实际标记消息，因为我们在ChatLayout中直接处理了未读消息的更新
  }

  // 提供上下文值
  const contextValue: WebSocketContextType = {
    isConnected,
    connect,
    disconnect,
    sendMessage,
    sendTyping,
    markAsRead,
    typingUsers,
  }

  return <WebSocketContext.Provider value={contextValue}>{children}</WebSocketContext.Provider>
}

// 自定义 Hook 用于访问 WebSocket 上下文
export function useWebSocketContext() {
  const context = useContext(WebSocketContext)
  if (context === undefined) {
    throw new Error("useWebSocketContext must be used within a WebSocketProvider")
  }
  return context
}
