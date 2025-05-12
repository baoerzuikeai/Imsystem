// src/context/api-provider.tsx
import React, { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { api as backendApiService } from '@/services/api'; // 重命名导入的 api 服务，避免与组件内的 api 变量混淆
import type { User, LoginRequestDto,UserInfo} from '@/types';
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate 用于路由跳转
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
  // initializeAuth is internal to the provider for now
}

export type AuthContextType = AuthState & AuthOperations;
// --- End of Auth-specific types ---


// --- Main API Context Type (将来可以聚合其他 context types) ---
// 目前，ApiContextType 就等同于 AuthContextType
// 将来: interface ApiContextType { auth: AuthContextType; chat?: ChatContextType; ... }
export interface ApiContextType extends AuthContextType {}
// --- End of Main API Context Type ---


// 创建 Context
const ApiContext = createContext<ApiContextType | undefined>(undefined);

// ApiProvider 组件
interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  // --- Auth State and Logic (将来可以来自 AuthProvider 的 useReducer 或 useState) ---
  const [userInfo, setUser] = useState<UserInfo | null>(null);
  const [currentUserDetail, setCurrentUserDetails] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const navigate = useNavigate();

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
          setUser(null);
        }
      } catch (error) {
        console.error("ApiProvider: Failed to initialize auth:", error);
        setIsAuthenticated(false);
        setUser(null);
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
      setUser(loginResponse.user);
      setIsAuthenticated(true);
      console.log('ApiProvider: User logged in:', loginResponse.user.username);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    try {
      backendApiService.auth.logout();
      setUser(null);
      setCurrentUserDetails(null)
      setIsAuthenticated(false);
      console.log('ApiProvider: User logged out');
      navigate('/login'); // 登出后跳转到登录页面
    } catch (error) {
      console.error("ApiProvider: Logout failed:", error);
    }
  };
  // --- End of Auth State and Logic ---


  // --- Chat State and Logic (示例占位，将来实现) ---
  // const [messages, setMessages] = useState([]);
  // const fetchMessages = async (chatId) => { /* ... */ };
  // --- End of Chat State and Logic ---

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
    // Chat part (example)
    // messages,
    // fetchMessages,
  }), [userInfo, currentUserDetail,isAuthenticated, isLoadingAuth/*, messages */]); // 依赖项也需要更新

  return (
    <ApiContext.Provider value={contextValue}>
      {children}
    </ApiContext.Provider>
  );
};

// 导出 Context 本身，供 use-api.tsx 使用
export { ApiContext };