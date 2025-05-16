"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Menu, Video, Phone, MoreHorizontal, Smile, Paperclip, Send, Users, Info } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import EmojiPicker, { EmojiClickData, Theme as EmojiTheme, Categories } from 'emoji-picker-react'; // Import Emoji Picker
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useWebSocketContext } from "@/contexts/websocket-context"
import type { Chat, User, Message } from "@/types"
import { MessageBubble } from "@/components/message-bubble"
import { getChatAvatar, getChatTitle, getUserOnlineStatus } from "@/utils/chat-utils"
import { useApi } from "@/hooks/use-api"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

interface FileUploadResponse {
  id: string;
  name: string;
  // ... other fields from your example response
}
interface ChatMainProps {
  chat: Chat | null
  toggleSidebar: () => void
  users: User[]
  messages: Message[]
  onGroupInfoClick?: () => void
}

export function ChatMain({ chat, toggleSidebar, users, messages, onGroupInfoClick }: ChatMainProps) {
  const [messageInput, setMessageInput] = useState("")
  // const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  // const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null); // Ref for the text input
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false); // State for Popover


  // 使用 WebSocket 上下文
  const { currentUserDetail, addMessageToGlobalCache } = useApi();
  const { sendMessage: sendWsMessageViaContext } = useWebSocketContext();

  const isGroup = chat?.type === "group"
  const chatTitle = currentUserDetail && chat ? getChatTitle(chat, currentUserDetail.id, users) : "Unknown Chat"
  const chatAvatar = chat ? getChatAvatar(chat, currentUserDetail?.id || "", users) : "/placeholder.svg"
  // 获取群聊成员信息
  const groupMembers =
    isGroup && chat
      ? chat.members
        .map((member) => users.find((user) => user.id === member.userId))
        .filter((user): user is User => user !== undefined)
      : []

  // 获取在线成员数量
  const onlineMembers = groupMembers.filter((member) => getUserOnlineStatus(member.id, users)).length

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages, chat?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessageInput(value);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chat || !messageInput.trim() || !currentUserDetail) return;

    const wsPayload = { // This now directly matches SendMessagePayload
      chatId: chat.id,
      type: 'chat' as 'chat' | 'code' | 'file', // Explicitly type for 'chat' for now
      content: messageInput, // For 'chat' type, content is the string itself
      // language: undefined, // For 'code'
      // fileName: undefined, // For 'file'
    };

    const success = sendWsMessageViaContext(wsPayload);
    if (!success) {
      console.error("ChatMain: Failed to send message via WebSocket.");
      // Optionally, implement retry or error feedback to the user
      // You might want to update an optimistic message to 'failed' status
    }

    setMessageInput("");
    // Removed typing timeout clearing logic

    textInputRef.current?.focus(); // Re-focus after sending
  };
  // 清理超时

  const handlePaperclipClick = () => {
    fileInputRef.current?.click(); // Trigger click on hidden file input
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !chat || !currentUserDetail) {
      console.warn("File selection cancelled or missing chat/user details.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // Retrieve token from localStorage (adjust if your token storage is different)
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Authentication token not found.");
      // Handle missing token (e.g., redirect to login or show error)
      return;
    }

    const uploadUrl = `http://localhost:8080/api/v1/files/upload?chatId=${chat.id}`;

    try {
      console.log(`Uploading file to: ${uploadUrl}`);
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          // 'Content-Type' is automatically set by browser for FormData
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to upload file and parse error response." }));
        throw new Error(errorData.message || `File upload failed with status: ${response.status}`);
      }

      const uploadedFileData: FileUploadResponse = await response.json();
      console.log("File uploaded successfully:", uploadedFileData);

      // Now send the file message via WebSocket
      const wsFilePayload = {
        chatId: chat.id,
        type: 'file' as 'file',
        content: uploadedFileData.id,      // File ID from upload response
        fileName: uploadedFileData.name, // File name from upload response
      };

      const success = sendWsMessageViaContext(wsFilePayload);
      if (!success) {
        console.error("ChatMain: Failed to send file message via WebSocket.");
        // Optionally, handle this error (e.g., notify user)
      } else {
        console.log("File message sent via WebSocket:", wsFilePayload);
      }

    } catch (error) {
      console.error("Error during file upload or sending WebSocket message:", error);
      // Notify user about the error (e.g., using a toast notification)
      alert(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      // Reset file input to allow selecting the same file again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    // For simplicity, we append. For inserting at cursor, more complex logic is needed.
    setMessageInput(prevInput => prevInput + emojiData.emoji);
    setIsEmojiPickerOpen(false); // Close the picker after selection
    textInputRef.current?.focus(); // Re-focus the text input
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20 border-l border-border">
        <div className="text-center">
          <h3 className="text-lg font-medium">No chat selected</h3>
          <p className="text-muted-foreground">Select a chat to start messaging</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full border-l border-border shadow-sm">
      <div className="border-b border-border p-4 flex justify-between items-center bg-background">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          <Avatar>
            <AvatarImage src={chatAvatar || "/placeholder.svg"} alt={chatTitle} />
            <AvatarFallback>
              {isGroup ? <Users className="h-4 w-4 text-primary" /> : chatTitle.substring(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="font-medium">{chatTitle}</h2>
            {isGroup ? (
              <p className="text-xs text-muted-foreground">
                {onlineMembers} online • {groupMembers.length} members
              </p>
            ) : (
              <p className="text-xs text-green-500">
                {getUserOnlineStatus(chat.members.find((m) => m.userId != currentUserDetail?.id)?.userId ?? "", users)
                  ? "Online"
                  : "Offline"}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isGroup && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onGroupInfoClick}>
                    <Info className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Group Info</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar border-left-0">
        <div className="flex flex-col gap-4">
          {messages?.length > 0 ? (
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isCurrentUser={currentUserDetail ? message.senderId === currentUserDetail.id : false}
                user={users.find((u) => u.id === message.senderId)}
              />
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No messages yet. Start a conversation!</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* {typingUserNames.length > 0 && (
        <div className="px-4 py-1 text-xs text-muted-foreground">
          {typingUserNames.length === 1
            ? `${typingUserNames[0]} is typing...`
            : `${typingUserNames.join(", ")} are typing...`}
        </div>
      )} */}

      <form onSubmit={handleFormSubmit} className="border-t border-border p-4 flex items-center gap-2 bg-background">
      <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="icon">
              <Smile className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="p-0 w-auto border-0" 
            side="top" // Position the popover above the trigger
            align="start" // Align to the start of the trigger
            sideOffset={5} // Optional: add some space
          >
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              autoFocusSearch={false}
              theme={EmojiTheme.AUTO} // Or EmojiTheme.LIGHT / EmojiTheme.DARK
              lazyLoadEmojis={true}
              // height={350} // Adjust height if needed
              // width="100%" // Can set a specific width or let it be auto
              // previewConfig={{ showPreview: false }} // Example: hide preview
            />
          </PopoverContent>
        </Popover>
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        // You can add an 'accept' attribute to filter file types
        // accept="image/*,video/*,.pdf,.doc,.docx,.txt" 
        />
        <Button type="button" variant="ghost" size="icon" onClick={handlePaperclipClick}>
          <Paperclip className="h-5 w-5" />
        </Button>
        <Input placeholder="Enter message..." value={messageInput} onChange={handleInputChange} className="flex-1" />
        <Button type="submit" size="icon">
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  )
}
