import { useState } from 'react';
import { useRouter } from 'next/router';
import client from '@/api/client';
import type { Project, CreateProjectParams, ProjectUpdateParams } from '@/types';
import toast from 'react-hot-toast';

export function useUpdateProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleUpdate = async (key: string, params: Partial<ProjectUpdateParams>) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await client.post(`/api/project/update/${key}`, params);
      toast.success('업데이트 성공');
      router.reload();
      return data;
    } catch (e: unknown) {
      toast.error('업데이트 실패');
      setError(e instanceof Error ? e.message : '업데이트 실패');
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdate, loading, error };
}

export function useCreateProject(
  createdUserId: number,
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (params: CreateProjectParams) => {
    if (!params.name.trim()) {
      alert('프로젝트 이름을 입력하세요.');
      return;
    }
    if (params.dimensions <= 0) {
      alert('dimensions는 0보다 큰 숫자여야 합니다.');
      return;
    }

    let newProject: Project;
    try {
      const { data } = await client.post<Project>('/api/project/create', {
        ...params,
        createdUserId,
      });
      newProject = data;
    } catch (e: unknown) {
      toast.error('프로젝트 생성 실패');
      setError(e instanceof Error ? e.message : '알 수 없는 오류');
      return;
    }

    // Create default welcome content — requires apiKey + embedModel to be configured first.
    // This will silently skip if the project isn't fully configured yet.
    try {
      await client.post(
        '/api/content/create',
        {
          title: '[Default] Welcome Intent',
          answer: '안녕하세요. 무엇을 도와드릴까요?',
          projectKey: newProject.key,
        },
        { headers: { userId: createdUserId.toString() } }
      );
    } catch {
      // Expected to fail if embed model / API key not yet configured — not an error
    }

    setProjects((prev) => [...prev, newProject]);
    toast.success('프로젝트가 생성되었습니다.');
  };

  return { handleSubmit, error };
}
