"use client";
import { storage } from "@/utils/storage";
import { useState, useEffect } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

interface ChatRequest {
  text: string;
  projectKey: string;
  userId: number;
  sessionId?: string;
}

export const useChat = (projectKey: string, userId: number) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedSessionId = storage.get("sessionId");
    if (savedSessionId) {
      setSessionId(savedSessionId);
    }
  }, []);

  const sendMessage = async (text: string) => {
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);

    const token = storage.get("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    const body: ChatRequest = {
      text,
      projectKey,
      userId,
    };

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      setMessages((prev) => [...prev, { role: "assistant", text: data.output }]);
      
      if (data.sessionId) {
        setSessionId(data.sessionId);
        storage.set("sessionId", data.sessionId);
      }
    } catch (err) {
      console.error(err);
      alert("에러에러")
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading };
};
