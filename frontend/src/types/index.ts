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
  type: "individual" | "group" // 新增类型字段，区分单聊和群聊
  participantId?: string // 单聊时的参与者ID
  participants?: string[] // 群聊时的参与者ID列表
  groupName?: string // 群聊名称
  groupAvatar?: string // 群聊头像
  messages: Message[]
  lastMessage?: string
  lastMessageTime?: Date
  lastMessageStatus?: "sent" | "delivered" | "read"
  unreadCount: number
  createdBy?: string // 群聊创建者
}
