import LoginPage from './pages/Login'
import ChatPage from './pages/Chat' // Import the Chat page
import { Routes, Route } from 'react-router-dom' // Import necessary components

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/chat" element={<ChatPage />} /> {/* Add the chat route */}
      {/* You can add a default route, or redirect to login */}
      <Route path="/" element={<LoginPage />} />
    </Routes>
  )
}

export default App
