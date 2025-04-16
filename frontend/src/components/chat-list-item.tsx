"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { Chat, User } from "@/types"
import { formatDistanceToNow } from "date-fns"
import { Check, Users } from "lucide-react"

interface ChatListItemProps {
  chat: Chat
  isActive: boolean
  onClick: () => void
  users: User[]
}

export function ChatListItem({ chat, isActive, onClick, users }: ChatListItemProps) {
  const formattedTime = chat.lastMessageTime
    ? formatDistanceToNow(new Date(chat.lastMessageTime), { addSuffix: false })
    : ""

  // 处理群聊和单聊的不同显示逻辑
  const isGroup = chat.type === "group"
  const participant = isGroup ? null : users.find((user) => user.id === chat.participantId)

  // 获取群聊成员信息
  const groupMembers = isGroup
    ? (chat.participants?.map((id) => users.find((user) => user.id === id)).filter(Boolean) as User[])
    : []

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/50 transition-colors",
        isActive && "bg-accent",
      )}
      onClick={onClick}
    >
      <div className="relative">
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
            <AvatarFallback>{participant?.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
        )}
        {!isGroup && participant?.status === "online" && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
        )}
        {isGroup && (
          <span className="absolute bottom-0 right-0 flex items-center justify-center h-4 w-4 rounded-full bg-primary text-[8px] text-primary-foreground border border-background">
            {groupMembers.length}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-sm truncate">{isGroup ? chat.groupName : participant?.name}</h3>
          <span className="text-xs text-muted-foreground">{formattedTime}</span>
        </div>
        <div className="flex items-center gap-1">
          {chat.lastMessageStatus === "read" && <Check className="h-3 w-3 text-green-500" />}
          <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
          {chat.unreadCount > 0 && (
            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
