"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Menu, Video, Phone, MoreHorizontal, Smile, Paperclip, Send, Users, Info } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Chat, User } from "@/types"
import { MessageBubble } from "@/components/message-bubble"

interface ChatMainProps {
  chat: Chat | null
  onSendMessage: (content: string, attachments?: any[]) => void
  toggleSidebar: () => void
  users: User[]
  onGroupInfoClick?: () => void
}

export function ChatMain({ chat, onSendMessage, toggleSidebar, users, onGroupInfoClick }: ChatMainProps) {
  const [messageInput, setMessageInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 处理群聊和单聊的不同逻辑
  const isGroup = chat?.type === "group"
  const participant = !isGroup && chat ? users.find((u) => u.id === chat.participantId) : null

  // 获取群聊成员信息
  const groupMembers =
    isGroup && chat?.participants
      ? (chat.participants.map((id) => users.find((user) => user.id === id)).filter(Boolean) as User[])
      : []

  // 获取在线成员数量
  const onlineMembers = groupMembers.filter((member) => member.status === "online").length

  useEffect(() => {
    scrollToBottom()
  }, [chat?.messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (messageInput.trim()) {
      onSendMessage(messageInput)
      setMessageInput("")
    }
  }

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

          {isGroup ? (
            <Avatar>
              <AvatarImage src={chat.groupAvatar || "/placeholder.svg"} alt={chat.groupName} />
              <AvatarFallback className="bg-primary/10">
                <Users className="h-4 w-4 text-primary" />
              </AvatarFallback>
            </Avatar>
          ) : (
            <Avatar>
              <AvatarImage src={participant?.avatar || "/placeholder.svg"} alt={participant?.name} />
              <AvatarFallback>{participant?.name?.substring(0, 2)}</AvatarFallback>
            </Avatar>
          )}

          <div>
            <h2 className="font-medium">{isGroup ? chat.groupName : participant?.name}</h2>
            {isGroup ? (
              <p className="text-xs text-muted-foreground">
                {onlineMembers} online • {groupMembers.length} members
              </p>
            ) : (
              <p className="text-xs text-green-500">{participant?.status === "online" ? "Online" : "Offline"}</p>
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
          {chat.messages.length > 0 ? (
            chat.messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isCurrentUser={message.senderId === "current-user"}
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

      <form onSubmit={handleSendMessage} className="border-t border-border p-4 flex items-center gap-2 bg-background">
        <Button type="button" variant="ghost" size="icon">
          <Smile className="h-5 w-5" />
        </Button>
        <Button type="button" variant="ghost" size="icon">
          <Paperclip className="h-5 w-5" />
        </Button>
        <Input
          placeholder="Enter message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  )
}
