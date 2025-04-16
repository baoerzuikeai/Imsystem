export interface User {
  id: string
  name: string
  avatar: string
  status: "online" | "offline"
  phone?: string
  email?: string
}

export interface Message {
  id: string
  content: string
  senderId: string
  timestamp: Date
  status: "sent" | "delivered" | "read"
  attachments?: any[]
}

export interface Chat {
  id: string
  participantId: string
  messages: Message[]
  lastMessage?: string
  lastMessageTime?: Date
  lastMessageStatus?: "sent" | "delivered" | "read"
  unreadCount: number
}
