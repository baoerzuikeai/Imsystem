"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { Message, User } from "@/types"
import { format } from "date-fns"
import { Check, MoreHorizontal, FileText, Play, Pause, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MarkdownRenderer } from "@/components/markdown-renderer"

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

  const renderAttachment = (attachment: any) => {
    switch (attachment.type) {
      case "image":
        return (
          <div className="rounded-md overflow-hidden mb-2 max-w-xs relative">
            <img src={attachment.url || "/placeholder.svg"} alt="Attachment" className="w-full h-auto object-cover" />
            {attachment.duration && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1 rounded">
                {attachment.duration}
              </div>
            )}
          </div>
        )
      case "file":
        return (
          <div className="flex items-center gap-2 p-3 bg-accent rounded-md mb-2">
            <FileText className="h-8 w-8 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{attachment.name}</p>
              <p className="text-xs text-muted-foreground">{attachment.size}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Download
              </Button>
              <Button variant="outline" size="sm">
                Preview
              </Button>
            </div>
          </div>
        )
      case "audio":
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
                <span>{attachment.duration || "0:00"}</span>
              </div>
            </div>
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className={cn("flex gap-3 max-w-[80%]", isCurrentUser ? "self-end flex-row-reverse" : "self-start")}>
      {!isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
          <AvatarFallback>{user?.name?.substring(0, 2)}</AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col gap-1">
        {message.attachments?.map((attachment, index) => (
          <div key={index} className="relative">
            {renderAttachment(attachment)}
          </div>
        ))}
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
            <MarkdownRenderer content={message.content} />
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
        <div
          className={cn(
            "flex items-center gap-1 text-xs text-muted-foreground",
            isCurrentUser ? "justify-start" : "justify-end",
          )}
        >
          <span>{format(new Date(message.timestamp), "h:mm a")}</span>
          {isCurrentUser && message.status === "read" && <Check className="h-3 w-3 text-green-500" />}
        </div>
      </div>
    </div>
  )
}
