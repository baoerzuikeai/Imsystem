"use client"

import { useState } from "react"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ChatMain } from "@/components/chat-main"
import { NavSidebar } from "@/components/nav-sidebar"
import { ContactsSidebar } from "@/components/contacts-sidebar"
import { ContactDetails } from "@/components/contact-details"
import { SettingsSidebar } from "@/components/settings-sidebar"
import { SearchSidebar } from "@/components/search-sidebar"
import { GroupInfo } from "@/components/group-info"
import { CreateGroup } from "@/components/create-group"
import { useMobile } from "@/hooks/use-mobile"
import type { Chat, Message, User } from "@/types"
import { mockChats, mockUsers } from "@/data/mock-data"

export function ChatLayout() {
  const isMobile = useMobile()
  const [chats, setChats] = useState<Chat[]>(mockChats)
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [activeChat, setActiveChat] = useState<Chat | null>(mockChats[0])
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const [activeSection, setActiveSection] = useState("chats")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showGroupInfo, setShowGroupInfo] = useState(false)
  const [showCreateGroup, setShowCreateGroup] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSendMessage = (content: string, attachments: any[] = []) => {
    if (!activeChat) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      senderId: "current-user", // Current user ID
      timestamp: new Date(),
      status: "sent",
      attachments,
    }

    const updatedChat = {
      ...activeChat,
      messages: [...activeChat.messages, newMessage],
      lastMessage: content,
      lastMessageTime: new Date(),
    }

    setChats(chats.map((chat) => (chat.id === activeChat.id ? updatedChat : chat)))
    setActiveChat(updatedChat)
  }

  const handleCreateGroup = (name: string, participants: string[]) => {
    const newGroupId = `group-${Date.now()}`
    const newGroup: Chat = {
      id: newGroupId,
      type: "group",
      groupName: name,
      participants: participants,
      messages: [],
      unreadCount: 0,
      createdBy: "current-user",
      lastMessageTime: new Date(),
    }

    setChats([newGroup, ...chats])
    setActiveChat(newGroup)
    setShowCreateGroup(false)
  }

  const toggleGroupInfo = () => {
    if (activeChat?.type === "group") {
      setShowGroupInfo(!showGroupInfo)
    }
  }

  const toggleCreateGroup = () => {
    setShowCreateGroup(!showCreateGroup)
  }

  const renderContent = () => {
    switch (activeSection) {
      case "chats":
        return (
          <>
            <ChatSidebar
              chats={chats}
              activeChat={activeChat}
              setActiveChat={setActiveChat}
              isOpen={sidebarOpen}
              toggleSidebar={toggleSidebar}
              users={users}
              onCreateGroup={toggleCreateGroup}
            />
            <ChatMain
              chat={activeChat}
              onSendMessage={handleSendMessage}
              toggleSidebar={toggleSidebar}
              users={users}
              onGroupInfoClick={toggleGroupInfo}
            />
            {showGroupInfo && activeChat?.type === "group" && (
              <GroupInfo chat={activeChat} users={users} onClose={() => setShowGroupInfo(false)} />
            )}
            {showCreateGroup && (
              <CreateGroup users={users} onClose={() => setShowCreateGroup(false)} onCreateGroup={handleCreateGroup} />
            )}
          </>
        )
      case "contacts":
        return (
          <>
            <ContactsSidebar
              users={users}
              isOpen={sidebarOpen}
              onSelectUser={setSelectedUser}
              selectedUser={selectedUser}
            />
            <ContactDetails user={selectedUser} />
          </>
        )
      case "settings":
        return <SettingsSidebar isOpen={sidebarOpen} />
      case "search":
        return <SearchSidebar isOpen={sidebarOpen} chats={chats} users={users} />
      default:
        return (
          <>
            <ChatSidebar
              chats={chats}
              activeChat={activeChat}
              setActiveChat={setActiveChat}
              isOpen={sidebarOpen}
              toggleSidebar={toggleSidebar}
              users={users}
              onCreateGroup={toggleCreateGroup}
            />
            <ChatMain
              chat={activeChat}
              onSendMessage={handleSendMessage}
              toggleSidebar={toggleSidebar}
              users={users}
              onGroupInfoClick={toggleGroupInfo}
            />
          </>
        )
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 pt-6">
      <div className="flex h-[calc(100vh-3rem)] w-full max-w-6xl mx-auto rounded-lg overflow-hidden shadow-lg bg-white">
        <NavSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        {renderContent()}
      </div>
    </div>
  )
}
