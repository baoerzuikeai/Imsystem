"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Menu, Video, Phone, MoreHorizontal, Smile, Paperclip, Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Chat, User } from "@/types"
import { MessageBubble } from "@/components/message-bubble"

interface ChatMainProps {
  chat: Chat | null
  onSendMessage: (content: string, attachments?: any[]) => void
  toggleSidebar: () => void
  users: User[]
}

export function ChatMain({ chat, onSendMessage, toggleSidebar, users }: ChatMainProps) {
  const [messageInput, setMessageInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const participant = chat ? users.find((u) => u.id === chat.participantId) : null

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
          <Avatar>
            <AvatarImage src={participant?.avatar || "/placeholder.svg"} alt={participant?.name} />
            <AvatarFallback>{participant?.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium">{participant?.name}</h2>
            <p className="text-xs text-green-500">{participant?.status === "online" ? "Online" : "Offline"}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
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

      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-muted/20">
        <div className="flex flex-col gap-4">
          {chat.messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isCurrentUser={message.senderId === "current-user"}
              user={users.find((u) => u.id === message.senderId)}
            />
          ))}
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
