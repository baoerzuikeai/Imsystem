"use client"

import { useState } from "react"
import { Search, Plus, Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Chat, User } from "@/types"
import { ChatListItem } from "@/components/chat-list-item"

interface ChatSidebarProps {
  chats: Chat[]
  activeChat: Chat | null
  setActiveChat: (chat: Chat) => void
  isOpen: boolean
  toggleSidebar: () => void
  users: User[]
}

export function ChatSidebar({ chats, activeChat, setActiveChat, isOpen, toggleSidebar, users }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredChats = chats.filter((chat) => {
    const user = users.find((u) => u.id === chat.participantId)
    return (
      user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  if (!isOpen) {
    return (
      <div className="border-r border-border bg-background h-full w-16 flex flex-col items-center py-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mb-4">
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex flex-col items-center gap-4 mt-4">
          {chats.slice(0, 5).map((chat) => {
            const user = users.find((u) => u.id === chat.participantId)
            return (
              <Avatar
                key={chat.id}
                className={cn(
                  "cursor-pointer border-2",
                  activeChat?.id === chat.id ? "border-primary" : "border-transparent",
                )}
                onClick={() => setActiveChat(chat)}
              >
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                <AvatarFallback>{user?.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="border-r border-border bg-background h-full w-80 flex flex-col shadow-sm">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="text-xl font-bold">Chats</h2>
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Chats search..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col">
          {filteredChats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isActive={activeChat?.id === chat.id}
              onClick={() => setActiveChat(chat)}
              user={users.find((u) => u.id === chat.participantId)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
