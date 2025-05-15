"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Menu, Video, Phone, MoreHorizontal, Smile, Paperclip, Send, Users, Info } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useWebSocketContext } from "@/contexts/websocket-context"
import type { Chat, User,Message } from "@/types"
import { MessageBubble } from "@/components/message-bubble"
import {getChatAvatar, getChatTitle,getUserOnlineStatus }from "@/utils/chat-utils"
import { useApi } from "@/hooks/use-api"


interface ChatMainProps {
  chat: Chat | null
  toggleSidebar: () => void
  users: User[]
  messages: Message[]
  onGroupInfoClick?: () => void
}

export function ChatMain({ chat,  toggleSidebar, users, messages,onGroupInfoClick }: ChatMainProps) {
  const [messageInput, setMessageInput] = useState("")
  // const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  // const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)


  // 使用 WebSocket 上下文
  const { currentUserDetail, addMessageToGlobalCache } = useApi();
  const { sendMessage: sendWsMessageViaContext} = useWebSocketContext();

  const isGroup = chat?.type === "group"
  const chatTitle = currentUserDetail && chat ? getChatTitle(chat, currentUserDetail.id, users) : "Unknown Chat"
  const chatAvatar = chat ? getChatAvatar(chat, currentUserDetail?.id || "", users) : "/placeholder.svg"
  // 获取群聊成员信息
  const groupMembers =
    isGroup && chat
      ? chat.members
          .map((member) => users.find((user) => user.id === member.userId))
          .filter((user): user is User => user !== undefined)
      : []

  // 获取在线成员数量
  const onlineMembers = groupMembers.filter((member) => getUserOnlineStatus(member.id,users)).length

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages, chat?.id]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessageInput(value);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chat || !messageInput.trim() || !currentUserDetail) return;

    // Optimistic message creation can still be useful if you want instant UI update
    // before server confirmation, but actual addition to global cache will be
    // handled by onNewMessage in ChatLayout when the message is echoed by the server.
    /*
    const tempMessageId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const optimisticMessage: Message = {
      id: tempMessageId,
      chatId: chat.id,
      senderId: currentUserDetail.id,
      type: "text",
      content: { text: messageInput },
      readBy: [{ userId: currentUserDetail.id, readAt: new Date() }],
      createdAt: new Date(),
    };
    // addMessageToGlobalCache(chat.id, optimisticMessage); // This would be handled by onNewMessage
    */

    // 根据 websocket/message.go 的 WSMessage 结构
    // 和 client.go 中对 Content 的处理：
    // - type: 'chat', content: string (the text message)
    // - type: 'code', content: string (the code), language: string
    // - type: 'file', content: string (the fileId), fileName: string
    const wsPayload = { // This now directly matches SendMessagePayload
      chatId: chat.id,
      type: 'chat' as 'chat' | 'code' | 'file', // Explicitly type for 'chat' for now
      content: messageInput, // For 'chat' type, content is the string itself
      // language: undefined, // For 'code'
      // fileName: undefined, // For 'file'
    };

    const success = sendWsMessageViaContext(wsPayload);
    if (!success) {
      console.error("ChatMain: Failed to send message via WebSocket.");
      // Optionally, implement retry or error feedback to the user
      // You might want to update an optimistic message to 'failed' status
    }

    setMessageInput("");
    // Removed typing timeout clearing logic
  };
  // 清理超时
  
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
                {getUserOnlineStatus(chat.members.find((m) => m.userId != currentUserDetail?.id)?.userId ?? "", users)
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
          {messages?.length > 0 ? (
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isCurrentUser={currentUserDetail ? message.senderId === currentUserDetail.id : false}
                user={users.find((u) => u.id === message.senderId)}
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

      {/* {typingUserNames.length > 0 && (
        <div className="px-4 py-1 text-xs text-muted-foreground">
          {typingUserNames.length === 1
            ? `${typingUserNames[0]} is typing...`
            : `${typingUserNames.join(", ")} are typing...`}
        </div>
      )} */}

      <form onSubmit={handleFormSubmit} className="border-t border-border p-4 flex items-center gap-2 bg-background">
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
