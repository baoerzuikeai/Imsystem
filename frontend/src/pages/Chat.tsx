import { ChatLayout } from "@/components/chat-layout";
import { api, apiClient } from "@/services/api";

export default function ChatPage() {

  const url = api.file.getFileById("6825f48becac65a35984b38b")
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <ChatLayout />
    </div>
  );
}