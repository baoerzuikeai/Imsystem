"use client"

import { useState, useCallback, useEffect } from "react"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ChatMain } from "@/components/chat-main"
import { NavSidebar } from "@/components/nav-sidebar"
import { ContactsSidebar } from "@/components/contacts-sidebar"
import { ContactDetails } from "@/components/contact-details"
import { SettingsSidebar } from "@/components/settings-sidebar"
import { SearchSidebar } from "@/components/search-sidebar"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react"; // 仅导入成功图标
import { GroupInfo } from "@/components/group-info"
import { CreateGroup } from "@/components/create-group"
import { WebSocketProvider } from "@/contexts/websocket-context"
import { useMobile } from "@/hooks/use-mobile"
import type { Chat, User, Message,CreateGroupRequestDto} from "@/types"
import { UserProvider } from "@/contexts/user-context"
import { AIAssistant } from "@/components/ai-assistant"
import { useApi } from "@/hooks/use-api"

export function ChatLayout() {
  const { chats, fetchChats, messages, fetchMessages,contacts,
    fetchMembers,addMessageToGlobalCache,currentUserDetail,setChats: globalSetChats, 
    globalmessages, performCreateGroupChat
  } = useApi();
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const isMobile = useMobile()
  const [users, setUsers] = useState<User[]|null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const [activeSection, setActiveSection] = useState("chats")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showGroupInfo, setShowGroupInfo] = useState(false)
  const [showCreateGroup, setShowCreateGroup] = useState(false)

  const [showGroupSuccessAlert, setShowGroupSuccessAlert] = useState(false);
  const [successAlertMessage, setSuccessAlertMessage] = useState("");

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

 

  const handleCreateGroup = async (name: string, participantIdsFromComponent: string[]) => {
    if (!currentUserDetail) {
      console.error("Current user not loaded, cannot create group.");
      // 可以选择在这里弹出一个错误提示，但按照您的要求，我们仅关注成功提示
      return;
    }

    const processedMemberIds = participantIdsFromComponent.map(id =>
      id === "user-current" ? currentUserDetail.id : id
    );
    const uniqueMemberIds = Array.from(new Set(processedMemberIds));

    if (name.trim() === "") {
      console.error("Group name cannot be empty.");
      return;
    }
    if (uniqueMemberIds.length < 1) {
      console.error("A group needs at least one member.");
      return;
    }

    const groupData:CreateGroupRequestDto = {
      title: name,
      memberIds: uniqueMemberIds,
    };


    setShowCreateGroup(false); // 先关闭创建表单

    try {
      const newGroupChat = await performCreateGroupChat(groupData); // performCreateGroupChat 来自 useApi()
      console.log("Creating group with data:", groupData);
      if (newGroupChat?.chat) {
        console.log("Group created successfully in ChatLayout:", newGroupChat);
        // 设置成功提示信息并显示提示框
        setSuccessAlertMessage(`Successfully created group "${newGroupChat.chat.title || name}"!`);
        setShowGroupSuccessAlert(true);

        // fetchChats() 应该在 performCreateGroupChat 内部或其上下文中被调用以更新列表
        // 可选：将新创建的群聊设置为当前活动聊天
        setActiveChat(newGroupChat.chat); // 假设 newGroupChat 是完整的 Chat 对象

      } else {
        // API 调用可能成功但没有返回预期的群聊对象，或者 performCreateGroupChat 内部处理了错误但返回了 undefined
        console.error("Failed to create group in ChatLayout: No group data returned from performCreateGroupChat.",newGroupChat);
        // 此处不弹错误提示，按您的要求只关注成功
      }
    } catch (error) {
      // performCreateGroupChat 抛出了错误
      console.error("Error explicitly caught while creating group in ChatLayout:", error);
      // 此处不弹错误提示，按您的要求只关注成功
    }
  };

  const closeGroupSuccessAlert = () => {
    setShowGroupSuccessAlert(false);
    setSuccessAlertMessage(""); // 清空消息，以便下次使用
  };

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
      // case "search":
      //   return <SearchSidebar isOpen={sidebarOpen} chats={chats} users={users||[]} />
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
        <AlertDialog open={showGroupSuccessAlert} onOpenChange={setShowGroupSuccessAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Success
              </AlertDialogTitle>
              <AlertDialogDescription>
                {successAlertMessage}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button onClick={closeGroupSuccessAlert}>OK</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </WebSocketProvider>
    </UserProvider>
  )
}
