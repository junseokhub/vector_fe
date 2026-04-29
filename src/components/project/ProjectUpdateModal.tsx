"use client";

import { useState, useEffect, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import { useGetModels } from "@/hooks/model/useGetModels";
import { useUpdateProject } from "@/hooks/project/useCreateProject";
import type { LlmPlatform, LlmModelInfo, ProjectUpdateParams, ProjectUpdateResponse } from "@/types";

interface Props {
  project: ProjectUpdateResponse;
  onClose: () => void;
  onUpdate?: () => void;
  updatedUserId: number;
}

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-800 transition text-sm";

const labelCls = "block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5";

function PlatformToggle({ value, onChange }: { value: LlmPlatform; onChange: (v: LlmPlatform) => void }) {
  return (
    <div className="flex p-1 bg-slate-100 rounded-xl gap-1">
      {(["OPENAI", "OLLAMA"] as LlmPlatform[]).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${
            value === p ? "bg-white shadow text-indigo-600" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {p === "OPENAI" ? "OpenAI" : "Ollama"}
        </button>
      ))}
    </div>
  );
}

function ModelPills({
  models,
  selected,
  onSelect,
  optional,
}: {
  models: LlmModelInfo[];
  selected: string;
  onSelect: (name: string) => void;
  optional?: boolean;
}) {
  if (models.length === 0)
    return <p className="text-xs text-slate-400">사용 가능한 모델이 없습니다.</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {optional && selected && (
        <button
          type="button"
          onClick={() => onSelect("")}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-200 text-slate-500 hover:bg-slate-300 transition-all"
        >
          ✕ 해제
        </button>
      )}
      {models.map((m) => (
        <button
          key={m.name}
          type="button"
          onClick={() => onSelect(selected === m.name && optional ? "" : m.name)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            selected === m.name
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {m.name}
          {m.dimensions && (
            <span className={`ml-1 text-[10px] ${selected === m.name ? "text-indigo-200" : "text-slate-400"}`}>
              {m.flexDimensions ? `~${m.dimensions}d` : `${m.dimensions}d`}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function getChangedFields<T extends object>(original: T, updated: T): Partial<T> {
  return (Object.keys(updated) as (keyof T)[]).reduce((acc, key) => {
    if (updated[key] !== original[key]) acc[key] = updated[key];
    return acc;
  }, {} as Partial<T>);
}

export default function ProjectUpdateModal({ project, onClose, onUpdate, updatedUserId }: Props) {
  // Dimensions are locked once the Milvus collection is created; model can still change if compatible
  const dimLocked = (project.dimensions ?? 0) > 0;

  const original = useMemo<ProjectUpdateParams & { key: string }>(() => ({
    key: project.key,
    name: project.name ?? "",
    apiKey: project.apiKey ?? "",
    prompt: project.prompt ?? "",
    embedModel: project.embedModel ?? "",
    chatModel: project.chatModel ?? "",
    dimensions: project.dimensions,
    llmPlatform: project.llmPlatform ?? "OPENAI",
    updatedUserId,
  }), [project, updatedUserId]);

  const [form, setForm] = useState(original);
  // modelDimLocked: true when selected model has fixed dimensions (not flex)
  const [modelDimLocked, setModelDimLocked] = useState(false);

  useEffect(() => setForm(original), [original]);

  const { chatModels, embedModels, loading } = useGetModels({ platform: form.llmPlatform });

  const { handleUpdate, loading: saving, error } = useUpdateProject();

  // Filter embed models to only those compatible with the project's existing dimensions
  const compatibleEmbedModels = useMemo(() => {
    if (!dimLocked || !project.dimensions) return embedModels;
    return embedModels.filter((m) => {
      if (m.flexDimensions && m.dimensions) {
        return project.dimensions >= 1 && project.dimensions <= m.dimensions;
      }
      return m.dimensions === project.dimensions;
    });
  }, [embedModels, dimLocked, project.dimensions]);

  // Platform change resets chat model; if dims not locked, also reset embed model
  const handlePlatformChange = (p: LlmPlatform) => {
    if (dimLocked) {
      setForm((prev) => ({ ...prev, llmPlatform: p, chatModel: "" }));
    } else {
      setForm((prev) => ({ ...prev, llmPlatform: p, embedModel: "", chatModel: "", dimensions: 0 }));
      setModelDimLocked(false);
    }
  };

  // Auto-fill dimensions when embed model changes (only when dims not already locked)
  const handleEmbedModelChange = (name: string) => {
    if (dimLocked) {
      // Dims are locked — only update the model name, keep dimensions unchanged
      setForm((prev) => ({ ...prev, embedModel: name }));
      return;
    }
    const info = embedModels.find((m) => m.name === name);
    if (info) {
      if (!info.flexDimensions && info.dimensions) {
        setForm((prev) => ({ ...prev, embedModel: name, dimensions: info.dimensions! }));
        setModelDimLocked(true);
      } else {
        setForm((prev) => ({ ...prev, embedModel: name, dimensions: info.dimensions ?? prev.dimensions }));
        setModelDimLocked(false);
      }
    } else {
      setForm((prev) => ({ ...prev, embedModel: name }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const changed = { ...getChangedFields(original, form), updatedUserId };
    if (Object.keys(changed).length === 1) { alert("변경된 내용이 없습니다."); return; }
    await handleUpdate(project.key, changed);
    onUpdate?.();
    onClose();
  };

  return (
    <Modal onClose={onClose} width="max-w-lg">
      <h2 className="text-xl font-bold text-slate-800 mb-5">프로젝트 수정</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">

        <div>
          <label className={labelCls}>프로젝트 이름</label>
          <input
            type="text"
            placeholder="프로젝트 이름"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>플랫폼</label>
          <PlatformToggle value={form.llmPlatform} onChange={handlePlatformChange} />
        </div>

        {form.llmPlatform === "OPENAI" && (
          <div>
            <label className={labelCls}>API Key</label>
            <input
              type="password"
              placeholder="sk-..."
              value={form.apiKey}
              onChange={(e) => setForm((p) => ({ ...p, apiKey: e.target.value }))}
              className={inputCls}
            />
          </div>
        )}

        <div>
          <label className={labelCls}>
            임베딩 모델
            {dimLocked && (
              <span className="ml-1 font-normal text-slate-400 normal-case">
                (차원 {project.dimensions}에 호환되는 모델만 표시)
              </span>
            )}
          </label>
          {loading ? (
            <p className="text-xs text-slate-400">불러오는 중...</p>
          ) : (
            <ModelPills models={compatibleEmbedModels} selected={form.embedModel} onSelect={handleEmbedModelChange} />
          )}
        </div>

        <div>
          <label className={labelCls}>
            차원 (Dimensions)
            {!dimLocked && !modelDimLocked && form.embedModel && (
              <span className="ml-1 font-normal text-indigo-500 normal-case">
                · 1~{embedModels.find((m) => m.name === form.embedModel)?.dimensions} 사이 값
              </span>
            )}
          </label>
          <input
            type="number"
            value={form.dimensions || ""}
            onChange={(e) => !modelDimLocked && !dimLocked && setForm((p) => ({ ...p, dimensions: Number(e.target.value) }))}
            readOnly={modelDimLocked || dimLocked}
            placeholder={form.embedModel ? "" : "모델을 먼저 선택하세요"}
            className={`${inputCls} ${(modelDimLocked || dimLocked) ? "bg-slate-50 text-slate-400 cursor-not-allowed" : ""}`}
          />
          {dimLocked && (
            <p className="text-xs text-slate-400 mt-1">차원은 Milvus 컬렉션 생성 시 고정됩니다.</p>
          )}
          {!dimLocked && modelDimLocked && (
            <p className="text-xs text-slate-400 mt-1">이 모델은 차원이 고정되어 있습니다.</p>
          )}
        </div>

        <div>
          <label className={labelCls}>
            채팅 모델
            <span className="ml-1 font-normal text-slate-400 normal-case">(선택 · 없으면 벡터 검색 결과만 반환)</span>
          </label>
          {loading ? (
            <p className="text-xs text-slate-400">불러오는 중...</p>
          ) : (
            <ModelPills models={chatModels} selected={form.chatModel} onSelect={(n) => setForm((p) => ({ ...p, chatModel: n }))} optional />
          )}
        </div>

        <div>
          <label className={labelCls}>프롬프트</label>
          <textarea
            placeholder="챗봇 시스템 프롬프트 (선택)"
            value={form.prompt}
            onChange={(e) => setForm((p) => ({ ...p, prompt: e.target.value }))}
            className={`${inputCls} h-24 resize-none`}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 transition"
          >
            {saving ? "수정 중..." : "수정하기"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
