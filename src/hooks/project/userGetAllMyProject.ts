import { useState, useEffect } from "react";
import client from "@/api/client";
import { storage } from "@/lib/storage";
import type { Project } from "@/types";

export function useGetAllMyProject(userId: number) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = storage.get("accessToken");
    if (!token) { setError("로그인이 필요합니다."); setLoading(false); return; }

    client
      .get(`/api/invite/list/my?userId=${userId}`)
      .json<Project[]>()
      .then(setProjects)
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, [userId]);

  return { projects, setProjects, loading, error };
}