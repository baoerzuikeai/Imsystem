import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { User,LoginRequestDto,RegisterRequestDto,LoginResponse,RegisterResponse} from "@/types"; 

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
  },
};