"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { Chat, User } from "@/types"
import { formatDistanceToNow } from "date-fns"
import { Check } from "lucide-react"

interface ChatListItemProps {
  chat: Chat
  isActive: boolean
  onClick: () => void
  user?: User
}

export function ChatListItem({ chat, isActive, onClick, user }: ChatListItemProps) {
  const formattedTime = chat.lastMessageTime
    ? formatDistanceToNow(new Date(chat.lastMessageTime), { addSuffix: false })
    : ""

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/50 transition-colors",
        isActive && "bg-accent",
      )}
      onClick={onClick}
    >
      <div className="relative">
        <Avatar>
          <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
          <AvatarFallback>{user?.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        {user?.status === "online" && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-sm truncate">{user?.name}</h3>
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
