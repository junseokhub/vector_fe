"use client";

import { useState, useEffect, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import type { ProjectUpdateParams, ProjectUpdateResponse } from "@/types";
import { useUpdateProject } from "@/hooks/project/useCreateProject";

interface Props {
  project: ProjectUpdateResponse;
  onClose: () => void;
  onUpdate?: () => void;
  updatedUserId: number;
}

function getChangedFields<T extends object>(original: T, updated: T): Partial<T> {
  return (Object.keys(updated) as (keyof T)[]).reduce((acc, key) => {
    if (updated[key] !== original[key]) acc[key] = updated[key];
    return acc;
  }, {} as Partial<T>);
}

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-800 transition text-sm";

export default function ProjectUpdateModal({ project, onClose, onUpdate, updatedUserId }: Props) {
  const original = useMemo(() => ({
    key: project.key,
    name: project.name,
    openAiKey: project.openAiKey || "키없어요",
    prompt: project.prompt ?? "",
    embedModel: project.embedModel ?? "",
    chatModel: project.chatModel ?? "",
    dimensions: project.dimensions,
    updatedUserId: updatedUserId,
  }), [project, updatedUserId]);

  const [form, setForm] = useState(original);
  useEffect(() => setForm(original), [project, original]);

  const { handleUpdate, loading, error } = useUpdateProject();
  const set = (k: keyof ProjectUpdateParams) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [k]: k === "dimensions" ? Number(e.target.value) : e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const changed = { ...getChangedFields(original, form), updatedUserId };
    if (Object.keys(changed).length === 1) { alert("변경된 내용이 없습니다."); return; }
    await handleUpdate(project.key, changed);
    onUpdate?.();
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-bold text-slate-800 mb-5">프로젝트 수정</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {(["name", "openAiKey", "embedModel", "chatModel"] as const).map((field) => (
          <input key={field} type="text" placeholder={{ name: "프로젝트 이름", openAiKey: "OpenAI Key", embedModel: "Embed Model", chatModel: "Chat Model" }[field]}
            value={form[field] as string} onChange={set(field)} className={inputCls} />
        ))}
        <input type="number" placeholder="Dimensions" value={form.dimensions} onChange={set("dimensions")} className={inputCls} />
        <textarea placeholder="프롬프트" value={form.prompt} onChange={set("prompt")} className={`${inputCls} h-24 resize-none`} />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition">
            취소
          </button>
          <button type="submit" disabled={loading} className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 transition">
            {loading ? "수정 중..." : "수정하기"}
          </button>
        </div>
      </form>
    </Modal>
  );
}