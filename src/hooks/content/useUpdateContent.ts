import { useState } from "react";
import { useRouter } from "next/navigation";
import client from "@/api/client";
import type { ContentUpdateParams } from "@/types";
import toast from "react-hot-toast";
 
export function useUpdateContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
 
  const handleUpdate = async (contentId: number, params: ContentUpdateParams) => {
    setLoading(true); setError(null);
 
    try {
      await client.post("/api/content/update", {
        json: params,
        headers: { contentId: contentId.toString() },
      }).json();
      toast.success("수정 성공");
      router.back();
    } catch (e) {
      toast.error("수정 실패");
      setError(e instanceof Error ? e.message : "업데이트 실패");
    } finally { setLoading(false); }
  };
 
  return { handleUpdate, loading, error };
}