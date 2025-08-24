import client from "@/api/client"
import { Project }  from "@/hooks/project/interface";
import { CreateProjectParams } from  "@/hooks/project/CreateProject/interface"

export const useCreateProject = (
  createdUserId: number,
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
) => {
  const createProject = async (params: CreateProjectParams) => {
    const newProject = await client
      .post("/api/project/create", {
        json: params,
      })
      .json<Project>()

    setProjects((prev) => [...prev, newProject])
  }

  const handleSubmit = async (params: CreateProjectParams) => {
    if (!params.name.trim()) {
      alert("프로젝트 이름을 입력하세요.")
      return
    }
    if (params.dimensions <= 0) {
      alert("dimensions는 0보다 큰 숫자여야 합니다.")
      return
    }

    await createProject({ ...params, createdUserId })
  }

  return { handleSubmit }
}

