"use client";

import { ProjectUpdateParams, ProjectUpdateResponse } from "@/hooks/project/UpdateProject/interface";
import { useUpdateProject } from "@/hooks/project/UpdateProject/useUpdateProject";
import { useState, useEffect } from "react";

interface Props {
  project: ProjectUpdateResponse;
  onClose: () => void;
  onUpdate?: () => void;
  updatedUserId: number;
}

function getChangedFields<T extends { [K in keyof T]: T[K] }>(original: T, updated: T): Partial<T> {
  const changed = {} as Partial<T>;
  for (const key in updated) {
    if (updated[key] !== original[key]) {
      changed[key] = updated[key];
    }
  }
  return changed;
}
export const ProjectUpdateModal = ({ project, onClose, onUpdate, updatedUserId }: Props) => {
  const originalData: ProjectUpdateParams = {
    name: project.name || "",
    openAiKey: project.openAiKey || "",
    prompt: project.prompt || "",
    embedModel: project.embedModel || "",
    chatModel: project.chatModel || "",
    dimensions: project.dimensions || 3072,
    updatedUserId: updatedUserId,
  };

  const [form, setForm] = useState<ProjectUpdateParams>(originalData);

  useEffect(() => {
    setForm(originalData);
  }, [project]);

  const { handleUpdate, loading, error } = useUpdateProject();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const changedFields = getChangedFields(originalData, form);
    changedFields.updatedUserId = updatedUserId;

    if (Object.keys(changedFields).length === 1 && changedFields.updatedUserId !== undefined) {
      alert("변경된 내용이 없습니다.");
      return;
    }

    await handleUpdate(project.key, changedFields);
    if (onUpdate) onUpdate();
    onClose();
  };

  const inputStyle = { width: "100%", padding: "8px 10px", borderRadius: 4, border: "1px solid #ccc", fontSize: 16, outline: "none" };

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 30,
          borderRadius: 10,
          width: 400,
          display: "flex",
          flexDirection: "column",
          gap: 20,
          color: "#000",
        }}
      >
        <h2 style={{ marginBottom: 20 }}>프로젝트 수정</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input
            type="text"
            placeholder="프로젝트 이름"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="OpenAI Key"
            value={form.openAiKey}
            onChange={(e) => setForm({ ...form, openAiKey: e.target.value })}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Embed Model"
            value={form.embedModel}
            onChange={(e) => setForm({ ...form, embedModel: e.target.value })}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Chat Model"
            value={form.chatModel}
            onChange={(e) => setForm({ ...form, chatModel: e.target.value })}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Dimensions"
            value={form.dimensions}
            onChange={(e) => setForm({ ...form, dimensions: Number(e.target.value) })}
            style={inputStyle}
          />
          <textarea
            placeholder="프롬프트"
            value={form.prompt}
            onChange={(e) => setForm({ ...form, prompt: e.target.value })}
            style={{ ...inputStyle, height: 100 }}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                border: "none",
                backgroundColor: "#0070f3",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              disabled={loading}
            >
              {loading ? "수정 중..." : "수정하기"}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                border: "none",
                backgroundColor: "#ccc",
                color: "#000",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
