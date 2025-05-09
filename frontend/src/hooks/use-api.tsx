// src/hooks/use-api.tsx
import { useContext } from 'react';
// 确保路径正确，指向你创建 ApiContext 的文件
import { ApiContext, type ApiContextType as ActualApiContextType } from '@/contexts/api-context';

// 重新导出 Context 的类型，方便在组件中进行类型提示和使用
// 如果 ApiContextType 将来包含嵌套结构如 { auth: AuthContextType, chat: ChatContextType }
// 那么这里可能需要导出更细化的类型，或者让组件直接使用 ActualApiContextType 并解构。
export type ApiContextType = ActualApiContextType;

/**
 * 自定义 Hook，用于访问 ApiContext。
 * 必须在 ApiProvider 组件内部使用。
 * @returns ApiContextType - 包含认证状态 (user, isAuthenticated, isLoadingAuth) 和操作 (login, logout)。
 */
export const useApi = (): ApiContextType => {
  const context = useContext(ApiContext);

  // 如果 Hook 在 ApiProvider 外部使用，则抛出错误
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider. Make sure your component is a child of <ApiProvider />.');
  }

  return context;
};