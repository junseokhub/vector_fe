import client from "@/api/client";
import type { Project, CreateProjectParams } from "@/types";
import { useState } from "react";
import toast from "react-hot-toast";

export function useCreateProject(
  createdUserId: number,
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (params: CreateProjectParams) => {
    if (!params.name.trim()) {
      alert("프로젝트 이름을 입력하세요.");
      return;
    }

    if (params.dimensions <= 0) {
      alert("dimensions는 0보다 큰 숫자여야 합니다.");
      return;
    }

    let newProject: Project;
    try {
      newProject = await client
        .post("/api/project/create", { json: { ...params, createdUserId } })
        .json<Project>();
    } catch (e) {
      toast.error("프로젝트 생성 실패");
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
      return;
    }

    try {
      await client.post("/api/content/create", {
        json: {
          title: "[Default] Welcome Intent",
          answer: "안녕하세요.저는 JS챗봇 입니다.",
          projectId: newProject.id,
          projectKey: newProject.key,
          createdUserId,
        },
        headers: { userId: createdUserId.toString() },
      }).json();
    } catch (e) {
      toast.error("콘텐츠 생성 실패");
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
      return;
    }

    setProjects((prev) => [...prev, newProject]);
  };

  return { handleSubmit, error };
}