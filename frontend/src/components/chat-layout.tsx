"use client"

import { useState, useCallback } from "react"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ChatMain } from "@/components/chat-main"
import { NavSidebar } from "@/components/nav-sidebar"
import { ContactsSidebar } from "@/components/contacts-sidebar"
import { ContactDetails } from "@/components/contact-details"
import { SettingsSidebar } from "@/components/settings-sidebar"
import { SearchSidebar } from "@/components/search-sidebar"
import { GroupInfo } from "@/components/group-info"
import { CreateGroup } from "@/components/create-group"
import { WebSocketProvider } from "@/contexts/websocket-context"
import { useMobile } from "@/hooks/use-mobile"
import type { Chat, User, Message } from "@/types"
import { mockChats, mockUsers, currentUser, getMessagesByChatId } from "@/data/mock-data"
import { UserProvider } from "@/contexts/user-context"

export function ChatLayout() {
  const isMobile = useMobile()
  const [chats, setChats] = useState<Chat[]>(mockChats)
  const [users, setUsers] = useState<User[]>([currentUser, ...mockUsers])
  const [activeChat, setActiveChat] = useState<Chat | null>(mockChats[0])
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const [activeSection, setActiveSection] = useState("chats")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showGroupInfo, setShowGroupInfo] = useState(false)
  const [showCreateGroup, setShowCreateGroup] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // 处理新消息
  const handleNewMessage = useCallback(
    (chatId: string, message: Message) => {
      setChats((prevChats) => {
        return prevChats.map((chat) => {
          if (chat._id === chatId) {
            // 更新聊天的最后消息时间
            const updatedChat = {
              ...chat,
              lastMessageAt: message.createdAt,
            }

            // 如果这是当前活跃聊天，也更新 activeChat
            if (activeChat?._id === chatId) {
              setActiveChat(updatedChat)
            }

            return updatedChat
          }
          return chat
        })
      })
    },
    [activeChat],
  )

  // 处理用户状态变化
  const handleUserStatusChange = useCallback((userId: string, isOnline: boolean) => {
    setUsers((prevUsers) => {
      return prevUsers.map((user) => {
        if (user._id === userId) {
          return {
            ...user,
            status: {
              ...user.status,
              online: isOnline,
              lastSeen: isOnline ? user.status.lastSeen : new Date(),
            },
          }
        }
        return user
      })
    })
  }, [])

  // 处理聊天更新
  const handleChatUpdate = useCallback(
    (updatedChat: Chat) => {
      setChats((prevChats) => {
        return prevChats.map((chat) => {
          if (chat._id === updatedChat._id) {
            const mergedChat = { ...chat, ...updatedChat }

            // 如果这是当前活跃聊天，也更新 activeChat
            if (activeChat?._id === chat._id) {
              setActiveChat(mergedChat)
            }

            return mergedChat
          }
          return chat
        })
      })
    },
    [activeChat],
  )

  // 发送消息的处理函数
  const handleSendMessage = (content: string, type: "text" | "file", fileId?: string) => {
    if (!activeChat) return

    // 创建新消息对象
    const newMessage: Message = {
      _id: `msg-${Date.now()}`,
      chatId: activeChat._id,
      senderId: "user-current",
      type,
      content: type === "text" ? { text: content } : { file: { fileId: fileId || "", fileName: content } },
      readBy: [
        {
          userId: "user-current",
          readAt: new Date(),
        },
      ],
      createdAt: new Date(),
    }

    // 获取当前聊天的所有消息
    const currentMessages = getMessagesByChatId(activeChat._id)

    // 将新消息添加到全局消息数组中
    // 注意：在实际应用中，您需要一个更好的方式来管理消息状态
    // 这里我们假设有一个全局的mockMessages数组可以被修改
    // 实际上您可能需要使用状态管理库如Redux或Context API
    ;(window as any).mockMessages = (window as any).mockMessages || []
    ;(window as any).mockMessages.push(newMessage)

    // 更新聊天的最后消息时间
    const updatedChat = {
      ...activeChat,
      lastMessageAt: new Date(),
    }

    setChats(chats.map((chat) => (chat._id === activeChat._id ? updatedChat : chat)))
    setActiveChat(updatedChat)
  }

  const handleCreateGroup = (name: string, participants: string[]) => {
    const newGroupId = `group-${Date.now()}`
    const newGroup: Chat = {
      _id: newGroupId,
      type: "group",
      title: name,
      avatar: "/placeholder.svg?height=40&width=40",
      members: participants.map((userId) => ({
        userId,
        role: userId === "user-current" ? "owner" : "member",
        joinedAt: new Date(),
      })),
      lastMessageAt: new Date(),
      createdBy: "user-current",
      createdAt: new Date(),
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
    <UserProvider>
      <WebSocketProvider
        userId="user-current"
        onNewMessage={handleNewMessage}
        onUserStatusChange={handleUserStatusChange}
        onChatUpdate={handleChatUpdate}
      >
        <div className="flex h-screen w-full overflow-hidden bg-gray-50 pt-6">
          <div className="flex h-[calc(100vh-3rem)] w-full max-w-6xl mx-auto rounded-lg overflow-hidden shadow-lg bg-white">
            <NavSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
            {renderContent()}
          </div>
        </div>
      </WebSocketProvider>
    </UserProvider>
  )
}
