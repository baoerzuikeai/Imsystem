"use client"

import { Facebook, Twitter, Linkedin, Instagram, Globe } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { User } from "@/types"
import { format } from "date-fns"

interface ContactDetailsProps {
  user: User | null
}

export function ContactDetails({ user }: ContactDetailsProps) {
  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <h3 className="text-lg font-medium">No contact selected</h3>
          <p className="text-muted-foreground">Select a contact to view details</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-muted/20 border-l border-border">
      <div className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.profile.nickname || user.username} />
            <AvatarFallback>{(user.profile.nickname || user.username).substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">{user.profile.nickname || user.username}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button className="rounded-full">New Chat</Button>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar border-left-0">
        <div>
          <h3 className="text-xs font-medium text-muted-foreground mb-2">ABOUT</h3>
          <p className="text-sm">{user.profile.bio || "No bio provided"}</p>
        </div>

        <div>
          <h3 className="text-xs font-medium text-muted-foreground mb-2">EMAIL</h3>
          <p className="text-sm">{user.email}</p>
        </div>

        <div>
          <h3 className="text-xs font-medium text-muted-foreground mb-2">USERNAME</h3>
          <p className="text-sm">@{user.username}</p>
        </div>

        <div>
          <h3 className="text-xs font-medium text-muted-foreground mb-2">JOINED</h3>
          <p className="text-sm">{format(new Date(user.createdAt), "MMMM d, yyyy")}</p>
        </div>

        <div>
          <h3 className="text-xs font-medium text-muted-foreground mb-2">LAST SEEN</h3>
          <p className="text-sm">
            {user.status.online ? "Online" : `${format(new Date(user.status.lastSeen), "MMMM d, yyyy 'at' h:mm a")}`}
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
            <Facebook className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
            <Twitter className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
            <Linkedin className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
            <Instagram className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
            <Globe className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
