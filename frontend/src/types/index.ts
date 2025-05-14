export interface User {
  id: string
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

export interface UserInfo {
  id:string
  username: string
  email: string
  avatar: string
  nickname: string
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

export interface AIChat {
  _id: string
  userId: string
  question: string
  answer: string
  type: "code_review" | "qa" | "optimization"
  createdAt: Date
}

export interface RegisterRequestDto{
  username: string
  email: string
  password: string 
  nickname: string
} 

export interface LoginRequestDto{
  email: string
  password: string
}

export interface LoginResponse {
  token: string;
  user: UserInfo;
}

export interface RegisterResponse {
  message: string
  user: UserInfo
}

export interface SearchedUser extends User {}

export interface CreatePrivateChatResponse {
  chat:Chat
  error:string
  message:string
}