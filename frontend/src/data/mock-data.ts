"use client"

import type { User, Chat, Message, File, ChatState,AIChat } from "@/types"

// 创建当前用户
export const currentUser: User = {
  _id: "user-current",
  username: "currentuser",
  email: "current@example.com",
  avatar: "/placeholder.svg?height=40&width=40",
  status: {
    online: true,
    lastSeen: new Date(),
  },
  profile: {
    nickname: "You",
    bio: "Frontend developer passionate about UI/UX",
  },
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-01-01"),
}

// 创建模拟用户
export const mockUsers: User[] = [
  {
    _id: "user-1",
    username: "jslow",
    email: "jslow@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: {
      online: true,
      lastSeen: new Date(),
    },
    profile: {
      nickname: "Jacquenetta Slowgrave",
      bio: "UX Designer with 5 years of experience",
    },
    createdAt: new Date("2023-01-02"),
    updatedAt: new Date("2023-06-15"),
  },
  {
    _id: "user-2",
    username: "npeever",
    email: "npeever@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: {
      online: false,
      lastSeen: new Date(Date.now() - 3600000 * 5), // 5 hours ago
    },
    profile: {
      nickname: "Nickola Peever",
      bio: "Product Manager | Coffee Enthusiast",
    },
    createdAt: new Date("2023-01-03"),
    updatedAt: new Date("2023-07-20"),
  },
  {
    _id: "user-3",
    username: "fhume",
    email: "fhume@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: {
      online: true,
      lastSeen: new Date(),
    },
    profile: {
      nickname: "Farand Hume",
      bio: "Backend Developer | Open Source Contributor",
    },
    createdAt: new Date("2023-01-04"),
    updatedAt: new Date("2023-05-10"),
  },
  {
    _id: "user-4",
    username: "opeasey",
    email: "opeasey@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: {
      online: false,
      lastSeen: new Date(Date.now() - 3600000 * 24), // 1 day ago
    },
    profile: {
      nickname: "Ossie Peasey",
      bio: "DevOps Engineer | Cloud Specialist",
    },
    createdAt: new Date("2023-01-05"),
    updatedAt: new Date("2023-08-01"),
  },
  {
    _id: "user-5",
    username: "hnegri",
    email: "hnegri@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: {
      online: true,
      lastSeen: new Date(),
    },
    profile: {
      nickname: "Hall Negri",
      bio: "Full Stack Developer | React & Node.js",
    },
    createdAt: new Date("2023-01-06"),
    updatedAt: new Date("2023-04-12"),
  },
  {
    _id: "user-6",
    username: "esegot",
    email: "esegot@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: {
      online: false,
      lastSeen: new Date(Date.now() - 3600000 * 2), // 2 hours ago
    },
    profile: {
      nickname: "Elyssa Segot",
      bio: "UI Designer | Typography Enthusiast",
    },
    createdAt: new Date("2023-01-07"),
    updatedAt: new Date("2023-09-05"),
  },
  {
    _id: "user-7",
    username: "gwilfing",
    email: "gwilfing@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: {
      online: true,
      lastSeen: new Date(),
    },
    profile: {
      nickname: "Gil Wilfing",
      bio: "Mobile Developer | Flutter Expert",
    },
    createdAt: new Date("2023-01-08"),
    updatedAt: new Date("2023-03-22"),
  },
  {
    _id: "user-8",
    username: "bcleaton",
    email: "bcleaton@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: {
      online: false,
      lastSeen: new Date(Date.now() - 3600000 * 12), // 12 hours ago
    },
    profile: {
      nickname: "Bab Cleaton",
      bio: "Data Scientist | Machine Learning Researcher",
    },
    createdAt: new Date("2023-01-09"),
    updatedAt: new Date("2023-10-18"),
  },
  {
    _id: "user-9",
    username: "jsatch",
    email: "jsatch@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: {
      online: true,
      lastSeen: new Date(),
    },
    profile: {
      nickname: "Janith Satch",
      bio: "QA Engineer | Test Automation Specialist",
    },
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2023-02-28"),
  },
]

