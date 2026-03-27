import { useState, useEffect } from "react";
import type { ContentDto } from "@/types";
import client from "@/api/client";

export function useGetContentInProject(projectKey: string) {
  const [contents, setContents] = useState<ContentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectKey) return;

    const fetchContents = async () => {
      try {
        const data = await client
          .get(`/api/content/list?projectKey=${encodeURIComponent(projectKey)}`)
          .json<ContentDto[]>();
        setContents(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "알 수 없는 오류 발생");
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, [projectKey]);

  return { contents, setContents, loading, error };
}