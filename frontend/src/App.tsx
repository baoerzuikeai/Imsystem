import LoginPage from './pages/Login';
import ChatPage from './pages/Chat';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './router/PrivateRoute'; // 导入 PrivateRoute 组件

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<LoginPage />} />
      {/* 使用 PrivateRoute 组件包裹 ChatPage 路由 */}
      <Route
        path="/chat"
        element={
          <PrivateRoute path="/chat">
            <ChatPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
