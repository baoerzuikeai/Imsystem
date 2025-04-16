"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Chat, User } from "@/types"

interface SearchSidebarProps {
  isOpen: boolean
  chats: Chat[]
  users: User[]
}

export function SearchSidebar({ isOpen, chats, users }: SearchSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredChats = chats.filter((chat) => {
    const user = users.find((u) => u.id === chat.participantId)
    return (
      user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.messages.some((message) => message.content.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })

  if (!isOpen) {
    return null
  }

  return (
    <div className="border-r border-border bg-background h-full w-80 flex flex-col shadow-sm">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold mb-4">Search</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search messages, contacts..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="flex-1 flex flex-col">
        <div className="px-4 pt-2 border-b border-border">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              All
            </TabsTrigger>
            <TabsTrigger value="chats" className="flex-1">
              Chats
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex-1">
              Contacts
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="flex-1 overflow-y-auto custom-scrollbar">
          {searchQuery ? (
            <div className="flex flex-col">
              {filteredUsers.length > 0 && (
                <div className="p-2">
                  <h3 className="text-xs font-medium text-muted-foreground px-2 py-1">CONTACTS</h3>
                  {filteredUsers.slice(0, 3).map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent/50 transition-colors"
                    >
                      <Avatar>
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-sm">{user.name}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredChats.length > 0 && (
                <div className="p-2">
                  <h3 className="text-xs font-medium text-muted-foreground px-2 py-1">CHATS</h3>
                  {filteredChats.slice(0, 5).map((chat) => {
                    const user = users.find((u) => u.id === chat.participantId)
                    return (
                      <div
                        key={chat.id}
                        className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent/50 transition-colors"
                      >
                        <Avatar>
                          <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                          <AvatarFallback>{user?.name?.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-sm">{user?.name}</h4>
                          <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {filteredUsers.length === 0 && filteredChats.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No results found</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Enter a search term</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="chats" className="flex-1 overflow-y-auto custom-scrollbar">
          {searchQuery ? (
            filteredChats.length > 0 ? (
              <div className="flex flex-col p-2">
                {filteredChats.map((chat) => {
                  const user = users.find((u) => u.id === chat.participantId)
                  return (
                    <div
                      key={chat.id}
                      className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent/50 transition-colors"
                    >
                      <Avatar>
                        <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                        <AvatarFallback>{user?.name?.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-sm">{user?.name}</h4>
                        <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No chats found</p>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Enter a search term</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="contacts" className="flex-1 overflow-y-auto custom-scrollbar">
          {searchQuery ? (
            filteredUsers.length > 0 ? (
              <div className="flex flex-col p-2">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent/50 transition-colors"
                  >
                    <Avatar>
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-sm">{user.name}</h4>
                      <p className="text-xs text-muted-foreground">{user.status === "online" ? "Online" : "Offline"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No contacts found</p>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Enter a search term</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
