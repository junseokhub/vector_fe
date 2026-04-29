import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import client from '@/api/client';
import type { ChatMessage } from '@/types';

export function useChat(projectKey: string, userId: number) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    const key = `chat_session_${projectKey}_${userId}`;
    const saved = sessionStorage.getItem(key) ?? uuidv4();
    sessionStorage.setItem(key, saved);
    setSessionId(saved);
  }, [projectKey, userId]);

  const sendMessage = async (text: string) => {
    if (!sessionId) return;
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setLoading(true);

    try {
      const { data } = await client.post<{ output: string }>('/api/chat', {
        text,
        projectKey,
        sessionId,
      });
      setMessages((prev) => [...prev, { role: 'assistant', text: data.output }]);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error);
      }
      alert('에러 발생');
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading };
}