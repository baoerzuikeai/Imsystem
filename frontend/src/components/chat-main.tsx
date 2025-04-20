"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Menu, Video, Phone, MoreHorizontal, Smile, Paperclip, Send, Users, Info } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useWebSocketContext } from "@/contexts/websocket-context"
import type { Chat, User } from "@/types"
import { MessageBubble } from "@/components/message-bubble"
import { getChatAvatar, getChatTitle, getMessagesByChatId, getUserOnlineStatus } from "@/data/mock-data"

interface ChatMainProps {
  chat: Chat | null
  onSendMessage: (content: string, type: "text" | "file", fileId?: string) => void
  toggleSidebar: () => void
  users: User[]
  onGroupInfoClick?: () => void
}

export function ChatMain({ chat, onSendMessage, toggleSidebar, users, onGroupInfoClick }: ChatMainProps) {
  const [messageInput, setMessageInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<number | null>(null)

  // 使用 WebSocket 上下文
  const { sendTyping, typingUsers } = useWebSocketContext()

  // 获取聊天消息
  const messages = chat ? getMessagesByChatId(chat._id) : []

  // 处理群聊和单聊的不同逻辑
  const isGroup = chat?.type === "group"
  const chatTitle = chat ? getChatTitle(chat._id) : ""
  const chatAvatar = chat ? getChatAvatar(chat._id) : ""

  // 获取群聊成员信息
  const groupMembers =
    isGroup && chat
      ? chat.members
          .map((member) => users.find((user) => user._id === member.userId))
          .filter((user): user is User => user !== undefined)
      : []

  // 获取在线成员数量
  const onlineMembers = groupMembers.filter((member) => getUserOnlineStatus(member._id)).length

  // 获取当前聊天中正在输入的用户
  const chatTypingUsers = chat ? typingUsers[chat._id] || [] : []
  const typingUserNames = chatTypingUsers
    .map((userId) => {
      const user = users.find((u) => u._id === userId)
      return user ? user.profile.nickname || user.username : ""
    })
    .filter(Boolean)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMessageInput(value)

    // 处理输入状态
    if (chat) {
      if (!isTyping && value.length > 0) {
        setIsTyping(true)
        sendTyping(chat._id, true)
      }

      // 清除之前的超时
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // 设置新的超时 - 2秒后停止"正在输入"状态
      typingTimeoutRef.current = window.setTimeout(() => {
        if (isTyping) {
          setIsTyping(false)
          sendTyping(chat._id, false)
        }
      }, 2000)
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chat || !messageInput.trim()) return

    // 更新本地状态
    onSendMessage(messageInput, "text")

    // 清空输入框和输入状态
    setMessageInput("")
    if (isTyping) {
      setIsTyping(false)
      sendTyping(chat._id, false)

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = null
      }
    }
  }

  // 清理超时
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20 border-l border-border">
        <div className="text-center">
          <h3 className="text-lg font-medium">No chat selected</h3>
          <p className="text-muted-foreground">Select a chat to start messaging</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full border-l border-border shadow-sm">
      <div className="border-b border-border p-4 flex justify-between items-center bg-background">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          <Avatar>
            <AvatarImage src={chatAvatar || "/placeholder.svg"} alt={chatTitle} />
            <AvatarFallback>
              {isGroup ? <Users className="h-4 w-4 text-primary" /> : chatTitle.substring(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="font-medium">{chatTitle}</h2>
            {isGroup ? (
              <p className="text-xs text-muted-foreground">
                {onlineMembers} online • {groupMembers.length} members
              </p>
            ) : (
              <p className="text-xs text-green-500">
                {getUserOnlineStatus(chat.members.find((m) => m.userId !== "user-current")?.userId || "")
                  ? "Online"
                  : "Offline"}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isGroup && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onGroupInfoClick}>
                    <Info className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Group Info</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar border-left-0">
        <div className="flex flex-col gap-4">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageBubble
                key={message._id}
                message={message}
                isCurrentUser={message.senderId === "user-current"}
                user={users.find((u) => u._id === message.senderId)}
              />
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No messages yet. Start a conversation!</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {typingUserNames.length > 0 && (
        <div className="px-4 py-1 text-xs text-muted-foreground">
          {typingUserNames.length === 1
            ? `${typingUserNames[0]} is typing...`
            : `${typingUserNames.join(", ")} are typing...`}
        </div>
      )}

      <form onSubmit={handleSendMessage} className="border-t border-border p-4 flex items-center gap-2 bg-background">
        <Button type="button" variant="ghost" size="icon">
          <Smile className="h-5 w-5" />
        </Button>
        <Button type="button" variant="ghost" size="icon">
          <Paperclip className="h-5 w-5" />
        </Button>
        <Input placeholder="Enter message..." value={messageInput} onChange={handleInputChange} className="flex-1" />
        <Button type="submit" size="icon">
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  )
}
