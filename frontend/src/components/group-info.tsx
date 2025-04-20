"use client"

import { useState } from "react"
import { X, Search, MoreHorizontal, UserPlus, LogOut, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Chat, User } from "@/types"
import { getChatAvatar, getChatTitle, getUserOnlineStatus } from "@/data/mock-data"

interface GroupInfoProps {
  chat: Chat
  users: User[]
  onClose: () => void
}

export function GroupInfo({ chat, users, onClose }: GroupInfoProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // 确保是群聊
  if (chat.type !== "group") {
    return null
  }

  const chatTitle = getChatTitle(chat._id)
  const chatAvatar = getChatAvatar(chat._id)

  // 获取群聊成员信息
  const groupMembers = chat.members
    .map((member) => users.find((user) => user._id === member.userId))
    .filter((user): user is User => user !== undefined)

  // 获取创建者信息
  const creator = users.find((user) => user._id === chat.createdBy)

  // 过滤成员
  const filteredMembers = searchQuery
    ? groupMembers.filter((member) =>
        (member.profile.nickname || member.username).toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : groupMembers

  return (
    <div className="flex flex-col h-full border-l border-border bg-background w-80">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="text-lg font-medium">Group Info</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4 border-b border-border flex flex-col items-center gap-3">
        <Avatar className="h-20 w-20">
          <AvatarImage src={chatAvatar || "/placeholder.svg"} alt={chatTitle} />
          <AvatarFallback className="text-lg">{chatTitle.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h3 className="text-xl font-bold">{chatTitle}</h3>
          <p className="text-sm text-muted-foreground">
            {groupMembers.length} members • Created by {creator?.profile.nickname || creator?.username || "Unknown"}
          </p>
        </div>
        <div className="flex gap-2 mt-2">
          <Button variant="outline" size="sm" className="rounded-full">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            <LogOut className="h-4 w-4 mr-2" />
            Leave Group
          </Button>
        </div>
      </div>

      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search members..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar border-left-0">
        <div className="p-2">
          <h4 className="text-xs font-medium text-muted-foreground px-2 py-1">MEMBERS • {filteredMembers.length}</h4>
          {filteredMembers.map((member) => (
            <div key={member._id} className="flex items-center justify-between p-2 hover:bg-accent/50 rounded-md">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={member.avatar || "/placeholder.svg"}
                    alt={member.profile.nickname || member.username}
                  />
                  <AvatarFallback>{(member.profile.nickname || member.username).substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{member.profile.nickname || member.username}</p>
                  <p className="text-xs text-muted-foreground">
                    {getUserOnlineStatus(member._id) ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Message</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove from Group
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
