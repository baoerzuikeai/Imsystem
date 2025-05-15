"use client"

import { useState } from "react"
import { Search, Plus, Menu, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Chat, User } from "@/types"
import { ChatListItem } from "@/components/chat-list-item"
import { getChatAvatar, getChatTitle } from "@/utils/chat-utils"
import { useApi } from "@/hooks/use-api"

interface ChatSidebarProps {
  chats: Chat[]
  activeChat: Chat | null
  setActiveChat: (chat: Chat) => void
  isOpen: boolean
  toggleSidebar: () => void
  users: User[]
  onCreateGroup?: () => void
}

export function ChatSidebar({
  chats,
  activeChat,
  setActiveChat,
  isOpen,
  toggleSidebar,
  users,
  onCreateGroup,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const currentUserDetail = useApi().currentUserDetail
  // 根据搜索和标签过滤聊天
  const getFilteredChats = () => {
    return chats.filter((chat) => {
      // 首先按搜索词过滤
      const chatTitle =currentUserDetail?getChatTitle(chat,currentUserDetail.id,users):"Unknown Chat"
      const matchesSearch = chatTitle.toLowerCase().includes(searchQuery.toLowerCase())

      if (!matchesSearch) return false

      // 然后按标签过滤
      if (activeTab === "all") return true
      if (activeTab === "direct") return chat.type === "private"
      if (activeTab === "groups") return chat.type === "group"

      return true
    })
  }

  const filteredChats = getFilteredChats()

  if (!isOpen) {
    return (
      <div className="border-r border-border bg-background h-full w-16 flex flex-col items-center py-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mb-4">
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex flex-col items-center gap-4 mt-4">
          {chats.slice(0, 5).map((chat) => {
            const isGroup = chat.type === "group"
            const chatTitle = getChatTitle(chat,chat.id,users)
            const chatAvatar = getChatAvatar(chat,chat.id,users)

            return (
              <Avatar
                key={chat.id}
                className={cn(
                  "cursor-pointer border-2",
                  activeChat?.id === chat.id ? "border-primary" : "border-transparent",
                )}
                onClick={() => setActiveChat(chat)}
              >
                {isGroup ? (
                  <>
                    <AvatarImage src={chatAvatar || "/placeholder.svg"} alt={chatTitle} />
                    <AvatarFallback className="bg-primary/10">
                      <Users className="h-4 w-4 text-primary" />
                    </AvatarFallback>
                  </>
                ) : (
                  <>
                    <AvatarImage src={chatAvatar || "/placeholder.svg"} alt={chatTitle} />
                    <AvatarFallback>{chatTitle.substring(0, 2)}</AvatarFallback>
                  </>
                )}
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
        <div className="flex gap-1">
          <Button variant="outline" size="icon" className="rounded-full" onClick={onCreateGroup}>
            <Users className="h-4 w-4" />
            <span className="sr-only">New Group</span>
          </Button>
        </div>
      </div>

      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search chats..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="px-4 pt-2 border-b border-border">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="direct">Direct</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar border-left-0">
        <div className="flex flex-col">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                isActive={activeChat?.id === chat.id}
                onClick={() => setActiveChat(chat)}
                users={users}
              />
            ))
          ) : (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">No chats found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
