"use client";

import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { authState } from "@/state/authAtom";
import { useGetContentDetail } from "@/hooks/content/useGetContentDetail";
import { useUpdateContent } from "@/hooks/content/useUpdateContent";

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-800 transition text-sm";

export default function ContentDetail({ contentKey }: { contentKey: string }) {
  const { id: userId } = useRecoilValue(authState);
  const { contentDetail: content, loading, error } = useGetContentDetail(contentKey);
  const { handleUpdate, loading: saving, error: saveError } = useUpdateContent();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (content) { setTitle(content.title); setAnswer(content.answer); setIsEditing(false); }
  }, [content]);

  if (!userId) return <Centered text="로그인이 필요합니다." />;
  if (loading) return <Centered text="로딩중..." />;
  if (error) return <Centered text={`에러: ${error}`} isError />;
  if (!content) return <Centered text="데이터 없음" />;

  const isDirty = title !== content.title || answer !== content.answer;

  const handleSave = async () => {
    if (!isDirty) { alert("변경된 내용이 없습니다."); return; }
    await handleUpdate(content.id, { title, answer, updatedUserId: userId });
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
          {isEditing ? (
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={`${inputCls} text-lg font-bold`} />
          ) : (
            <h1 className="text-xl font-bold text-slate-800 flex-1">{content.title}</h1>
          )}
          <div className="flex gap-2 shrink-0">
            {isEditing ? (
              <>
                <button onClick={handleSave} disabled={saving}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 transition">
                  {saving ? "수정 중..." : "저장"}
                </button>
                <button onClick={() => { setTitle(content.title); setAnswer(content.answer); setIsEditing(false); }}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition">
                  취소
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition">
                수정
              </button>
            )}
          </div>
        </div>

        <div className="mb-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Key</span>
          <p className="font-mono text-sm text-slate-600 mt-1 bg-slate-50 px-3 py-2 rounded-lg">{content.key}</p>
        </div>

        <div className="mb-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">답변</span>
          {isEditing ? (
            <textarea value={answer} onChange={(e) => setAnswer(e.target.value)}
              className={`${inputCls} mt-1 h-40 resize-none`} />
          ) : (
            <p className="mt-1 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{content.answer}</p>
          )}
        </div>

        {saveError && <p className="text-red-500 text-sm mt-2">{saveError}</p>}

        <div className="text-xs text-slate-400 border-t border-slate-100 pt-4 mt-4">
          생성일: {new Date(content.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

function Centered({ text, isError = false }: { text: string; isError?: boolean }) {
  return <div className={`text-center py-20 font-medium ${isError ? "text-red-500" : "text-slate-500"}`}>{text}</div>;
}