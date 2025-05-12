"use client"

import { ArrowLeft, MessageSquare, Lock, Bell,Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useApi } from "@/hooks/use-api"

interface SettingsSidebarProps {
  isOpen: boolean
}

export function SettingsSidebar({ isOpen }: SettingsSidebarProps) {
  const { currentUserDetail } = useApi()

  if (!isOpen) {
    return null
  }

  return (
    <div className="border-r border-border bg-background h-full w-80 flex flex-col shadow-sm ">
      {/* Header */}
      <div className="p-4 flex items-center gap-2 border-b border-border">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-bold">Settings</h2>
      </div>

      {/* Profile Section */}
      <div className="p-3 flex flex-row space-x-5 relative border-b border-border">
        <Avatar className="h-12 w-12 mb-3 left-1">
          <AvatarImage src={currentUserDetail?.avatar || "/placeholder.svg"} alt={currentUserDetail?.profile.nickname} />
          <AvatarFallback className="text-lg">{currentUserDetail?.profile.nickname.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div >
          <div className="flex flex-col ">
            <h3 className="text-lg font-bold">{currentUserDetail?.profile.nickname}</h3>
            <p className="text-sm text-muted-foreground">online</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-6 top-6 rounded-full bg-primary/10 border-primary/20"
        >
          <Camera className="h-5 w-5 text-primary" />
        </Button>
      </div>

      {/* Account Section */}
      <div className="px-6 py-1 border-b border-border">
        <h4 className="text-sm text-primary mb-4">Account</h4>

        <div className="space-y-2">
          <div>
            <p className="text-sm font-medium">{currentUserDetail?.username || "None"}</p>
            <p className="text-xs text-muted-foreground">Username</p>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Bio</p>
            <p className="text-sm text-muted-foreground">
              {currentUserDetail?.profile?.bio || "Add a few words about yourself"}
            </p>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="flex-1 overflow-y-auto custom-scrollbar ">
        <div className="px-6 py-4">
          <h4 className="text-sm text-primary mb-4">Settings</h4>

          <div className="space-y-4">
            <div className="flex items-center gap-3 py-1">
              <div className="bg-muted/50 p-1 rounded-full">
                <MessageSquare className="h-3 w-3 text-primary" />
              </div>
              <span className="text-sm font-medium">Chat Settings</span>
            </div>

            <Separator />

            <div className="flex items-center gap-3 py-1">
              <div className="bg-muted/50 p-1 rounded-full">
                <Lock className="h-3 w-3 text-primary" />
              </div>
              <span className="text-sm font-medium">Privacy and Security</span>
            </div>

            <Separator />

            <div className="flex items-center gap-3 py-1">
              <div className="bg-muted/50 p-1 rounded-full">
                <Bell className="h-3 w-3 text-primary" />
              </div>
              <span className="text-sm font-medium">Notifications and Sounds</span>
            </div>

            <Separator />


          </div>
        </div>
      </div>
    </div>
  )
}
