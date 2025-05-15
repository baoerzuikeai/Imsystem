"use client"

import { useState, useCallback, useEffect } from "react"
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
import { UserProvider } from "@/contexts/user-context"
import { AIAssistant } from "@/components/ai-assistant"
import { useApi } from "@/hooks/use-api"

export function ChatLayout() {
  const { chats, isLoadingChats, fetchChats, messages, fetchMessages,contacts,fetchMembers,addMessageToGlobalCache,currentUserDetail,setChats: globalSetChats, globalmessages} = useApi();
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const isMobile = useMobile()
  const [users, setUsers] = useState<User[]|null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const [activeSection, setActiveSection] = useState("chats")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showGroupInfo, setShowGroupInfo] = useState(false)
  const [showCreateGroup, setShowCreateGroup] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  useEffect(() => {
    if (currentUserDetail) { // 确保 currentUserDetail 加载后再 fetchChats
        fetchChats();
    }
  }, [fetchChats, currentUserDetail,contacts]);
  
  useEffect(() => {
    if (activeChat?.id) {
      const existingMessages = globalmessages.get(activeChat.id);
      // 判断 globalmessages 中是否已有消息
      if (!existingMessages || existingMessages.length === 0) {
        console.log(`Fetching messages for chat ${activeChat.id}`);
        fetchMessages(activeChat.id);
      } else {
        console.log(`Messages for chat ${activeChat.id} already exist in globalmessages.`);
      }
      fetchMembers(activeChat.id).then((members) => setUsers(members))
    }else {
      setUsers(null);
    }  
  }, [activeChat, fetchMessages,fetchMembers]);
  
  console.log("messages", messages)
  console.log("globalmessage<acitvech>",globalmessages)
  // 处理新消息
   // 处理从 WebSocketProvider 传来的新消息
   const handleNewWebSocketMessage = useCallback(
    (newMessage: Message) => {
      console.log("ChatLayout: Received new message via WebSocket:", newMessage);
      addMessageToGlobalCache(newMessage.chatId, newMessage);

      // Update chat metadata (lastMessageAt) and re-sort
      globalSetChats((prevChats: Chat[]) => {
        const newChats = prevChats.map((chat) => {
          if (chat.id === newMessage.chatId) {
            const updatedChat = {
              ...chat,
              lastMessageAt: newMessage.createdAt,
              // Potentially update lastMessageSnippet or unreadCount here if needed
              // unreadCount: activeChat?.id === newMessage.chatId ? 0 : (chat.unreadCount || 0) + 1,
            };
            if (activeChat?.id === newMessage.chatId) {
              // If it's the active chat, update its state too
              setActiveChat(prevActive => prevActive ? {...prevActive, ...updatedChat} : updatedChat);
            }
            return updatedChat;
          }
          return chat;
        });
        // Sort chats by the new lastMessageAt time
        return newChats.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
      });
    },
    [activeChat?.id, addMessageToGlobalCache, globalSetChats]
  );

  // 处理用户状态变化
  const handleUserStatusChange = useCallback((userId: string, isOnline: boolean) => {
    console.log(`ChatLayout: User ${userId} status to ${isOnline ? 'online' : 'offline'}`);
    setUsers((prevMembers) =>
      prevMembers?.map((member) =>
        member.id === userId ? { ...member, status: { ...member.status, online: isOnline, lastSeen: new Date() } } : member
      ) || null
    );
    // Potentially update contacts list in useApi if user status is global
  }, []);



  const handleChatUpdate = useCallback((updatedChat: Chat) => {
    console.log("ChatLayout: Received chat update via WebSocket:", updatedChat);
    globalSetChats((prevChats: Chat[]) => {
      const chatExists = prevChats.some(chat => chat.id === updatedChat.id);
      let newChats;
      if (chatExists) {
        newChats = prevChats.map(chat => (chat.id === updatedChat.id ? { ...chat, ...updatedChat } : chat));
      } else {
        newChats = [updatedChat, ...prevChats];
      }
      if (activeChat?.id === updatedChat.id) {
        setActiveChat(prevActive => prevActive ? { ...prevActive, ...updatedChat } : updatedChat);
      }
      return newChats.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
    });
  }, [activeChat?.id, globalSetChats]);

 


  const handleCreateGroup = (name: string, participants: string[]) => {
    const newGroupId = `group-${Date.now()}`
    const newGroup: Chat = {
      id: newGroupId,
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
              users={contacts}
              onCreateGroup={toggleCreateGroup}
            />
            <ChatMain
              chat={activeChat}
              messages={globalmessages.get(activeChat?.id || "") || []}
              toggleSidebar={toggleSidebar}
              users={users || []}
              onGroupInfoClick={toggleGroupInfo}
            />
            {showGroupInfo && activeChat?.type === "group" && (
              <GroupInfo chat={activeChat} users={users||[]} onClose={() => setShowGroupInfo(false)} />
            )}
            {showCreateGroup && (
              <CreateGroup users={contacts} onClose={() => setShowCreateGroup(false)} onCreateGroup={handleCreateGroup} />
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
        return <SearchSidebar isOpen={sidebarOpen} chats={chats} users={users||[]} />
      default:
        return (
          <>
            <ChatSidebar
              chats={chats}
              activeChat={activeChat}
              setActiveChat={setActiveChat}
              isOpen={sidebarOpen}
              toggleSidebar={toggleSidebar}
              users={contacts}
              onCreateGroup={toggleCreateGroup}
            />
            <ChatMain
              chat={activeChat}
              messages={globalmessages.get(activeChat?.id || "") || []}
              toggleSidebar={toggleSidebar}
              users={users || []}
              onGroupInfoClick={toggleGroupInfo}
            />
          </>
        )
    }
  }

  return (
    <UserProvider>
      <WebSocketProvider
        userId={currentUserDetail?.id || ""}
        onNewMessage={handleNewWebSocketMessage}
        onUserStatusChange={handleUserStatusChange}
        onChatUpdate={handleChatUpdate}
      >
        <div className="flex h-screen w-full overflow-hidden bg-gray-50 pt-6">
          <div className="flex h-[calc(100vh-3rem)] w-full max-w-6xl mx-auto rounded-lg overflow-hidden shadow-lg bg-white">
            <NavSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
            {renderContent()}
          </div>
          <AIAssistant />
        </div>
      </WebSocketProvider>
    </UserProvider>
  )
}
