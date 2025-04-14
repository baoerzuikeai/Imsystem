# 项目目录结构

## server/
服务器端代码

### cmd/
应用程序入口
- `main.go`: 应用程序入口文件

### config/
配置文件
- `config.go`: 配置文件

### internal/
内部实现逻辑
- **domain/**: 领域模型
  - `user.go`: 用户领域模型
  - `message.go`: 消息领域模型
  - `chat.go`: 聊天领域模型
  - `file.go`: 文件领域模型

- **repository/**: 数据访问层
  - **mongodb/**: MongoDB实现
  - **interfaces/**: 仓储接口

- **service/**: 业务逻辑层
  - `auth.go`: 认证服务
  - `chat.go`: 聊天服务
  - `file.go`: 文件服务
  - `ai.go`: AI服务

- **delivery/**: 外部接口层
  - **http/**: HTTP处理器
  - **websocket/**: WebSocket处理器

- **middleware/**: 中间件
  - `auth.go`: JWT中间件

### pkg/
工具包
- **logger/**: 日志包
- **utils/**: 工具函数
- **errors/**: 错误处理

### go.mod & go.sum
Go模块管理文件

---

## client/
前端React应用
- `...`: 其他前端相关文件


Domain
---
**Users** 
```json
{
  _id: ObjectId,
  username: String,         // 用户名
  email: String,           // 邮箱
  password: String,        // 加密后的密码
  avatar: String,          // 头像URL
  status: {
    online: Boolean,       // 在线状态
    lastSeen: Date        // 最后在线时间
  },
  profile: {
    nickname: String,      // 昵称
    bio: String           // 个人简介
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Chats
```json
{
  _id: ObjectId,
  type: String,           // 'private' 或 'group'
  title: String,          // 群聊名称（私聊为null）
  avatar: String,         // 群聊头像（私聊为null）
  members: [{
    userId: ObjectId,     // 成员ID
    role: String,         // 'owner', 'member'
    joinedAt: Date
  }],
  lastMessageAt: Date,    // 最后消息时间
  createdBy: ObjectId,    // 创建者ID
  createdAt: Date
}
```
**Messages**
```json 
{
  _id: ObjectId,
  chatId: ObjectId,       // 关联的聊天ID
  senderId: ObjectId,     // 发送者ID
  type: String,           // 'text', 'code', 'file'
  content: {
    text: String,         // 文本内容
    code: {               // 代码内容（如果是代码消息）
      language: String,   // 编程语言
      content: String     // 代码内容
    },
    file: {              // 文件信息（如果是文件消息）
      fileId: ObjectId,  // 关联的文件ID
      fileName: String   // 文件名
    }
  },
  replyTo: ObjectId,      // 回复的消息ID（可选）
  readBy: [{              // 已读用户
    userId: ObjectId,
    readAt: Date
  }],
  createdAt: Date
}
```

**Files**
```json
{
  _id: ObjectId,
  name: String,           // 文件名
  type: String,           // 文件类型 MIME
  size: Number,          // 文件大小
  url: String,           // 存储URL
  uploaderId: ObjectId,   // 上传者ID
  chatId: ObjectId,       // 关联的聊天ID
  downloads: Number,      // 下载次数
  createdAt: Date
}
```

AIChats
```json
{
  _id: ObjectId,
  userId: ObjectId,       // 用户ID
  question: String,       // 用户问题
  answer: String,         // AI回答
  type: String,          // 'code_review', 'qa', 'optimization'
  createdAt: Date
}
```
**ChatStates**  
```json
{
  _id: ObjectId,
  userId: ObjectId,       // 用户ID
  chatId: ObjectId,       // 聊天ID
  unreadCount: Number,    // 未读消息数
  lastReadMessageId: ObjectId, // 最后读取的消息ID
  updatedAt: Date
}
```