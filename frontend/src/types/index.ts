export interface User {
  _id: string
  username: string
  email: string
  avatar: string
  status: {
    online: boolean
    lastSeen: Date
  }
  profile: {
    nickname: string
    bio: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface ChatMember {
  userId: string
  role: "owner" | "member"
  joinedAt: Date
}

export interface Chat {
  _id: string
  type: "private" | "group"
  title: string | null
  avatar: string | null
  members: ChatMember[]
  lastMessageAt: Date
  createdBy: string
  createdAt: Date
}

export interface MessageContent {
  text?: string
  file?: {
    fileId: string
    fileName: string
  }
}

export interface MessageReadBy {
  userId: string
  readAt: Date
}

export interface Message {
  _id: string
  chatId: string
  senderId: string
  type: "text" | "file"
  content: MessageContent
  replyTo?: string
  readBy: MessageReadBy[]
  createdAt: Date
}

export interface File {
  _id: string
  name: string
  type: string
  size: number
  url: string
  uploaderId: string
  chatId: string
  downloads: number
  createdAt: Date
}

export interface ChatState {
  _id: string
  userId: string
  chatId: string
  unreadCount: number
  lastReadMessageId: string
  updatedAt: Date
}
