import { useState } from "react";
import { useRouter } from "next/router";
import client from "@/api/client";
import { ProjectUpdateParams } from "@/types";
import toast from "react-hot-toast";
 
export function useUpdateProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
 
  const handleUpdate = async (key: string, params: Partial<ProjectUpdateParams>) => {
    setLoading(true); setError(null);
 
    try {
      const data = await client.post(`/api/project/update/${key}`, {
        json: params,
      }).json();
      toast.success("업데이트 성공");
      router.reload();
      return data;
    } catch (e) {
      toast.error("업데이트 실패")
      setError(e instanceof Error ? e.message : "업데이트 실패");
    } finally { setLoading(false); }
  };
  return { handleUpdate, loading, error };
}
 