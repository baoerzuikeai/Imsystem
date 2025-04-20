"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface UseWebSocketOptions {
  url: string
  onMessage?: (data: any) => void
  onOpen?: () => void
  onClose?: () => void
  onError?: (error: Event) => void
  reconnectInterval?: number
  reconnectAttempts?: number
}

export function useWebSocket({
  url,
  onMessage,
  onOpen,
  onClose,
  onError,
  reconnectInterval = 5000,
  reconnectAttempts = 5,
}: UseWebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<number | null>(null)
  const reconnectCountRef = useRef(0)

  // 模拟连接
  const connect = useCallback(() => {
    console.log("Mock WebSocket connecting...")

    // 模拟连接成功
    setTimeout(() => {
      setIsConnected(true)
      if (onOpen) onOpen()
      console.log("Mock WebSocket connected")
    }, 500)

    return () => {
      // 清理
    }
  }, [onOpen])

  // 模拟断开连接
  const disconnect = useCallback(() => {
    console.log("Mock WebSocket disconnecting...")
    setIsConnected(false)
    if (onClose) onClose()
  }, [onClose])

  // 模拟发送消息
  const sendMessage = useCallback((data: any) => {
    console.log("Mock sending message:", data)
    return true
  }, [])

  // 模拟发送正在输入状态
  const sendTyping = useCallback((chatId: string, isTyping: boolean) => {
    console.log("Mock sending typing status:", chatId, isTyping)
    return true
  }, [])

  // 模拟发送已读回执
  const sendReadReceipt = useCallback((chatId: string, messageIds: string[]) => {
    console.log("Mock sending read receipt:", chatId, messageIds)
    return true
  }, [])

  // 初始连接
  useEffect(() => {
    connect()
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [connect])

  return {
    isConnected,
    connect,
    disconnect,
    sendMessage,
    sendTyping,
    sendReadReceipt,
  }
}
