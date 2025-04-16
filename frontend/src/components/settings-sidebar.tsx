"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { mockUsers } from "@/data/mock-data"

interface SettingsSidebarProps {
  isOpen: boolean
}

export function SettingsSidebar({ isOpen }: SettingsSidebarProps) {
  const currentUser = mockUsers.find((user) => user.id === "current-user")

  if (!isOpen) {
    return null
  }

  return (
    <div className="border-r border-border bg-background h-full w-80 flex flex-col shadow-sm">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold">Settings</h2>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={currentUser?.avatar || "/placeholder.svg"} alt={currentUser?.name} />
              <AvatarFallback>{currentUser?.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{currentUser?.name}</h3>
              <p className="text-sm text-muted-foreground">Online</p>
              <Button variant="link" className="p-0 h-auto text-sm">
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <h3 className="font-medium mb-2">Preferences</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="cursor-pointer">
                Dark Mode
              </Label>
              <Switch id="dark-mode" />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="cursor-pointer">
                Notifications
              </Label>
              <Switch id="notifications" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="sound" className="cursor-pointer">
                Sound
              </Label>
              <Switch id="sound" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="read-receipts" className="cursor-pointer">
                Read Receipts
              </Label>
              <Switch id="read-receipts" defaultChecked />
            </div>
          </div>

          <h3 className="font-medium mt-6 mb-2">Privacy</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="online-status" className="cursor-pointer">
                Show Online Status
              </Label>
              <Switch id="online-status" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="last-seen" className="cursor-pointer">
                Show Last Seen
              </Label>
              <Switch id="last-seen" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
