"use client";

import { useState } from "react";
import { useRecoilValue } from "recoil";
import Modal from "@/components/ui/Modal";
import { useCreateContent } from "@/hooks/content/useCreateContent";
import { authState } from "@/state/authAtom";

interface Props { projectKey: string; onClose: () => void; onCreate?: () => void }

export default function ContentCreateModal(props: Props) {
  const auth = useRecoilValue(authState);
  
  if (!auth || auth.id === null) return null;

  return <ContentCreateModalInner {...props} userId={auth.id} />;
}

function ContentCreateModalInner({ projectKey, onClose, onCreate, userId }: Props & { userId: number }) {
  const [title, setTitle] = useState("");
  const [answer, setAnswer] = useState("");
  const { handleCreate, loading, error } = useCreateContent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleCreate({ userId, title, answer, projectKey });
    onCreate?.();
    onClose();
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-800 transition text-sm";

  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-bold text-slate-800 mb-5">주제 생성</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input 
          type="text" 
          placeholder="제목" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          className={inputCls} 
        />
        <textarea 
          placeholder="답변" 
          value={answer} 
          onChange={(e) => setAnswer(e.target.value)} 
          className={`${inputCls} h-28 resize-none`} 
        />
        
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
            disabled={loading} 
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 transition"
          >
            {loading ? "생성 중..." : "생성하기"}
          </button>
        </div>
      </form>
    </Modal>
  );
}