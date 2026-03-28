import { useState, useEffect } from "react";
import client from "@/api/client";
import type { ContentDto } from "@/types";
import toast from "react-hot-toast";
 
export function useGetContentDetail(contentKey: string) {
  const [contentDetail, setContentDetail] = useState<ContentDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    if (!contentKey) return;
    
    const fecthContentDetail = async () => {
      setLoading(true);
      try {
        const data = await client
          .get(`/api/content/detail/${contentKey}`)
          .json<ContentDto>();

        setContentDetail(data);
        setError(null);
      } catch (e) {
        toast.error("불러오기 실패");
        setError(e instanceof Error ? e.message : "알 수 없는 오류 발생");
        setContentDetail(null);
      } finally {
        setLoading(false);
      }
    };
  fecthContentDetail();
      
}, [contentKey]);
  return { contentDetail, loading, error };
}