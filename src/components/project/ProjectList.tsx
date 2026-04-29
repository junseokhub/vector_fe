"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import { authState } from "@/state/authAtom";
import { useGetAllProject } from "@/hooks/project/useGetAllProject";
import { useCreateProject } from "@/hooks/project/useCreateProject";
import ProjectCreateModal from "./ProjectCreateModal";
import type { Project } from "@/types";

const platformBadgeMap = {
  OPENAI: "bg-emerald-100 text-emerald-700",
  OLLAMA: "bg-violet-100 text-violet-700",
} as const;

export default function ProjectList() {
  const { id: userId } = useRecoilValue(authState);
  if (userId === null) return null;
  return <ProjectListInner userId={userId} />;
}

function ProjectListInner({ userId }: { userId: number }) {
  const { projects, setProjects, loading, error } = useGetAllProject(userId);
  const { handleSubmit } = useCreateProject(userId, setProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  if (loading) return <StatusCard text="프로젝트 로딩 중..." />;
  if (error) return <StatusCard text={`오류: ${error}`} isError />;

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex ml-auto items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-200 active:scale-[0.98]"
        >
          <span className="text-lg">+</span> 새 프로젝트
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <div className="text-5xl mb-4">📂</div>
          <p className="font-medium">아직 프로젝트가 없어요!</p>
          <p className="text-sm mt-1">새로운 프로젝트를 만들어보세요.</p>
        </div>
      ) : (
        <div className="grid gap-3 max-w-7xl mx-auto px-4">
          {projects.map((p: Project) => (
            <div
              key={p.id}
              onClick={() => router.push(`/project/detail?key=${encodeURIComponent(p.key)}`)}
              className={`group flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                p.mine
                  ? "bg-indigo-50 border-indigo-200 hover:border-indigo-300"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-slate-800 text-lg">{p.name}</h3>
                  {p.mine && <span className="text-yellow-500">⭐️</span>}
                  {p.llmPlatform && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${platformBadgeMap[p.llmPlatform]}`}>
                      {p.llmPlatform === "OPENAI" ? "OpenAI" : "Ollama"}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-400 mt-0.5">
                  생성일: {new Date(p.createdAt).toLocaleDateString()}
                  {p.embedModel && (
                    <span className="ml-2 text-xs text-slate-300">· {p.embedModel}</span>
                  )}
                </p>
              </div>
              <span className="text-slate-300 group-hover:text-slate-500 transition-colors text-xl">→</span>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <ProjectCreateModal
          createdUserId={userId}
          onClose={() => setIsModalOpen(false)}
          onCreate={async (params) => {
            await handleSubmit(params);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

function StatusCard({ text, isError = false }: { text: string; isError?: boolean }) {
  return (
    <div className={`text-center py-20 text-lg font-medium ${isError ? "text-red-500" : "text-slate-500"}`}>
      {text}
    </div>
  );
}
