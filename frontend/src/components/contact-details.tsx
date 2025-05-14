"use client"

import { Facebook, Twitter, Linkedin, Instagram, Globe, Mail, User, Calendar, Clock, Info } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { User as UserType } from "@/types"
import { format } from "date-fns"

interface ContactDetailsProps {
  user: UserType | null
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
    <div className="flex-1 flex flex-col h-full bg-muted/20 border-l border-border overflow-y-auto custom-scrollbar">
      <div className="p-6 sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.profile.nickname || user.username} />
              <AvatarFallback>{(user.profile.nickname || user.username).substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{user.profile.nickname || user.username}</h2>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Badge variant={user.status.online ? "default" : "secondary"}>
                  {user.status.online ? "Online" : "Offline"}
                </Badge>
              </div>
            </div>
          </div>
          <Button className="rounded-full">New Chat</Button>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-max">
        {/* About Card */}
        <Card className="col-span-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-md">
              <Info className="h-4 w-4" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{user.profile.bio || "No bio provided"}</p>
          </CardContent>
        </Card>

        {/* Personal Information Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-md">
              <User className="h-4 w-4" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">EMAIL</p>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{user.email}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">USERNAME</p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">@{user.username}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-md">
              <Clock className="h-4 w-4" />
              Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">JOINED</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{format(new Date(user.createdAt), "MMMM d, yyyy")}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">LAST SEEN</p>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">
                  {user.status.online
                    ? "Online now"
                    : `${format(new Date(user.status.lastSeen), "MMMM d, yyyy 'at' h:mm a")}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links Card */}
        <Card className="col-span-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-md">
              <Globe className="h-4 w-4" />
              Social Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
