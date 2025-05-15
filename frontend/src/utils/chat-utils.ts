import { Chat,User,Message } from "../types/index.ts";

export function getChatTitle(chat: Chat, currentUserId: string, contacts: User[]): string {
    if (chat.type === "group") {
      // 如果是群聊，返回群聊标题或默认值
      return chat.title || "Group Chat";
    } else {
      // 查找当前聊天中不是当前用户的成员 ID
      const otherMemberId = chat.members.find((member) => member.userId !== currentUserId)?.userId;
      if (!otherMemberId) return "Chat";
  
      // 在联系人列表中查找对应的用户信息
      const otherUserInfo = contacts.find((user) => user.id === otherMemberId);
      return otherUserInfo?.profile?.nickname || "Unknown User";
    }
  }

export function getChatAvatar(chat: Chat, currentUserId: string,contacts:User[]): string {
  if (chat.type === "group") {
    return chat.avatar || "/placeholder.svg";
  } else {
    const otherMemberId = chat.members.find((member) => member.userId !== currentUserId)?.userId;
    if (!otherMemberId) return "/placeholder.svg";

    const otherUser = contacts.find((user) => user.id === otherMemberId);
    return otherUser?.avatar || "/placeholder.svg";
  }
}

export function getUserOnlineStatus(userId: string,contacts:User[]): boolean {
  const user = contacts.find((u) => u.id === userId)
  return user?.status.online || false
}

export function getLastMessageForChat(chatId: string, messages: Message[]): Message | null {
  const chatMessages = messages.filter((message) => message.chatId === chatId);
  //只显示文本消息
  if  (chatMessages.length > 0) {
    const lastMessage = chatMessages[chatMessages.length - 1];
    if (lastMessage.type === "text") {
      return lastMessage|| null;
    }
  }
  // 如果没有文本消息，返回 null  
  return null;
}