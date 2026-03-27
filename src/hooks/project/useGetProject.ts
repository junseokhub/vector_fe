import { useState, useEffect } from "react";
import type { Project } from "@/types";
import client from "@/api/client";

export function useGetProject(projectKey: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectKey) return;

    const fetchProject = async () => {
      try {
        const data = await client
          .get(`/api/project/search?key=${encodeURIComponent(projectKey)}`)
          .json<Project>();
        setProject(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "알 수 없는 오류 발생");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectKey]);

  return { project, setProject, loading, error };
}