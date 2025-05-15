"use client"

import { useState } from "react"
import { X, Plus, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import type { User } from "@/types"

interface CreateGroupProps {
  users: User[]
  onClose: () => void
  onCreateGroup: (name: string, participants: string[]) => void
}

export function CreateGroup({ users, onClose, onCreateGroup }: CreateGroupProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [groupName, setGroupName] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [step, setStep] = useState<"select" | "name">("select")

  // 过滤用户
  const filteredUsers = users.filter(
    (user) =>
      user.id !== "user-current" &&
      (user.profile.nickname || user.username).toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  const handleNext = () => {
    if (selectedUsers.length > 0) {
      setStep("name")
    }
  }

  const handleCreateGroup = () => {
    if (groupName.trim() && selectedUsers.length > 0) {
      onCreateGroup(groupName, [...selectedUsers, "user-current"])
    }
  }

  return (
    <div className="flex flex-col h-full border-l border-border bg-background w-80">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="text-lg font-medium">{step === "select" ? "Select Members" : "Create Group"}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {step === "select" ? (
        <>
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search contacts..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar border-left-0">
            <div className="p-2">
              <h4 className="text-xs font-medium text-muted-foreground px-2 py-1">SELECTED • {selectedUsers.length}</h4>

              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2">
                  {selectedUsers.map((userId) => {
                    const user = users.find((u) => u.id === userId)
                    if (!user) return null

                    return (
                      <div key={user.id} className="flex items-center gap-1 bg-accent rounded-full pl-1 pr-2 py-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.profile.nickname || user.username}
                          />
                          <AvatarFallback>{(user.profile.nickname || user.username).substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{user.profile.nickname || user.username}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1"
                          onClick={() => toggleUserSelection(user.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              )}

              <h4 className="text-xs font-medium text-muted-foreground px-2 py-1 mt-2">CONTACTS</h4>

              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 hover:bg-accent/50 rounded-md cursor-pointer"
                  onClick={() => toggleUserSelection(user.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.profile.nickname || user.username}
                      />
                      <AvatarFallback>{(user.profile.nickname || user.username).substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.profile.nickname || user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.status.online ? "Online" : "Offline"}</p>
                    </div>
                  </div>
                  <Checkbox checked={selectedUsers.includes(user.id)} />
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-border">
            <Button className="w-full" disabled={selectedUsers.length === 0} onClick={handleNext}>
              Next
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="p-4 flex-1">
            <div className="flex flex-col gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Group Name</label>
                <Input
                  placeholder="Enter group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Group Members</label>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((userId) => {
                    const user = users.find((u) => u.id === userId)
                    if (!user) return null

                    return (
                      <div key={user.id} className="flex items-center gap-1 bg-accent rounded-full pl-1 pr-2 py-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.profile.nickname || user.username}
                          />
                          <AvatarFallback>{(user.profile.nickname || user.username).substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{user.profile.nickname || user.username}</span>
                      </div>
                    )
                  })}
                  <Button variant="outline" size="sm" className="rounded-full h-8" onClick={() => setStep("select")}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add More
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-border flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setStep("select")}>
              Back
            </Button>
            <Button
              className="flex-1"
              disabled={!groupName.trim() || selectedUsers.length === 0}
              onClick={handleCreateGroup}
            >
              Create Group
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
