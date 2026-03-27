import client from "@/api/client";
import { storage } from "@/lib/storage";
import type { Project, CreateProjectParams } from "@/types";

export function useCreateProject(
  createdUserId: number,
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
) {
const handleSubmit = async (params: CreateProjectParams) => {
  if (!params.name.trim()) {
    alert("프로젝트 이름을 입력하세요.");
    return;
  }
  if (params.dimensions <= 0) {
    alert("dimensions는 0보다 큰 숫자여야 합니다.");
    return;
  }

  try {
    const token = storage.get("accessToken");

    const newProject = await client
      .post("/api/project/create", {
        json: { ...params, createdUserId },
        headers: { Authorization: `Bearer ${token}` },
      })
      .json<Project>();
    setProjects((prev) => [...prev, newProject]);

    const contentParam = {
      title: "[Default] Welcome",
      answer: "반갑습니다",
      projectKey: newProject.key,
    };

    const contentRes = await fetch("/api/content/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        userId: String(createdUserId),
      },
      body: JSON.stringify(contentParam),
    });

    if (!contentRes.ok) {
      alert("기본 콘텐츠 생성 실패");
      console.error(await contentRes.text());
    }

  } catch (err) {
    console.error(err);
    alert("프로젝트 생성 중 오류 발생");
  }
};

  return { handleSubmit };
}