"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ContentCreateParams } from "./interface";
import { storage } from "@/utils/storage";

interface CreateContentPayload extends ContentCreateParams {
  userId: number;
}

export function useCreateContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCreate = async (payload: CreateContentPayload) => {
  setLoading(true);
  setError(null);

  const { userId, ...params } = payload;

  const token = storage.get("accessToken");
  if (!token) {
    setLoading(false);
    setError("로그인이 필요합니다.");
    return null;
  }

  try {
    const res = await fetch(`/api/content/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "userId": userId.toString(),
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!res.ok) throw new Error(`서버 오류: ${res.status}`);

    const data = await res.json();

    router.refresh();

    return data;
  } catch (e) {
    if (e instanceof Error) {
      setError(e.message);
    } else {
      setError("알 수 없는 오류가 발생했습니다.");
    }
    return null;
  } finally {
    setLoading(false);
  }
};
  return { handleCreate, loading, error };
}