// 创建模拟聊天
export const mockChats: Chat[] = [
  // 私聊
  {
    _id: "chat-1",
    type: "private",
    title: null,
    avatar: null,
    members: [
      {
        userId: "user-current",
        role: "member",
        joinedAt: new Date("2023-06-01"),
      },
      {
        userId: "user-1",
        role: "member",
        joinedAt: new Date("2023-06-01"),
      },
    ],
    lastMessageAt: new Date(Date.now() - 300000), // 5 minutes ago
    createdBy: "user-current",
    createdAt: new Date("2023-06-01"),
  },
  {
    _id: "chat-2",
    type: "private",
    title: null,
    avatar: null,
    members: [
      {
        userId: "user-current",
        role: "member",
        joinedAt: new Date("2023-06-02"),
      },
      {
        userId: "user-2",
        role: "member",
        joinedAt: new Date("2023-06-02"),
      },
    ],
    lastMessageAt: new Date(Date.now() - 79200000), // 22 hours ago
    createdBy: "user-2",
    createdAt: new Date("2023-06-02"),
  },
  {
    _id: "chat-3",
    type: "private",
    title: null,
    avatar: null,
    members: [
      {
        userId: "user-current",
        role: "member",
        joinedAt: new Date("2023-06-03"),
      },
      {
        userId: "user-3",
        role: "member",
        joinedAt: new Date("2023-06-03"),
      },
    ],
    lastMessageAt: new Date(Date.now() - 169200000), // 47 hours ago
    createdBy: "user-3",
    createdAt: new Date("2023-06-03"),
  },
  // 群聊
  {
    _id: "chat-4",
    type: "group",
    title: "Project Team",
    avatar: "/placeholder.svg?height=40&width=40",
    members: [
      {
        userId: "user-current",
        role: "member",
        joinedAt: new Date("2023-06-04"),
      },
      {
        userId: "user-1",
        role: "owner",
        joinedAt: new Date("2023-06-04"),
      },
      {
        userId: "user-2",
        role: "member",
        joinedAt: new Date("2023-06-04"),
      },
      {
        userId: "user-3",
        role: "member",
        joinedAt: new Date("2023-06-04"),
      },
    ],
    lastMessageAt: new Date(Date.now() - 162000000), // 45 hours ago
    createdBy: "user-1",
    createdAt: new Date("2023-06-04"),
  },
  {
    _id: "chat-5",
    type: "group",
    title: "Weekend Hangout",
    avatar: "/placeholder.svg?height=40&width=40",
    members: [
      {
        userId: "user-current",
        role: "member",
        joinedAt: new Date("2023-06-05"),
      },
      {
        userId: "user-4",
        role: "owner",
        joinedAt: new Date("2023-06-05"),
      },
      {
        userId: "user-5",
        role: "member",
        joinedAt: new Date("2023-06-05"),
      },
      {
        userId: "user-6",
        role: "member",
        joinedAt: new Date("2023-06-05"),
      },
    ],
    lastMessageAt: new Date(Date.now() - 248400000), // 69 hours ago
    createdBy: "user-4",
    createdAt: new Date("2023-06-05"),
  },
]

