"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Chat, User } from "@/types"
import { getChatTitle, getLastMessageForChat, getMessagesByChatId } from "@/data/mock-data"
import { getChatAvatar } from "@/data/mock-data"

interface SearchSidebarProps {
  isOpen: boolean
  chats: Chat[]
  users: User[]
}

export function SearchSidebar({ isOpen, chats, users }: SearchSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user._id !== "user-current" &&
      (user.profile.nickname || user.username).toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredChats = chats.filter((chat) => {
    const chatTitle = getChatTitle(chat._id)
    const messages = getMessagesByChatId(chat._id)

    return (
      chatTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      messages.some(
        (message) => message.type === "text" && message.content.text?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
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
                      key={user._id}
                      className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent/50 transition-colors"
                    >
                      <Avatar>
                        <AvatarImage
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.profile.nickname || user.username}
                        />
                        <AvatarFallback>{(user.profile.nickname || user.username).substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-sm">{user.profile.nickname || user.username}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredChats.length > 0 && (
                <div className="p-2">
                  <h3 className="text-xs font-medium text-muted-foreground px-2 py-1">CHATS</h3>
                  {filteredChats.slice(0, 5).map((chat) => {
                    const chatTitle = getChatTitle(chat._id)
                    const lastMessage = getLastMessageForChat(chat._id)
                    const lastMessageText =
                      lastMessage?.type === "text"
                        ? lastMessage.content.text
                        : lastMessage?.type === "file"
                          ? `Sent a file: ${lastMessage.content.file?.fileName}`
                          : ""

                    return (
                      <div
                        key={chat._id}
                        className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent/50 transition-colors"
                      >
                        <Avatar>
                          <AvatarImage
                            src={chat.type === "group" ? chat.avatar || "/placeholder.svg" : getChatAvatar(chat._id)}
                            alt={chatTitle}
                          />
                          <AvatarFallback>{chatTitle.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-sm">{chatTitle}</h4>
                          <p className="text-xs text-muted-foreground truncate">{lastMessageText}</p>
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
                  const chatTitle = getChatTitle(chat._id)
                  const lastMessage = getLastMessageForChat(chat._id)
                  const lastMessageText =
                    lastMessage?.type === "text"
                      ? lastMessage.content.text
                      : lastMessage?.type === "file"
                        ? `Sent a file: ${lastMessage.content.file?.fileName}`
                        : ""

                  return (
                    <div
                      key={chat._id}
                      className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent/50 transition-colors"
                    >
                      <Avatar>
                        <AvatarImage
                          src={chat.type === "group" ? chat.avatar || "/placeholder.svg" : getChatAvatar(chat._id)}
                          alt={chatTitle}
                        />
                        <AvatarFallback>{chatTitle.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-sm">{chatTitle}</h4>
                        <p className="text-xs text-muted-foreground truncate">{lastMessageText}</p>
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
                    key={user._id}
                    className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent/50 transition-colors"
                  >
                    <Avatar>
                      <AvatarImage
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.profile.nickname || user.username}
                      />
                      <AvatarFallback>{(user.profile.nickname || user.username).substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-sm">{user.profile.nickname || user.username}</h4>
                      <p className="text-xs text-muted-foreground">{user.status.online ? "Online" : "Offline"}</p>
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
