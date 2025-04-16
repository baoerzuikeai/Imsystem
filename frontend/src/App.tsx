import LoginPage from './pages/Login';
import RegisterPage from './pages/Register'; // 导入 RegisterPage
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './router/PrivateRoute';
import ChatPage from './pages/Chat';
import Layout from './pages/layout';


function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} /> {/* 添加注册路由 */}
      <Route
        path="/chat"
        element={
          <PrivateRoute path="/chat">

              <ChatPage />

          </PrivateRoute>
        }
      />
      <Route path="/" element={<LoginPage />} />
    </Routes>
  );
}

export default App;