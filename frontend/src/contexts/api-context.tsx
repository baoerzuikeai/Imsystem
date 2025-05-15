// src/context/api-provider.tsx
import React, { createContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { api as backendApiService } from '@/services/api'; // 重命名导入的 api 服务，避免与组件内的 api 变量混淆
import type { User, LoginRequestDto,UserInfo,SearchedUser,CreatePrivateChatResponse,Chat,Message} from '@/types';
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate 用于路由跳转
// Removed incorrect import of Map from 'lucide-react' as it conflicts with JavaScript's native Map.
// --- Auth-specific types (将来可以拆分到 auth-context.ts) ---
interface AuthState {
  userInfo: UserInfo | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean; // 明确这是认证加载状态
  currentUserDetail: User | null; // 当前用户的详细信息
}

interface AuthOperations {
  login: (credentials: LoginRequestDto) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => void; // 获取当前用户信息
  // initializeAuth is internal to the provider for now
}

// Chat Part
interface ChatState {
  contacts: User[];
  isLoadingContacts: boolean;
  contactsError: string | null;

  // For User Search (Add Contact feature)
  searchedUsers: SearchedUser[];
  isSearchingUsers: boolean;
  searchUsersError: string | null;

  // For Creating Private Chat (Adding a contact)
  isCreatingChat: boolean;
  createChatError: string | null;
  lastCreatedChatInfo: CreatePrivateChatResponse | null; 

  chats: Chat[];
  isLoadingChats: boolean;
  chatsError: string | null;

  messages: Message[];
  isLoadingMessages: boolean;
  messagesError: string | null;
  globalmessages: Map<string,Message[]>; // 新增全局消息状态
}
interface ChatOperations {
  fetchContacts: () => Promise<void>;
  performUserSearch: (query: string) => Promise<SearchedUser[] | undefined>; // Make it async and return results
  createPrivateChatAndUpdateContacts: (targetUserId: string) => Promise<CreatePrivateChatResponse | undefined>; // Renamed for clarity
  fetchChats: () => Promise<void>;
  fetchMessages: (chatId: string) => Promise<void>;
  fetchMembers: (chatId: string) => Promise<User[]|null>; 
  addMessageToGlobalCache: (chatId: string, message: Message) => void; // 添加单条消息
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>; // Expose setChats
}

export type AuthContextType = AuthState & AuthOperations;
// --- End of Auth-specific types ---
export type ChatContextType = ChatState & ChatOperations;

// --- Main API Context Type (将来可以聚合其他 context types) ---
// 目前，ApiContextType 就等同于 AuthContextType
// 将来: interface ApiContextType { auth: AuthContextType; chat?: ChatContextType; ... }
export interface ApiContextType extends AuthContextType, ChatContextType {}
// --- End of Main API Context Type ---


// 创建 Context
const ApiContext = createContext<ApiContextType | undefined>(undefined);

// ApiProvider 组件
interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  // --- Auth State and Logic (将来可以来自 AuthProvider 的 useReducer 或 useState) ---
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [currentUserDetail, setCurrentUserDetails] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const navigate = useNavigate();

  // Chat State
  const [contacts, setContacts] = useState<User[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState<boolean>(false);
  const [contactsError, setContactsError] = useState<string | null>(null);

  // User Search State
  const [searchedUsers, setSearchedUsers] = useState<SearchedUser[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState<boolean>(false);
  const [searchUsersError, setSearchUsersError] = useState<string | null>(null);

  // Create Chat State
  const [isCreatingChat, setIsCreatingChat] = useState<boolean>(false);
  const [lastCreatedChatInfo, setLastCreatedChatInfo] = useState<CreatePrivateChatResponse | null>(null);
  const [createChatError, setCreateChatError] = useState<string | null>(null);

  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [chatsError, setChatsError] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  const [globalmessages, setGlobalMessages] = useState<Map<string, Message[]>>(new Map<string, Message[]>()); // 新增全局消息状态

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoadingAuth(true);
      try {
        const tokenExists = backendApiService.auth.isAuthenticated();
        if (tokenExists) {
          const UserDetail = await backendApiService.auth.getCurrentUser();
          setCurrentUserDetails(UserDetail);
          setIsAuthenticated(true);
          console.log('ApiProvider: Auth initialized, user loaded:', UserDetail.username);
        } else {
          setIsAuthenticated(false);
          setUserInfo(null);
          setCurrentUserDetails(null);
        }
      } catch (error) {
        console.error("ApiProvider: Failed to initialize auth:", error);
        setIsAuthenticated(false);
        setUserInfo(null);
        setCurrentUserDetails(null);
        backendApiService.auth.logout(); // Clear invalid token
      } finally {
        setIsLoadingAuth(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequestDto) => {
    try {
      const loginResponse = await backendApiService.auth.login(credentials);
      setUserInfo(loginResponse.user);
      setIsAuthenticated(true);
      // After login, fetch full user details
      const userDetailData = await backendApiService.auth.getCurrentUser();
      setCurrentUserDetails(userDetailData);
      setIsAuthenticated(true);
      console.log('ApiProvider: User logged in:', loginResponse.user.username);
    } catch (error) {
      setUserInfo(null);
      setCurrentUserDetails(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    try {
      backendApiService.auth.logout();
      setUserInfo(null);
      setCurrentUserDetails(null);
      setIsAuthenticated(false);
      setContacts([]);
      setSearchedUsers([]);
      setContactsError(null);
      setSearchUsersError(null);
      setCreateChatError(null);
      console.log('ApiProvider: User logged out');
      navigate('/login');
    } catch (error) {
      console.error("ApiProvider: Logout failed:", error);
      // Still attempt to clear local state
      setUserInfo(null);
      setCurrentUserDetails(null);
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  const getCurrentUser = async () => {
    try {
      const userDetail = await backendApiService.auth.getCurrentUser();
      setCurrentUserDetails(userDetail);
      return userDetail;
    }
    catch (error) {
      console.error("ApiProvider: Failed to fetch current user:", error);
    }
  }
  // --- End of Auth State and Logic ---


  // --- Chat State and Logic (示例占位，将来实现) ---
  // Chat Operations
  const fetchContacts = useCallback(async () => {
    if (!isAuthenticated) {
      console.log("User not authenticated. Skipping contact fetch.");
      setContacts([]); // Ensure contacts are cleared if not authenticated
      return;
    }
    setIsLoadingContacts(true);
    setContactsError(null);
    try {
      const friendsData = await backendApiService.chat.getFriends(); // Returns User[]
      setContacts(friendsData);
    } catch (err) {
      console.error("ApiProvider: Failed to fetch contacts:", err);
      setContactsError(err instanceof Error ? err.message : "Failed to load contacts.");
      setContacts([]);
    } finally {
      setIsLoadingContacts(false);
    }
  }, [isAuthenticated]); // Dependency on isAuthenticated

  // Fetch contacts when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchContacts();
    }
  }, [isAuthenticated, fetchContacts]);
  // --- End of Chat State and Logic ---

   // New: Perform User Search
   const performUserSearch = useCallback(async (query: string): Promise<SearchedUser[] | undefined> => {
    if (!isAuthenticated) {
      setSearchedUsers([]);
      setSearchUsersError("User not authenticated.");
      return undefined;
    }
    if (!query.trim()) {
        setSearchedUsers([]); // Clear results if query is empty
        return [];
    }
    setIsSearchingUsers(true);
    setSearchUsersError(null);
    try {
      const results = await backendApiService.user.searchUsers(query);
      setSearchedUsers(results);
      return results;
    } catch (err) {
      console.error("ApiProvider: Failed to search users:", err);
      setSearchUsersError(err instanceof Error ? err.message : "Failed to search users.");
      setSearchedUsers([]);
      return undefined;
    } finally {
      setIsSearchingUsers(false);
    }
  }, [isAuthenticated]);

  // New: Create Private Chat (and potentially update contacts list)
  const createPrivateChatAndUpdateContacts = useCallback(async (targetUserId: string): Promise<CreatePrivateChatResponse | undefined> => {
    if (!isAuthenticated) {
      setCreateChatError("User not authenticated.");
      return undefined;
    }
    setIsCreatingChat(true);
    setCreateChatError(null);
    setLastCreatedChatInfo(null);
    try {
      const chatResponse = await backendApiService.chat.createPrivateChat(targetUserId);
      setLastCreatedChatInfo(chatResponse);
      console.log("ApiProvider: Private chat created successfully", chatResponse);
      await fetchContacts(); // Refresh the contacts list to include the new friend.

      return chatResponse;
    } catch (err) {
      console.error("ApiProvider: Failed to create private chat:", err);
      setCreateChatError(err instanceof Error ? err.message : "Failed to add contact.");
      return undefined;
    } finally {
      setIsCreatingChat(false);
    }
  }, [isAuthenticated, fetchContacts]);

  const fetchChats = useCallback(async () => {
    setIsLoadingChats(true);
    setChatsError(null);
    try {
      const chatList = await backendApiService.chat.getChats();
      setChats(chatList);
    } catch (err) {
      console.error("ApiProvider: Failed to fetch chats:", err);
      setChatsError(err instanceof Error ? err.message : "Failed to load chats.");
    } finally {
      setIsLoadingChats(false);
    }
  }, []);

  const fetchMessages = useCallback(async (chatId: string) => {
    setIsLoadingMessages(true);
    setMessagesError(null);
    try {
      const messageList = await backendApiService.chat.getMessages(chatId);
      setGlobalMessages(prevGlobalMessages => {
        const newGlobalMessages = new Map(prevGlobalMessages); // 创建一个新的 Map 实例以避免直接修改旧状态
        newGlobalMessages.set(chatId, messageList); // 将获取到的消息列表存入 Map，以 chatId 为键
        return newGlobalMessages;
      });
      setMessages(messageList);
    } catch (err) {
      console.error("ApiProvider: Failed to fetch messages:", err);
      setMessagesError(err instanceof Error ? err.message : "Failed to load messages.");
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  const fetchMembers = useCallback(async (chatId: string) => {
    try {
      const members = await backendApiService.chat.getMembers(chatId);
      return members;
      console.log("Fetched members:", members);
    }
    catch (err) {
      console.error("ApiProvider: Failed to fetch members:", err);
      return null;
    }
  }, []);

  const addMessageToGlobalCache = useCallback((chatId: string, message: Message) => {
    setGlobalMessages(prevMap => {
      const newMap = new Map(prevMap);
      const existingMessages = newMap.get(chatId) || [];
      const messageExists = existingMessages.some(msg => msg.id === message.id);

      if (messageExists) {
        // Update existing message (e.g., status from sending to sent)
        newMap.set(chatId, existingMessages.map(msg => msg.id === message.id ? { ...msg, ...message } : msg).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
      } else {
        // Add new message
        newMap.set(chatId, [...existingMessages, message].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
      }
      return newMap;
    });
  }, []);
  // 组合 Context value
  // 目前只包含 auth 部分，未来可以扩展
  const contextValue = useMemo(() => ({
    // Auth part
    userInfo,
    currentUserDetail,
    isAuthenticated,
    isLoadingAuth,
    login,
    logout,
    getCurrentUser,
    // Chat part (example)
    contacts,
    isLoadingContacts,
    contactsError,
    searchedUsers,
    isSearchingUsers,
    searchUsersError,
    isCreatingChat,
    createChatError,
    lastCreatedChatInfo,
    fetchContacts,
    performUserSearch,
    createPrivateChatAndUpdateContacts,
    chats,
    isLoadingChats,
    chatsError,
    messages,
    isLoadingMessages,
    messagesError,
    fetchChats,
    fetchMessages,
    fetchMembers,
    globalmessages,
    addMessageToGlobalCache,
    setChats
  }), [userInfo, currentUserDetail,isAuthenticated, isLoadingAuth,login, 
    logout,contacts,isLoadingContacts,contactsError, searchedUsers,
    isSearchingUsers,
    searchUsersError,
    isCreatingChat,
    createChatError,
    lastCreatedChatInfo,fetchContacts,performUserSearch,
    createPrivateChatAndUpdateContacts,
    chats,
    isLoadingChats,
    chatsError,
    messages,
    isLoadingMessages,
    messagesError,
    fetchChats,
    fetchMessages,
    fetchMembers,
    globalmessages,
    addMessageToGlobalCache,
    setChats,
  ]); // 依赖项也需要更新

  return (
    <ApiContext.Provider value={contextValue}>
      {children}
    </ApiContext.Provider>
  );
};

// 导出 Context 本身，供 use-api.tsx 使用
export { ApiContext };