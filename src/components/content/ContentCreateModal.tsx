"use client";

import { useCreateContent } from "@/hooks/content/CreateContent/useCreateContent";
import { authState } from "@/state/authAtom";
import { useState } from "react";
import { useRecoilValue } from "recoil";

interface Props {
  projectKey: string;
  onClose: () => void;
  onCreate?: () => void;
}

export const ContentCreateModal = ({ projectKey, onClose, onCreate }: Props) => {
  const auth = useRecoilValue(authState);
  const userId = auth.id ?? 0
  
  const [title, setTitle] = useState("");
  const [answer, setAnswer] = useState("");
  const { handleCreate, loading, error } = useCreateContent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleCreate({ userId, title, answer, projectKey });
    if (onCreate) onCreate();
    onClose();
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#fff",
        padding: 30,
        borderRadius: 10,
        width: 400,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        color: "#000"
      }}>
        <h2 style={{ marginBottom: 20 }}>주제 생성</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input
            type="text"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "8px 10px", borderRadius: 4, border: "1px solid #ccc", fontSize: 16, outline: "none" }}
          />
          <textarea
            placeholder="답변"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            style={{ width: "100%", padding: "8px 10px", borderRadius: 4, border: "1px solid #ccc", fontSize: 16, outline: "none", height: 100 }}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button type="submit" style={{ padding: "8px 16px", borderRadius: 6, border: "none", backgroundColor: "#0070f3", color: "#fff", fontWeight: "bold", cursor: "pointer" }} disabled={loading}>
              {loading ? "생성 중..." : "생성하기"}
            </button>
            <button type="button" onClick={onClose} style={{ padding: "8px 16px", borderRadius: 6, border: "none", backgroundColor: "#ccc", color: "#000", fontWeight: "bold", cursor: "pointer" }}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};