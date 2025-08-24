"use client";
import { useEffect, useState } from "react";
import { ProjectContentsResponseDto } from "./interface";
import { storage } from "@/utils/storage";

export function useGetContentInProject(projectKey: string) {
  const [projectContents, setProjectContents] = useState<ProjectContentsResponseDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectKey) return;

    setLoading(true);
    setError(null);

    const token = storage.get("accessToken")
    if (!token) throw new Error("로그인이 필요합니다.")


    fetch(`/api/project/contents/${encodeURIComponent(projectKey)}`, {
        headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("프로젝트 상세 정보를 불러오지 못했습니다.");
        return res.json();
      })
      .then((data: ProjectContentsResponseDto) => {
        setProjectContents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "알 수 없는 오류가 발생했습니다.");
        setLoading(false);
      });
  }, [projectKey]);

  return { projectContents, loading, error };
}