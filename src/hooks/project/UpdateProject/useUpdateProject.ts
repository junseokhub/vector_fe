"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectUpdateParams } from "./interface";
import { storage } from "@/utils/storage";

export function useUpdateProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleUpdate = async (key: string, params: Partial<ProjectUpdateParams>) => {
    setLoading(true);
    setError(null);

    const token = storage.get("accessToken");
    if (!token) {
      setLoading(false);
      setError("로그인이 필요합니다.");
      return null;
    }

    try {
      const res = await fetch(`/api/project/update/${key}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        throw new Error(`서버 오류: ${res.status}`);
      }

      const data = await res.json();

      // 업데이트 성공 후 새로고침
      router.refresh();

      return data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "업데이트 실패");
      } else {
        setError("업데이트 실패");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };
  return { handleUpdate, loading, error };
}
