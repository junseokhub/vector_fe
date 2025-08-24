import { useState, useEffect } from "react"
import client from "@/api/client"
import { Project } from "@/hooks/project/interface"
import { storage } from "@/utils/storage"

export const useGetAllProject = (userId: number) => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);

    const token = storage.get("accessToken");
    if (!token) {
      setError("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    try {
      const data = await client.post("/api/invite/list", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      }).then(res => res.json()) as Project[];

      setProjects(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  fetchProjects();
}, [userId]);


  return { projects, setProjects, loading, error }
}
