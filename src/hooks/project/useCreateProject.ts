import client from "@/api/client";
import type { Project, CreateProjectParams } from "@/types";

export function useCreateProject(
  createdUserId: number,
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
) {
  const handleSubmit = async (params: CreateProjectParams) => {
    if (!params.name.trim()) { alert("프로젝트 이름을 입력하세요."); return; }
    if (params.dimensions <= 0) { alert("dimensions는 0보다 큰 숫자여야 합니다."); return; }

    const newProject = await client
      .post("/api/project/create", { json: { ...params, createdUserId } })
      .json<Project>();
    setProjects((prev) => [...prev, newProject]);
  };

  return { handleSubmit };
}