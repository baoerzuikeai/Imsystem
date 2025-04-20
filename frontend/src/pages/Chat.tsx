import { ChatLayout } from "@/components/chat-layout";
import { useEffect, useRef } from "react";

export default function ChatPage() {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      const wsUrl = "ws://192.168.31.186:8080/api/v1/ws";
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("WebSocket client connected");
        socket.send(`{"type": "chat","chatId": "67cd58d4c84c0000ea003de5","content": "这是一个聊天消息"}`);
      };

      socket.onmessage = (event) => {
        console.log("Received:", event.data);
      };

      socket.onclose = () => {
        console.log("Connection closed");
      };

      socket.onerror = (error) => {
        console.log("WebSocket Error:", error);
      };

      return () => {
        socket.close();
        socketRef.current = null;
      };
    }
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <ChatLayout />
    </div>
  );
}