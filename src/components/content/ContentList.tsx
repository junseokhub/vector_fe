"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useRecoilValue } from "recoil";
import { authState } from "@/state/authAtom";
import { useGetContentInProject } from "@/hooks/content/useGetContentInProject";
import { useGetProject } from "@/hooks/project/useGetProject";
import ProjectUpdateModal from "../project/ProjectUpdateModal";
import ContentCreateModal from "@/components/content/ContentCreateModal";
import type { ContentDto } from "@/types";

const ChatModal = dynamic(() => import("@/components/chat/ChatModal"), { ssr: false });

export default function Conten({ projectKey }: { projectKey: string }) {
  const { id: userId } = useRecoilValue(authState);
  const { contents, loading: contentsLoading, error: contentsError } = useGetContentInProject(projectKey);
  const { project, loading: projectLoading, error: projectError } = useGetProject(projectKey);
  const router = useRouter();

  const [showUpdate, setShowUpdate] = useState(false);
  const [showCreateContent, setShowCreateContent] = useState(false);
  const [showChat, setShowChat] = useState(false);

  if (contentsLoading || projectLoading) return <Status text="로딩중..." />;
  if (contentsError) return <Status text={`오류: ${contentsError}`} isError />;
  if (projectError) return <Status text={`오류: ${projectError}`} isError />;
  if (!project) return <Status text="프로젝트를 찾을 수 없습니다." />;

  const canChat = !!project.openAiKey;

  return (
    <div className="py-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{project.name}</h1>
          <span className="text-xs font-mono text-slate-400 mt-1 block">Key: {project.key}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Btn onClick={() => setShowUpdate(true)} color="amber">프로젝트 수정하기</Btn>
          <Btn onClick={() => canChat && setShowCreateContent(true)} color="indigo" disabled={!canChat}>
            주제 생성
          </Btn>
          <Btn onClick={() => setShowChat(true)} color="emerald" disabled={!canChat}>채팅하기</Btn>
          <Btn onClick={() => router.back()} color="slate">목록으로</Btn>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-slate-700 mb-4">콘텐츠 목록</h2>
      {contents.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-4xl mb-3">📄</div>
          <p>콘텐츠가 없습니다.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {contents.map((c: ContentDto) => (
            <div
              key={c.id}
              onClick={() => router.push(`/content?key=${c.key}`)}
              className="group flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <div>
                <p className="font-semibold text-slate-800">{c.title}</p>
                <p className="text-xs text-slate-400 mt-1">{new Date(c.createdAt).toLocaleString()}</p>
              </div>
              <span className="text-slate-300 group-hover:text-indigo-400 transition-colors text-xl">→</span>
            </div>
          ))}
        </div>
      )}

      {showUpdate && (
        <ProjectUpdateModal
          project={{ key: project.key, name: project.name, openAiKey: project.openAiKey ? project.openAiKey : "키없어요",
            prompt: project.prompt ?? "", embedModel: project.embedModel ?? "",
            chatModel: project.chatModel ?? "", dimensions: project.dimensions, updatedUserId: userId }}
          updatedUserId={userId}
          onClose={() => setShowUpdate(false)}
        />
      )}
      {showCreateContent && <ContentCreateModal projectKey={projectKey} onClose={() => setShowCreateContent(false)} />}
      {showChat && <ChatModal projectKey={projectKey} userId={userId} onClose={() => setShowChat(false)} />}
    </div>
  );
}

function Status({ text, isError = false }: { text: string; isError?: boolean }) {
  return <div className={`text-center py-20 font-medium ${isError ? "text-red-500" : "text-slate-500"}`}>{text}</div>;
}

type BtnColor = "indigo" | "amber" | "emerald" | "slate";
const colorMap: Record<BtnColor, string> = {
  indigo: "bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50",
  amber: "bg-amber-400 hover:bg-amber-300 text-slate-800",
  emerald: "bg-emerald-600 hover:bg-emerald-500 text-white",
  slate: "bg-slate-200 hover:bg-slate-300 text-slate-700",
};

function Btn({ children, onClick, color, disabled }: { children: React.ReactNode; onClick: () => void; color: BtnColor; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed ${colorMap[color]}`}>
      {children}
    </button>
  );
}