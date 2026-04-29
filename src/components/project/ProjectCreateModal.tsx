"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { useGetModels } from "@/hooks/model/useGetModels";
import type { CreateProjectParams, LlmPlatform, LlmModelInfo } from "@/types";

interface Props {
  createdUserId: number;
  onClose: () => void;
  onCreate: (params: CreateProjectParams) => Promise<void>;
}

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-800 transition text-sm";

function PlatformToggle({
  value,
  onChange,
}: {
  value: LlmPlatform;
  onChange: (v: LlmPlatform) => void;
}) {
  return (
    <div className="flex p-1 bg-slate-100 rounded-xl gap-1">
      {(["OPENAI", "OLLAMA"] as LlmPlatform[]).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${
            value === p
              ? "bg-white shadow text-indigo-600"
              : "text-slate-500 hover:text-slate-700"
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
}: {
  models: LlmModelInfo[];
  selected: string;
  onSelect: (name: string) => void;
}) {
  if (models.length === 0)
    return <p className="text-xs text-slate-400">사용 가능한 모델이 없습니다.</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {models.map((m) => (
        <button
          key={m.name}
          type="button"
          onClick={() => onSelect(m.name)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            selected === m.name
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {m.name}
        </button>
      ))}
    </div>
  );
}

export default function ProjectCreateModal({ createdUserId, onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState<LlmPlatform>("OPENAI");
  const [embedModel, setEmbedModel] = useState("");
  const [dimensions, setDimensions] = useState<number>(0);
  const [dimLocked, setDimLocked] = useState(false);

  const { embedModels, loading } = useGetModels({ platform, type: "EMBED" });

  useEffect(() => {
    setEmbedModel("");
    setDimensions(0);
    setDimLocked(false);
  }, [platform]);

  useEffect(() => {
    if (!embedModel) { setDimensions(0); setDimLocked(false); return; }
    const info = embedModels.find((m) => m.name === embedModel);
    if (!info) return;
    if (!info.flexDimensions && info.dimensions) {
      setDimensions(info.dimensions);
      setDimLocked(true);
    } else if (info.flexDimensions && info.dimensions) {
      setDimensions(info.dimensions);
      setDimLocked(false);
    }
  }, [embedModel, embedModels]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { alert("프로젝트 이름을 입력하세요."); return; }
    if (!embedModel) { alert("임베딩 모델을 선택하세요."); return; }
    if (dimensions <= 0) { alert("차원값이 올바르지 않습니다."); return; }
    await onCreate({ name, createdUserId, dimensions });
  };

  return (
    <Modal onClose={onClose} width="max-w-lg">
      <h2 className="text-xl font-bold text-slate-800 mb-5">프로젝트 생성하기</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            프로젝트 이름
          </label>
          <input
            type="text"
            placeholder="프로젝트 이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            플랫폼
          </label>
          <PlatformToggle value={platform} onChange={setPlatform} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            임베딩 모델
            <span className="text-red-400 ml-0.5">*</span>
          </label>
          {loading ? (
            <p className="text-xs text-slate-400">불러오는 중...</p>
          ) : (
            <ModelPills models={embedModels} selected={embedModel} onSelect={setEmbedModel} />
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            차원 (Dimensions)
            {!dimLocked && embedModel && (
              <span className="ml-1 font-normal text-indigo-500 normal-case">
                · 1~{embedModels.find((m) => m.name === embedModel)?.dimensions} 사이 값
              </span>
            )}
          </label>
          <input
            type="number"
            value={dimensions || ""}
            onChange={(e) => !dimLocked && setDimensions(Number(e.target.value))}
            readOnly={dimLocked}
            placeholder={embedModel ? "" : "모델을 먼저 선택하세요"}
            className={`${inputCls} ${dimLocked ? "bg-slate-50 text-slate-400 cursor-not-allowed" : ""}`}
          />
          {dimLocked && (
            <p className="text-xs text-slate-400 mt-1">이 모델은 차원이 고정되어 있습니다.</p>
          )}
        </div>

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
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition"
          >
            생성하기
          </button>
        </div>
      </form>
    </Modal>
  );
}
