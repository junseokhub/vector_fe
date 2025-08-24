// @/hooks/project/UseGetProjectDetails/useGetProjectDetails.ts
import { useState, useEffect } from "react";
import client from "@/api/client";
import { ProjectContentsResponseDto } from "./interface";

export const useGetProjectDetails = (projectKey: string) => {
  const [projectDetails, setProjectDetails] = useState<ProjectContentsResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectKey) {
      setError("유효한 프로젝트 키가 제공되지 않았습니다.");
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await client.get(`/api/contents?key=${projectKey}`).json<ProjectContentsResponseDto>();
        setProjectDetails(data);
      } catch (e) {
        setError("프로젝트 상세 정보를 불러오는데 실패했습니다.");
        console.error("Failed to fetch project details:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [projectKey]);

  return { projectDetails, loading, error };
};