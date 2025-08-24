import { useEffect, useState } from "react";
import { ContentDetail } from "./interface";
import { storage } from "@/utils/storage";

export function useGetContentDetail(contentKey: string) {
  const [contentDetail, setContentDetail] = useState<ContentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = storage.get("accessToken");
    setToken(accessToken);
  }, []);

  useEffect(() => {
    if (!contentKey) return;
    if (!token) {
      setError("로그인이 필요합니다.");
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/content/detail/${contentKey}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("데이터 로딩 실패");
        return res.json();
      })
      .then((data) => {
        setContentDetail(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setContentDetail(null);
      })
      .finally(() => setLoading(false));
  }, [contentKey, token]);

  return { contentDetail, loading, error };
}
