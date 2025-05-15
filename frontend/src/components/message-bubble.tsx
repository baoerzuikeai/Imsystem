"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { Message, User, File } from "@/types"
import { format } from "date-fns"
import { Check, MoreHorizontal, FileText, Play, Pause, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { mockFiles } from "@/data/mock-data"

interface MessageBubbleProps {
  message: Message
  isCurrentUser: boolean
  user?: User
}

export function MessageBubble({ message, isCurrentUser, user }: MessageBubbleProps) {
  const [showOptions, setShowOptions] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const toggleOptions = () => {
    setShowOptions(!showOptions)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  // 获取消息关联的文件
  const getMessageFile = (): File | undefined => {
    if (message.type !== "file" || !message.content.file) return undefined
    return mockFiles.find((file) => file._id === message.content.file?.fileId)
  }

  const renderAttachment = () => {
    if (message.type !== "file") return null

    const file = getMessageFile()
    if (!file) return null

    // 根据文件类型渲染不同的附件
    if (file.type.startsWith("image/")) {
      return (
        <div className="rounded-md overflow-hidden mb-2 max-w-xs relative">
          <img src={file.url || "/placeholder.svg"} alt={file.name} className="w-full h-auto object-cover" />
        </div>
      )
    } else if (file.type.startsWith("audio/")) {
      return (
        <div className="flex items-center gap-2 p-3 bg-accent rounded-md mb-2 w-full max-w-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-primary text-primary-foreground"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <div className="flex-1">
            <div className="h-1 bg-muted-foreground/30 rounded-full">
              <div className="h-full w-1/3 bg-primary rounded-full"></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0:00</span>
              <span>0:30</span>
            </div>
          </div>
          <Volume2 className="h-4 w-4 text-muted-foreground" />
        </div>
      )
    } else {
      // 默认文件类型
      return (
        <div className="flex items-center gap-2 p-3 bg-accent rounded-md mb-2">
          <FileText className="h-8 w-8 text-primary" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Download
            </Button>
          </div>
        </div>
      )
    }
  }

  return (
    <div className={cn("flex gap-3 max-w-[80%]", isCurrentUser ? "self-end flex-row-reverse" : "self-start")}>
      {!isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.profile.nickname || user?.username} />
          <AvatarFallback>{user?.profile.nickname?.substring(0, 2) || user?.username.substring(0, 2)}</AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col gap-1">
        {message.type === "file" && renderAttachment()}
        {message.type === "text" && message.content.text && (
          <div
            className={cn(
              "relative group rounded-lg p-3",
              isCurrentUser
                ? "bg-white text-foreground border border-border"
                : "bg-white text-foreground border border-border",
            )}
            onMouseEnter={() => setShowOptions(true)}
            onMouseLeave={() => setShowOptions(false)}
          >
            <div className="markdown-content">
              <MarkdownRenderer content={message.content.text} />
            </div>
            <div
              className={cn(
                "absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity",
                isCurrentUser ? "left-2" : "right-2",
              )}
            >
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full bg-background/80">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
        <div
          className={cn(
            "flex items-center gap-1 text-xs text-muted-foreground",
            isCurrentUser ? "justify-start" : "justify-end",
          )}
        >
          <span>{format(new Date(message.createdAt), "h:mm a")}</span>
          {isCurrentUser && Array.isArray(message.readBy) && message.readBy.some((read) => read.userId !== message.senderId) && (
            <Check className="h-3 w-3 text-green-500" />
          )}
        </div>
      </div>
    </div>
  )
}
