"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { Chat, User } from "@/types"
import { formatDistanceToNow } from "date-fns"
import { Check, Users } from "lucide-react"
import { getLastMessageForChat, getUnreadCountForChat } from "@/data/mock-data"
import { getChatAvatar, getChatTitle } from "@/utils/chat-utils"
import { useApi } from "@/hooks/use-api"
interface ChatListItemProps {
  chat: Chat
  isActive: boolean
  onClick: () => void
  users: User[]
}

export function ChatListItem({ chat, isActive, onClick,users }: ChatListItemProps) {
  const {currentUserDetail}= useApi()
  const lastMessage = getLastMessageForChat(chat.id)
  const unreadCount = getUnreadCountForChat(chat.id)
  const chatTitle = currentUserDetail ? getChatTitle(chat, currentUserDetail.id, users) : "Unknown Chat"
  const chatAvatar = getChatAvatar(chat, currentUserDetail?.id || "", users)

  const formattedTime = lastMessage ? formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: false }) : ""

  // 处理群聊和单聊的不同显示逻辑
  const isGroup = chat.type === "group"

  // 获取最后一条消息的文本内容
  const getLastMessageText = () => {
    if (!lastMessage) return ""

    if (lastMessage.type === "text") {
      return lastMessage.content.text || ""
    } else if (lastMessage.type === "file") {
      return `Sent a file: ${lastMessage.content?.fileName || "file"}`
    }

    return ""
  }

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
            <AvatarImage src={chatAvatar || "/placeholder.svg"} alt={chatTitle} />
            <AvatarFallback className="bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </AvatarFallback>
          </Avatar>
        ) : (
          <Avatar>
            <AvatarImage src={chatAvatar || "/placeholder.svg"} alt={chatTitle} />
            <AvatarFallback>{chatTitle.substring(0, 2)}</AvatarFallback>
          </Avatar>
        )}
        {isGroup && (
          <span className="absolute bottom-0 right-0 flex items-center justify-center h-4 w-4 rounded-full bg-primary text-[8px] text-primary-foreground border border-background">
            {chat.members.length}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-sm truncate">{chatTitle}</h3>
          <span className="text-xs text-muted-foreground">{formattedTime}</span>
        </div>
        <div className="flex items-center gap-1">
          {lastMessage && lastMessage.readBy.some((read) => read.userId !== lastMessage.senderId) && (
            <Check className="h-3 w-3 text-green-500" />
          )}
          <p className="text-sm text-muted-foreground truncate">{getLastMessageText()}</p>
          {unreadCount > 0 && (
            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
