"use client"

import { useState, useEffect } from "react"
import { Search, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUserContext } from "@/contexts/user-context"
import type { User } from "@/types"

interface ContactsSidebarProps {
  isOpen: boolean
  onSelectUser: (user: User) => void
  selectedUser: User | null
}

export function ContactsSidebar({ isOpen, onSelectUser, selectedUser }: ContactsSidebarProps) {
  const { users, updateUsers } = useUserContext()
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (isOpen) {
      updateUsers() // 每次打开 Contacts 时更新用户数据
    }
  }, [isOpen, updateUsers])

  const filteredUsers = users.filter(
    (user) =>
      (user.profile.nickname || user.username).toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (!isOpen) {
    return null
  }

  return (
    <div className="border-r border-border bg-background h-full w-80 flex flex-col shadow-sm">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="text-xl font-bold">Contacts</h2>
        <Button variant="outline" size="icon" className="rounded-full">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add Contact</span>
        </Button>
      </div>
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Contacts search..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar border-left-0">
        <div className="flex flex-col">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/50 transition-colors ${
                selectedUser?._id === user._id ? "bg-accent/50" : ""
              }`}
              onClick={() => onSelectUser(user)}
            >
              <Avatar>
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.profile.nickname || user.username} />
                <AvatarFallback>{(user.profile.nickname || user.username).substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm">{user.profile.nickname || user.username}</h3>
                <p className="text-xs text-muted-foreground">{user.email || "No email provided"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
