import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { User, LoginRequestDto, RegisterRequestDto, LoginResponse, 
  RegisterResponse,SearchedUser,CreatePrivateChatResponse,Message,Chat, 
  File,CreateGroupRequestDto,CreateGroupResponse } from "@/types";

// 后端 API 的基础 URL，从 Vite 环境变量中获取

// 定义AI聊天请求体类型 (根据你的示例)
interface AIChatRequest {
  history: Array<{ content: string; role: "system" | "user" | "assistant" }>;
  question: string;
}

// 定义AI聊天响应体类型 (根据你的示例)
interface AIChatResponse {
  answer: Array<{
    index: number;
    message: {
      role: "assistant";
      content: string;
    };
  }>;
  question: string; // 响应中也包含了问题
}

interface RawFriendData {
  id: string;
  username: string;
  email: string;
  avatar: string;
  status: {
    online: boolean;
    lastSeen: string;
  };
  profile: {
    nickname: string;
    bio: string;
  };
  createdAt: string;
  updatedAt: string;
}




// 后端 API 的基础 URL，从 Vite 环境变量中获取
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

// 创建一个 Axios 实例
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 如果你需要跨域发送 cookies (例如，如果使用基于 cookie 的 CSRF 保护)
});

// 请求拦截器: 在每个请求发送前，自动添加 Authorization header (如果 token 存在)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => { // 使用 InternalAxiosRequestConfig 类型
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token && config.headers) {
        // 从 localStorage 获取的是原始 token，在这里添加 "Bearer " 前缀
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    console.error("Request error in interceptor:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器: 处理全局响应错误
apiClient.interceptors.response.use(
  (response) => response, // 直接返回成功的响应
  (error: AxiosError<{ error?: string; message?: string }>) => {
    if (error.response) {
      // 服务器用错误状态码响应 (例如 4xx, 5xx)
      console.error("API Error Response:", error.response.data, "Status:", error.response.status);
      const errorMessage = error.response.data?.error || error.response.data?.message || `API error: ${error.response.status}`;
      if (error.response.status === 401) {
        // Token 无效或过期
        console.warn("Unauthorized (401). Token may be invalid or expired. Clearing token.");
        // 在这里可以触发全局登出逻辑
        // 例如：清除 token 并重定向到登录页
        if (typeof window !== "undefined") {
          localStorage.removeItem("authToken");
          // window.location.href = '/login'; // 或者使用 React Router 的 navigate
        }
      }
      return Promise.reject(new Error(errorMessage));
    } if (error.request) {
      // 请求已发出，但没有收到响应 (例如网络错误)
      console.error("Network Error or No Response:", error.request);
      return Promise.reject(new Error("Network error or server not responding."));
    }
    // 准备请求时发生错误
    console.error("Axios Request Setup Error:", error.message);
    return Promise.reject(new Error(error.message || "Error in request setup."));
  }
);

// API 服务对象
export const api = {
  // 认证相关API
  auth: {
    /**
     * 用户登录
     * @param credentials - 包含 email 和 password 的登录凭证
     * @returns 包含 token 和 user 信息的对象
     */
    login: async (credentials: LoginRequestDto): Promise<LoginResponse> => {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
      const { token, user } = response.data;

      // 保存原始 token 到 localStorage
      if (token && typeof window !== "undefined") {
        localStorage.setItem("authToken", token); // 只存储 token 本身
      }
      return { token, user };
    },

    /**
     * 用户注册
     * @param userData - 包含 username, email, password, nickname 的注册数据
     * @returns 包含消息和用户信息的对象
     */
    register: async (userData: RegisterRequestDto): Promise<RegisterResponse> => {
      const response = await apiClient.post<RegisterResponse>('/auth/register', userData);
      // 注册成功后后端不返回 token，所以这里不需要处理 token
      return response.data;
    },

    /**
     * 用户登出
     * 清除本地存储的 token。
     * 可选地尝试通知后端（如果后端有登出端点）。
     */
    logout: (): void => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
      }
      console.log("Logged out, token removed from localStorage.");
      // 可选：通知后端会话失效（如果后端支持 /auth/logout POST 端点）
      // apiClient.post('/auth/logout').catch(err => {
      //   console.warn("Attempt to call server logout endpoint failed (it might not exist or requires specific handling):", err);
      // });
    },

    /**
     * 获取当前已认证用户的详细信息
     * @returns 用户信息对象
     */
    getCurrentUser: async (): Promise<User> => {
      const response = await apiClient.get<User>('/auth/user');
      return response.data; // Axios 将响应数据放在 response.data 中
    },

    /**
     * 检查本地是否存储了认证 Token
     * @returns boolean - 如果 token 存在则为 true，否则为 false
     */
    isAuthenticated: (): boolean => {
      if (typeof window !== "undefined") {
        return !!localStorage.getItem("authToken");
      }
      return false;
    }
  },
  //添加用户相关api
  user: {
     /**
     * Searches for users based on a query string.
     * The endpoint is protected.GET("/user/search", authHandler.SearchUsers)
     * @param query - The search term.
     * @returns Promise<SearchedUser[]> - An array of user objects matching the search.
     */
     searchUsers: async (query: string): Promise<SearchedUser[]> => {
      try {
        // Assuming the backend expects the query as a URL parameter, e.g., /user/search?q=john
        const response = await apiClient.get<SearchedUser[]>(`/user/search?keyword=${encodeURIComponent(query)}`);
        // Add any necessary transformations here if the API response structure
        // for searched users differs significantly from the frontend User type.
        // For now, we assume it's compatible or SearchedUser is a subset/superset of User.
        return response.data.map(user => ({
            ...user,
        }));
      } catch (error) {
        console.error("API Error in searchUsers:", error);
        throw error;
      }
    },
  },
  chat: {
    /**
     * Fetches the list of friends (private chat contacts) for the current user.
     * Transforms the raw data from the API to match the frontend User interface.
     * @returns Promise<User[]> - An array of user objects.
     */
    getFriends: async (): Promise<User[]> => {
      try {
        const response = await apiClient.get<RawFriendData[]>('/chats/friends');
        const transformedFriends: User[] = response.data.map(rawFriend => ({
          id: rawFriend.id, // Map 'id' to '_id'
          username: rawFriend.username,
          email: rawFriend.email,
          avatar: rawFriend.avatar,
          status: {
            online: rawFriend.status.online,
            lastSeen: new Date(rawFriend.status.lastSeen), // Convert string to Date
          },
          profile: rawFriend.profile, // Assuming profile structure matches
          createdAt: new Date(rawFriend.createdAt), // Convert string to Date
          updatedAt: new Date(rawFriend.updatedAt), // Convert string to Date
        }));
        return transformedFriends;
      } catch (error) {
        console.error("API Error in getFriends:", error);
        throw error; // Re-throw to be caught by the caller
      }
    },
      /**
     * Creates a new private chat with a target user.
     * The endpoint is protected.POST("/chats/private", chatHandler.CreatePrivateChat)
     * The JSON payload is { "targetUserId": "USER_ID" }
     * @param targetUserId - The ID of the user to start a chat with.
     * @returns Promise<CreatePrivateChatResponse> - Response from the server.
     */
      createPrivateChat: async (targetUserId: string): Promise<CreatePrivateChatResponse> => {
        try {
          const response = await apiClient.post<CreatePrivateChatResponse>('/chats/private', { targetUserId });
          return response.data;
        } catch (error) {
          console.error("API Error in createPrivateChat:", error);
          throw error;
        }
      },
      /**
     * 获取聊天列表
     * @returns Promise<Chat[]> - 聊天列表
     */
    getChats: async (): Promise<Chat[]> => {
      const response = await apiClient.get<Chat[]>('/chats');
      return response.data;
    },

    /**
     * 获取指定聊天的消息
     * @param chatId - 聊天 ID
     * @returns Promise<Message[]> - 消息列表
     */
    getMessages: async (chatId: string): Promise<Message[]> => {
      const response = await apiClient.get<Message[]>(`/chats/${chatId}/messages`);
      return response.data;
    },
      

    /**
     * 更具chatId获取成员列表
     * @param chatId - 聊天 ID
     * @returns Promise<User[]> - 成员列表
     */
    getMembers: async (chatId: string): Promise<User[]> => {
      const response = await apiClient.get<User[]>(`/chats/${chatId}/members`);
      return response.data;
    },

    /**
     * Creates a new group chat.
     * The endpoint is POST /api/v1/chats/group
     * The JSON payload is { "title": "string", "memberIds": ["string"] }
     * @param groupData - Object containing title and memberIds.
     * @returns Promise<CreateGroupResponse> - Response from the server, likely the new chat object.
     */
    createGroupChat: async (groupData: CreateGroupRequestDto|null): Promise<CreateGroupResponse> => {
      try {
        const response = await apiClient.post<CreateGroupResponse>('/chats/group', groupData);
        return response.data;
      } catch (error) {
        console.error("API Error in createGroupChat:", error);
        throw error;
  
      }
      
    }
  },
  file: {
    /**
     * 获取指定文件的详细信息
     * @param fileId - 文件 ID
     * @returns Promise<FileType> - 文件信息对象
     */
    getFileById: async (fileId: string): Promise<File> => { // 返回 FileTypeFromTypes
      try {
        const response = await apiClient.get<File>(`/files/${fileId}`);

        const backendFile = response.data;
        // 转换成前端的 FileTypeFromTypes
        return backendFile
      } catch (error) {
        console.error(`API Error in getFileById for ID ${fileId}:`, error);
        throw error;
      }
    }
  },
  ai: {
    /**
     * 发送聊天消息到 AI 后端
     * @param payload - 包含历史记录和当前问题的对象
     * @returns AI 的回复内容
     */
    chat: async (payload: AIChatRequest): Promise<AIChatResponse> => {
      const response = await apiClient.post<AIChatResponse>('/ai/chat', payload);
      return response.data; // Axios 将响应数据放在 response.data 中
    },
    /**
     * 获取历史AI聊天记录 (如果后端支持此功能)
     * 假设返回 AIChat 类型的数组
     * 注意：你的示例请求中没有获取历史记录的端点，这里是假设可能需要
     */
    // getChatHistory: async (): Promise<AIChat[]> => {
    //   // 假设端点是 /ai/history 或类似的
    //   // const response = await apiClient.get<AIChat[]>('/ai/history');
    //   // return response.data;
    //   // 如果没有这个API，可以先返回一个空数组或移除此函数
    //   console.warn("getChatHistory is not implemented in the backend as per current info.");
    //   return [];
    // }
  }
}