// 创建模拟消息
export const mockMessages: Message[] = [
  // 聊天 1 的消息
  {
    _id: "msg-1-1",
    chatId: "chat-1",
    senderId: "user-1",
    type: "text",
    content: {
      text: "Hey there! How's it going?",
    },
    readBy: [
      {
        userId: "user-current",
        readAt: new Date(Date.now() - 3500000),
      },
      {
        userId: "user-1",
        readAt: new Date(Date.now() - 3500000),
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
  },
  {
    _id: "msg-1-2",
    chatId: "chat-1",
    senderId: "user-current",
    type: "text",
    content: {
      text: "I'm doing well, thanks for asking! How about you?",
    },
    readBy: [
      {
        userId: "user-current",
        readAt: new Date(Date.now() - 3500000),
      },
      {
        userId: "user-1",
        readAt: new Date(Date.now() - 3500000),
      },
    ],
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
  },
  {
    _id: "msg-1-3",
    chatId: "chat-1",
    senderId: "user-1",
    type: "text",
    content: {
      text: "Great! Looking forward to our meeting tomorrow.",
    },
    readBy: [
      {
        userId: "user-current",
        readAt: new Date(Date.now() - 1700000),
      },
      {
        userId: "user-1",
        readAt: new Date(Date.now() - 1700000),
      },
    ],
    createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
  },
  {
    _id: "msg-1-4",
    chatId: "chat-1",
    senderId: "user-1",
    type: "file",
    content: {
      file: {
        fileId: "file-1",
        fileName: "project_mockup.png",
      },
    },
    readBy: [
      {
        userId: "user-current",
        readAt: new Date(Date.now() - 800000),
      },
      {
        userId: "user-1",
        readAt: new Date(Date.now() - 800000),
      },
    ],
    createdAt: new Date(Date.now() - 900000), // 15 minutes ago
  },
  {
    _id: "msg-1-5",
    chatId: "chat-1",
    senderId: "user-current",
    type: "text",
    content: {
      text: "**Chats**\n```json\n{\n  _id: ObjectId,\n  type: String,           // 'private' 或 'group'\n  title: String,          // 群聊名称（私聊为null）\n  avatar: String,         // 群聊头像（私聊为null）\n  members: [{\n    userId: ObjectId,     // 成员ID\n    role: String,         // 'owner', 'member'\n    joinedAt: Date\n  }],\n  lastMessageAt: Date,    // 最后消息时间\n  createdBy: ObjectId,    // 创建者ID\n  createdAt: Date\n}\n```",
    },
    readBy: [
      {
        userId: "user-current",
        readAt: new Date(Date.now() - 500000),
      },
      {
        userId: "user-1",
        readAt: new Date(Date.now() - 500000),
      },
    ],
    createdAt: new Date(Date.now() - 600000), // 10 minutes ago
  },
  {
    _id: "msg-1-6",
    chatId: "chat-1",
    senderId: "user-1",
    type: "text",
    content: {
      text: "And here's a markdown example:\n\n# Heading 1\n## Heading 2\n\n- List item 1\n- List item 2\n\n**Bold text** and *italic text*\n\n> This is a blockquote\n\n[Link example](https://example.com)",
    },
    readBy: [
      {
        userId: "user-current",
        readAt: new Date(Date.now() - 200000),
      },
      {
        userId: "user-1",
        readAt: new Date(Date.now() - 200000),
      },
    ],
    createdAt: new Date(Date.now() - 300000), // 5 minutes ago
  },

  // 聊天 2 的消息
  {
    _id: "msg-2-1",
    chatId: "chat-2",
    senderId: "user-2",
    type: "text",
    content: {
      text: "Have you checked the latest project requirements?",
    },
    readBy: [
      {
        userId: "user-current",
        readAt: new Date(Date.now() - 86300000),
      },
      {
        userId: "user-2",
        readAt: new Date(Date.now() - 86300000),
      },
    ],
    createdAt: new Date(Date.now() - 86400000), // 24 hours ago
  },
  {
    _id: "msg-2-2",
    chatId: "chat-2",
    senderId: "user-current",
    type: "text",
    content: {
      text: "Yes, I've reviewed them. Let's discuss tomorrow.",
    },
    readBy: [
      {
        userId: "user-current",
        readAt: new Date(Date.now() - 82700000),
      },
      {
        userId: "user-2",
        readAt: new Date(Date.now() - 82700000),
      },
    ],
    createdAt: new Date(Date.now() - 82800000), // 23 hours ago
  },
  {
    _id: "msg-2-3",
    chatId: "chat-2",
    senderId: "user-2",
    type: "text",
    content: {
      text: "Sounds perfect! I've been working on some ideas.",
    },
    readBy: [
      {
        userId: "user-current",
        readAt: new Date(Date.now() - 79100000),
      },
      {
        userId: "user-2",
        readAt: new Date(Date.now() - 79100000),
      },
    ],
    createdAt: new Date(Date.now() - 79200000), // 22 hours ago
  },

  // 聊天 3 的消息
  {
    _id: "msg-3-1",
    chatId: "chat-3",
    senderId: "user-3",
    type: "text",
    content: {
      text: "How about 7 PM at the new Italian place?",
    },
    readBy: [
      {
        userId: "user-current",
        readAt: new Date(Date.now() - 172700000),
      },
      {
        userId: "user-3",
        readAt: new Date(Date.now() - 172700000),
      },
    ],
    createdAt: new Date(Date.now() - 172800000), // 48 hours ago
  },
  {
    _id: "msg-3-2",
    chatId: "chat-3",
    senderId: "user-current",
    type: "text",
    content: {
      text: "That works for me! See you there.",
    },
    readBy: [
      {
        userId: "user-current",
        readAt: new Date(Date.now() - 169100000),
      },
      {
        userId: "user-3",
        readAt: new Date(Date.now() - 169100000),
      },
    ],
    createdAt: new Date(Date.now() - 169200000), // 47 hours ago
  },

  // 聊天 4 (群聊) 的消息
  {
    _id: "msg-4-1",
    chatId: "chat-4",
    senderId: "user-1",
    type: "text",
    content: {
      text: "Hey team, let's discuss the upcoming deadline.",
    },
    readBy: [
      {
        userId: "user-current",
        readAt: new Date(Date.now() - 172700000),
      },
      {
        userId: "user-1",
        readAt: new Date(Date.now() - 172700000),
      },
      {
        userId: "user-2",
        readAt: new Date(Date.now() - 172600000),
      },
      {
        userId: "user-3",
        readAt: new Date(Date.now() - 172500000),
      },
    ],
    createdAt: new Date(Date.now() - 172800000), // 48 hours ago
  },
  {
    _id: "msg-4-2",
    chatId: "chat-4",
    senderId: "user-2",
    type: "text",
    content: {
      text: "I think we should prioritize the frontend tasks first.",
    },
    readBy: [
      {
        userId: "user-current",
        readAt: new Date(Date.now() - 169100000),
      },
      {
        userId: "user-1",
        readAt: new Date(Date.now() - 169100000),
      },
      {
        userId: "user-2",
        readAt: new Date(Date.now() - 169100000),
      },
      {
        userId: "user-3",
        readAt: new Date(Date.now() - 169000000),
      },
    ],
    createdAt: new Date(Date.now() - 169200000), // 47 hours ago
  },
  {
    _id: "msg-4-3",
    chatId: "chat-4",
    senderId: "user-current",
    type: "text",
    content: {
      text: "Agreed. I can help with the UI components.",
    },
    readBy: [
      {
        userId: "user-current",
        readAt: new Date(Date.now() - 165500000),
      },
      {
        userId: "user-1",
        readAt: new Date(Date.now() - 165400000),
      },
      {
        userId: "user-2",
        readAt: new Date(Date.now() - 165300000),
      },
      {
        userId: "user-3",
        readAt: new Date(Date.now() - 165200000),
      },
    ],
    createdAt: new Date(Date.now() - 165600000), // 46 hours ago
  },
  {
    _id: "msg-4-4",
    chatId: "chat-4",
    senderId: "user-3",
    type: "text",
    content: {
      text: "Great! I'll focus on the backend integration then.",
    },
    readBy: [
      {
        userId: "user-current",
        readAt: new Date(Date.now() - 161900000),
      },
      {
        userId: "user-1",
        readAt: new Date(Date.now() - 161800000),
      },
      {
        userId: "user-2",
        readAt: new Date(Date.now() - 161700000),
      },
      {
        userId: "user-3",
        readAt: new Date(Date.now() - 161900000),
      },
    ],
    createdAt: new Date(Date.now() - 162000000), // 45 hours ago
  },

  // 聊天 5 (群聊) 的消息
  {
    _id: "msg-5-1",
    chatId: "chat-5",
    senderId: "user-4",
    type: "text",
    content: {
      text: "Who's up for dinner this Saturday?",
    },
    readBy: [
      {
        userId: "user-current",
        readAt: new Date(Date.now() - 259100000),
      },
      {
        userId: "user-4",
        readAt: new Date(Date.now() - 259100000),
      },
      {
        userId: "user-5",
        readAt: new Date(Date.now() - 259000000),
      },
      {
        userId: "user-6",
        readAt: new Date(Date.now() - 258900000),
      },
    ],
    createdAt: new Date(Date.now() - 259200000), // 72 hours ago
  },
  {
    _id: "msg-5-2",
    chatId: "chat-5",
    senderId: "user-5",
    type: "text",
    content: {
      text: "I'm in! Where should we go?",
    },
    readBy: [
      {
        userId: "user-current",
        readAt: new Date(Date.now() - 255500000),
      },
      {
        userId: "user-4",
        readAt: new Date(Date.now() - 255400000),
      },
      {
        userId: "user-5",
        readAt: new Date(Date.now() - 255500000),
      },
      {
        userId: "user-6",
        readAt: new Date(Date.now() - 255300000),
      },
    ],
    createdAt: new Date(Date.now() - 255600000), // 71 hours ago
  },
  {
    _id: "msg-5-3",
    chatId: "chat-5",
    senderId: "user-current",
    type: "text",
    content: {
      text: "How about that new Italian place downtown?",
    },
    readBy: [
      {
        userId: "user-current",
        readAt: new Date(Date.now() - 251900000),
      },
      {
        userId: "user-4",
        readAt: new Date(Date.now() - 251800000),
      },
      {
        userId: "user-5",
        readAt: new Date(Date.now() - 251700000),
      },
      {
        userId: "user-6",
        readAt: new Date(Date.now() - 251600000),
      },
    ],
    createdAt: new Date(Date.now() - 252000000), // 70 hours ago
  },
  {
    _id: "msg-5-4",
    chatId: "chat-5",
    senderId: "user-6",
    type: "text",
    content: {
      text: "Sounds perfect! Let's meet at 7pm.",
    },
    readBy: [
      {
        userId: "user-current",
        readAt: new Date(Date.now() - 248300000),
      },
      {
        userId: "user-4",
        readAt: new Date(Date.now() - 248200000),
      },
      {
        userId: "user-5",
        readAt: new Date(Date.now() - 248100000),
      },
      {
        userId: "user-6",
        readAt: new Date(Date.now() - 248300000),
      },
    ],
    createdAt: new Date(Date.now() - 248400000), // 69 hours ago
  },
]

// 创建模拟文件
export const mockFiles: File[] = [
  {
    _id: "file-1",
    name: "project_mockup.png",
    type: "image/png",
    size: 1024000, // 1MB
    url: "http://localhost:8080/uploads/6821c1943d82d96189c9b144.jpg",
    uploaderId: "user-1",
    chatId: "chat-1",
    downloads: 2,
    createdAt: new Date(Date.now() - 900000), // 15 minutes ago
  },
]

// 创建模拟聊天状态
export const mockChatStates: ChatState[] = [
  {
    _id: "chatstate-1",
    userId: "user-current",
    chatId: "chat-1",
    unreadCount: 0,
    lastReadMessageId: "msg-1-6",
    updatedAt: new Date(Date.now() - 200000),
  },
  {
    _id: "chatstate-2",
    userId: "user-current",
    chatId: "chat-2",
    unreadCount: 0,
    lastReadMessageId: "msg-2-3",
    updatedAt: new Date(Date.now() - 79100000),
  },
  {
    _id: "chatstate-3",
    userId: "user-current",
    chatId: "chat-3",
    unreadCount: 0,
    lastReadMessageId: "msg-3-2",
    updatedAt: new Date(Date.now() - 169100000),
  },
  {
    _id: "chatstate-4",
    userId: "user-current",
    chatId: "chat-4",
    unreadCount: 0,
    lastReadMessageId: "msg-4-4",
    updatedAt: new Date(Date.now() - 161900000),
  },
  {
    _id: "chatstate-5",
    userId: "user-current",
    chatId: "chat-5",
    unreadCount: 0,
    lastReadMessageId: "msg-5-4",
    updatedAt: new Date(Date.now() - 248300000),
  },
]

// 初始化全局消息数组，用于模拟发送新消息
if (typeof window !== "undefined") {
  ;(window as any).mockMessages = mockMessages
}

// 辅助函数：根据聊天ID获取该聊天的所有消息
export function getMessagesByChatId(chatId: string): Message[] {
  // 首先从全局消息数组中获取消息
  const globalMessages = typeof window !== "undefined" ? (window as any).mockMessages || [] : []

  // 合并静态消息和动态添加的消息
  const allMessages = [
    ...mockMessages,
    ...globalMessages.filter((msg: Message) => !mockMessages.some((staticMsg) => staticMsg._id === msg._id)),
  ]

  return allMessages.filter((message) => message.chatId === chatId)
}

// 辅助函数：获取聊天的最后一条消息
export function getLastMessageForChat(chatId: string): Message | undefined {
  const chatMessages = getMessagesByChatId(chatId)
  if (chatMessages.length === 0) return undefined

  // 按创建时间排序，获取最新的消息
  return chatMessages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]
}

// 辅助函数：获取聊天的未读消息数
export function getUnreadCountForChat(chatId: string): number {
  const chatState = mockChatStates.find((state) => state.chatId === chatId && state.userId === "user-current")
  return chatState ? chatState.unreadCount : 0
}

// 辅助函数：获取聊天的参与者信息
export function getChatParticipants(chatId: string): User[] {
  const chat = mockChats.find((c) => c._id === chatId)
  if (!chat) return []

  return chat.members
    .map((member) => {
      if (member.userId === "user-current") {
        return currentUser
      }
      return mockUsers.find((user) => user._id === member.userId)
    })
    .filter((user): user is User => user !== undefined)
}

// 辅助函数：获取聊天标题（私聊显示对方名称，群聊显示群名称）
export function getChatTitle(chatId: string): string {
  const chat = mockChats.find((c) => c._id === chatId)
  if (!chat) return ""

  if (chat.type === "group") {
    return chat.title || "Group Chat"
  } else {
    // 私聊，找到对方用户
    const otherMemberId = chat.members.find((member) => member.userId !== "user-current")?.userId
    if (!otherMemberId) return "Chat"

    const otherUser = mockUsers.find((user) => user._id === otherMemberId)
    return otherUser?.profile.nickname || otherUser?.username || "Chat"
  }
}

// 辅助函数：获取聊天头像（私聊显示对方头像，群聊显示群头像）
export function getChatAvatar(chatId: string): string {
  const chat = mockChats.find((c) => c._id === chatId)
  if (!chat) return "/placeholder.svg"

  if (chat.type === "group") {
    return chat.avatar || "/placeholder.svg"
  } else {
    // 私聊，找到对方用户
    const otherMemberId = chat.members.find((member) => member.userId !== "user-current")?.userId
    if (!otherMemberId) return "/placeholder.svg"

    const otherUser = mockUsers.find((user) => user._id === otherMemberId)
    return otherUser?.avatar || "/placeholder.svg"
  }
}

// 辅助函数：获取用户在线状态
export function getUserOnlineStatus(userId: string): boolean {
  if (userId === "user-current") return currentUser.status.online
  const user = mockUsers.find((u) => u._id === userId)
  return user?.status.online || false
}

// 创建模拟AI助手聊天
export const mockAIChats: AIChat[] = [
  {
    _id: "ai-chat-1",
    userId: "user-current",
    question: "How do I optimize React performance?",
    answer:
      "# React Performance Optimization\n\nHere are some key strategies to optimize your React application:\n\n1. **Use React.memo for Component Memoization**\n   Prevent unnecessary re-renders by memoizing components that don't need to update frequently.\n\n2. **Implement useCallback and useMemo**\n   Memoize functions and computed values to avoid recreating them on each render.\n\n3. **Virtualize Long Lists**\n   Use libraries like `react-window` or `react-virtualized` to render only visible items in long lists.\n\n4. **Code Splitting with React.lazy**\n   Split your code into smaller chunks to reduce initial load time:\n\n```jsx\nconst LazyComponent = React.lazy(() => import('./LazyComponent'));\n\nfunction App() {\n  return (\n    <React.Suspense fallback={<div>Loading...</div>}>\n      <LazyComponent />\n    </React.Suspense>\n  );\n}\n```\n\n5. **Avoid Inline Function Definitions**\n   Define functions outside render to prevent new function creation on each render.\n\n6. **Use Production Builds**\n   Always use production builds for deployment as they're optimized and minified.\n\n7. **Implement shouldComponentUpdate**\n   For class components, implement this lifecycle method to control when a component should re-render.\n\n8. **Avoid Excessive State Updates**\n   Batch state updates when possible and avoid unnecessary state changes.\n\n9. **Use Web Workers for CPU-Intensive Tasks**\n   Move heavy computations off the main thread to keep your UI responsive.\n\n10. **Profile and Measure Performance**\n    Use React DevTools Profiler to identify performance bottlenecks in your application.\n\nImplementing these strategies will significantly improve your React application's performance and user experience.",
    type: "optimization",
    createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
  },
  {
    _id: "ai-chat-2",
    userId: "user-current",
    question: "What are the best practices for TypeScript with React?",
    answer:
      "# TypeScript with React: Best Practices\n\n## Type Definitions\n\n### Component Props\n\n```tsx\ntype ButtonProps = {\n  text: string;\n  onClick?: () => void;\n  variant?: 'primary' | 'secondary';\n  disabled?: boolean;\n};\n\nconst Button = ({ text, onClick, variant = 'primary', disabled = false }: ButtonProps) => {\n  return (\n    <button \n      onClick={onClick} \n      disabled={disabled}\n      className={`btn btn-${variant}`}\n    >\n      {text}\n    </button>\n  );\n};\n```\n\n### React.FC vs. Function Declaration\n\nPrefer function declarations over `React.FC` for better type inference:\n\n```tsx\n// Recommended\nconst Component = ({ name }: { name: string }) => <div>{name}</div>;\n\n// Not recommended\nconst Component: React.FC<{ name: string }> = ({ name }) => <div>{name}</div>;\n```\n\n## Hooks\n\n### useState with TypeScript\n\n```tsx\n// Explicit type annotation\nconst [user, setUser] = useState<User | null>(null);\n\n// Type inference works here\nconst [count, setCount] = useState(0);\n```\n\n### useRef with TypeScript\n\n```tsx\nconst inputRef = useRef<HTMLInputElement>(null);\n```\n\n## Event Handling\n\n```tsx\nconst handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {\n  console.log(event.target.value);\n};\n\nconst handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {\n  event.preventDefault();\n  // form submission logic\n};\n```\n\n## Children Props\n\n```tsx\ntype ContainerProps = {\n  children: React.ReactNode;\n  title: string;\n};\n\nconst Container = ({ children, title }: ContainerProps) => (\n  <div>\n    <h2>{title}</h2>\n    {children}\n  </div>\n);\n```\n\n## Custom Hooks\n\n```tsx\nfunction useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {\n  // Implementation...\n  return [storedValue, setValue];\n}\n\n// Usage\nconst [name, setName] = useLocalStorage<string>('name', 'John');\n```\n\n## Type Assertions\n\nUse type assertions sparingly and only when you're certain about the type:\n\n```tsx\nconst element = document.getElementById('root') as HTMLElement;\n// or\nconst element = <HTMLElement>document.getElementById('root');\n```\n\n## Discriminated Unions\n\n```tsx\ntype LoadingState = { status: 'loading' };\ntype SuccessState = { status: 'success'; data: User[] };\ntype ErrorState = { status: 'error'; error: Error };\n\ntype State = LoadingState | SuccessState | ErrorState;\n\nfunction renderState(state: State) {\n  switch (state.status) {\n    case 'loading':\n      return <Spinner />;\n    case 'success':\n      return <UserList users={state.data} />;\n    case 'error':\n      return <ErrorMessage error={state.error} />;\n  }\n}\n```\n\nImplementing these practices will help you write more maintainable and type-safe React applications with TypeScript.",
    type: "qa",
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
  },
  {
    _id: "ai-chat-3",
    userId: "user-current",
    question:
      "Can you review this code for me?\n\n```javascript\nfunction fetchData() {\n  fetch('https://api.example.com/data')\n    .then(response => response.json())\n    .then(data => {\n      console.log(data);\n      return data;\n    })\n    .catch(error => {\n      console.log('Error:', error);\n    });\n}\n```",
    answer:
      "# Code Review\n\nLet's review your `fetchData` function:\n\n```javascript\nfunction fetchData() {\n  fetch('https://api.example.com/data')\n    .then(response => response.json())\n    .then(data => {\n      console.log(data);\n      return data;\n    })\n    .catch(error => {\n      console.log('Error:', error);\n    });\n}\n```\n\n## Issues and Improvements\n\n### 1. Function doesn't return anything\n\nYour function processes the data but doesn't return the Promise, making it impossible for callers to access the fetched data.\n\n### 2. No error handling for non-2xx responses\n\nThe `fetch` API doesn't reject on HTTP error status codes (like 404 or 500). You need to check `response.ok`.\n\n### 3. Console logs in production code\n\nConsole logs should be removed or replaced with proper logging in production code.\n\n### 4. No loading state indication\n\nThere's no way for users to know when data is being fetched.\n\n## Improved Version\n\n```javascript\nasync function fetchData() {\n  try {\n    const response = await fetch('https://api.example.com/data');\n    \n    if (!response.ok) {\n      throw new Error(`HTTP error! Status: ${response.status}`);\n    }\n    \n    const data = await response.json();\n    return data;\n  } catch (error) {\n    // Consider using a proper error handling strategy instead of console.log\n    console.error('Failed to fetch data:', error);\n    throw error; // Re-throw to allow callers to handle the error\n  }\n}\n\n// Usage example\nasync function handleDataFetching() {\n  try {\n    const data = await fetchData();\n    // Process data here\n  } catch (error) {\n    // Handle error appropriately (e.g., show error message to user)\n  }\n}\n```\n\n## Additional Suggestions\n\n1. **Add timeout handling**:\n   ```javascript\n   const controller = new AbortController();\n   const timeoutId = setTimeout(() => controller.abort(), 5000);\n   \n   try {\n     const response = await fetch('https://api.example.com/data', {\n       signal: controller.signal\n     });\n     // Process response\n   } catch (error) {\n     if (error.name === 'AbortError') {\n       // Handle timeout\n     }\n   } finally {\n     clearTimeout(timeoutId);\n   }\n   ```\n\n2. **Consider using a request library** like axios which handles some of these issues automatically.\n\n3. **Add request parameters** for flexibility:\n   ```javascript\n   async function fetchData(url, options = {}) {\n     // Implementation\n   }\n   ```\n\n4. **Add retry logic** for transient failures.\n\nThese improvements will make your code more robust, maintainable, and user-friendly.",
    type: "code_review",
    createdAt: new Date(Date.now() - 3600000 * 5), // 5 hours ago
  },
  {
    _id: "ai-chat-4",
    userId: "user-current",
    question: 
      "Can you help me with my homework?",
    answer:
      "# Go语言实现冒泡排序\n\n冒泡排序是一种简单的排序算法，它重复地遍历要排序的数列，一次比较两个元素，如果它们的顺序错误就把它们交换过来。下面是用Go语言实现的冒泡排序：\n\n```go\npackage main\n\nimport \"fmt\"\n\nfunc bubbleSort(arr []int) {\n    n := len(arr)\n    for i := 0; i < n-1; i++ {\n        // 每次遍历后，最大的元素会\"冒泡\"到最后\n        for j := 0; j < n-i-1; j++ {\n            if arr[j] > arr[j+1] {\n                // 交换相邻元素\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n            }\n        }\n    }\n}\n\nfunc main() {\n    // 测试冒泡排序\n    arr := []int{64, 34, 25, 12, 22, 11, 90}\n    fmt.Println(\"排序前:\", arr)\n    \n    bubbleSort(arr)\n    \n    fmt.Println(\"排序后:\", arr)\n}\n```\n\n## 代码说明\n\n1. `bubbleSort`函数接收一个整数切片作为参数\n2. 外层循环控制排序轮数，共需要n-1轮\n3. 内层循环比较相邻元素，如果前一个比后一个大，则交换它们\n4. 每轮结束后，最大的元素会\"冒泡\"到数组末尾\n5. 时间复杂度：\n   - 最好情况(已排序)：O(n)\n   - 最坏情况(逆序)：O(n²)\n   - 平均情况：O(n²)\n6. 空间复杂度：O(1)，是原地排序算法\n\n## 优化版本\n\n可以添加一个标志位来优化已经有序的情况：\n\n```go\nfunc optimizedBubbleSort(arr []int) {\n    n := len(arr)\n    for i := 0; i < n-1; i++ {\n        swapped := false\n        for j := 0; j < n-i-1; j++ {\n            if arr[j] > arr[j+1] {\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n                swapped = true\n            }\n        }\n        // 如果没有发生交换，说明数组已经有序\n        if !swapped {\n            break\n        }\n    }\n}\n```\n\n这个优化版本在最好情况下(数组已经有序)的时间复杂度可以降到O(n)。",
    type: "qa",
    createdAt: new Date(Date.now() - 7200000), // 2 hours ago
  },
]

// 辅助函数：获取AI聊天历史
export function getAIChats(userId: string): AIChat[] {
  return mockAIChats.filter((chat) => chat.userId === userId)
}