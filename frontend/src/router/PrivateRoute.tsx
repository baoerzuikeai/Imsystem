import {Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
  path: string;
}

function PrivateRoute({ children}: PrivateRouteProps) {
  const token = localStorage.getItem('token'); // 从 localStorage 获取 token

  if (!token) {
    // 如果没有 token，重定向到登录页面
    return <Navigate to="/login" replace />;
  }

  // 如果有 token，渲染子组件
  return children;
}

export default PrivateRoute;