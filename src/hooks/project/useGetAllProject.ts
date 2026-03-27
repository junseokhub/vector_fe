import { useState, useEffect } from "react";
import client from "@/api/client";
import { storage } from "@/lib/storage";
import type { Project } from "@/types";

export function useGetAllProject(userId: number) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const token = storage.get("accessToken");
      if (!token) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }
      try {
        const response = await client.get(`/api/invite/list/my?userId=${encodeURIComponent(userId)}`).json<Project[]>();
        setProjects(response);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "알 수 없는 오류";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [userId]);

  return { projects, setProjects, loading, error };
}