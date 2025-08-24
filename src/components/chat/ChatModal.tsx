"use client";

import { useChat } from "@/hooks/chat/useChat";
import ChatBox from "./ChatBox";

interface Props {
  projectKey: string;
  userId: number;
  onClose: () => void;
}

export default function ChatModal({ projectKey, userId, onClose }: Props) {
  const { messages, sendMessage, loading } = useChat(projectKey, userId);

  return (
    <div
      style={{
        position: "fixed",
        right: "20px",
        bottom: "20px",
        width: "400px",
        height: "500px",
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "10px",
          borderBottom: "1px solid #ccc",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <strong>AI 채팅</strong>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
          ❌
        </button>
      </div>
      <ChatBox messages={messages} onSend={sendMessage} loading={loading} />
    </div>
  );
}
