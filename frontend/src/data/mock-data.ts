"use client"

import type { User, Chat, Message, File, ChatState, } from "@/types"

// 创建当前用户
export const currentUser: User = {
  id: "user-current",
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
    id: "user-1",
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
    id: "user-2",
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
    id: "user-3",
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
    id: "user-4",
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
    id: "user-5",
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
    id: "user-6",
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
    id: "user-7",
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
    id: "user-8",
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
    id: "user-9",
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
    id: "chat-1",
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
    id: "chat-2",
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
    id: "chat-3",
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
    id: "chat-4",
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
    id: "chat-5",
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
    id: "msg-1-1",
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
    id: "msg-1-2",
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
    id: "msg-1-3",
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
    id: "msg-1-4",
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
    id: "msg-1-5",
    chatId: "chat-1",
    senderId: "user-current",
    type: "text",
    content: {
      text: "**Chats**\n```json\n{\n  id: ObjectId,\n  type: String,           // 'private' 或 'group'\n  title: String,          // 群聊名称（私聊为null）\n  avatar: String,         // 群聊头像（私聊为null）\n  members: [{\n    userId: ObjectId,     // 成员ID\n    role: String,         // 'owner', 'member'\n    joinedAt: Date\n  }],\n  lastMessageAt: Date,    // 最后消息时间\n  createdBy: ObjectId,    // 创建者ID\n  createdAt: Date\n}\n```",
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
    id: "msg-1-6",
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
    id: "msg-2-1",
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
    id: "msg-2-2",
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
    id: "msg-2-3",
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
    id: "msg-3-1",
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
    id: "msg-3-2",
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
    id: "msg-4-1",
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
    id: "msg-4-2",
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
    id: "msg-4-3",
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
    id: "msg-4-4",
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
    id: "msg-5-1",
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
    id: "msg-5-2",
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
    id: "msg-5-3",
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
    id: "msg-5-4",
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
    id: "file-1",
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
    id: "chatstate-1",
    userId: "user-current",
    chatId: "chat-1",
    unreadCount: 0,
    lastReadMessageId: "msg-1-6",
    updatedAt: new Date(Date.now() - 200000),
  },
  {
    id: "chatstate-2",
    userId: "user-current",
    chatId: "chat-2",
    unreadCount: 0,
    lastReadMessageId: "msg-2-3",
    updatedAt: new Date(Date.now() - 79100000),
  },
  {
    id: "chatstate-3",
    userId: "user-current",
    chatId: "chat-3",
    unreadCount: 0,
    lastReadMessageId: "msg-3-2",
    updatedAt: new Date(Date.now() - 169100000),
  },
  {
    id: "chatstate-4",
    userId: "user-current",
    chatId: "chat-4",
    unreadCount: 0,
    lastReadMessageId: "msg-4-4",
    updatedAt: new Date(Date.now() - 161900000),
  },
  {
    id: "chatstate-5",
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
    ...globalMessages.filter((msg: Message) => !mockMessages.some((staticMsg) => staticMsg.id === msg.id)),
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
  const chat = mockChats.find((c) => c.id === chatId)
  if (!chat) return []

  return chat.members
    .map((member) => {
      if (member.userId === "user-current") {
        return currentUser
      }
      return mockUsers.find((user) => user.id === member.userId)
    })
    .filter((user): user is User => user !== undefined)
}


