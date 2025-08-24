// @/components/project/ProjectDetailContents.tsx
"use client";

import { useGetContentInProject } from "@/hooks/project/ProjectContentList/useGetContetInProject";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProjectUpdateModal } from "./ProjectUpdateModal";
import { ContentCreateModal } from "../content/ContentCreateModal";
import { useRecoilValue } from "recoil";
import { authState } from "@/state/authAtom";
import dynamic from "next/dynamic";

const ChatModal = dynamic(() => import("@/components/chat/ChatModal"), { ssr: false });

interface Props {
  projectKey: string;
}

export default function ProjectDetailContents({ projectKey }: Props) {
  const auth = useRecoilValue(authState);
  const userId = auth.id ?? 0;

  const router = useRouter();
  const { projectContents, loading, error } = useGetContentInProject(projectKey);

  const [showProjectUpdate, setShowProjectUpdate] = useState(false);
  const [showContentCreate, setShowContentCreate] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  const isGenerateTopicDisabled = !projectContents || !projectContents.openAiKey;

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease, opacity 0.3s ease',
    marginLeft: '10px',
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
    opacity: 0.6,
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em', color: '#666', backgroundColor: '#f8f8f8' }}>로딩중...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em', color: 'red', backgroundColor: '#fef2f2' }}>오류: {error}</div>;
  if (!projectContents) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em', color: '#777', backgroundColor: '#f8f8f8' }}>프로젝트를 찾을 수 없습니다.</div>;

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '800px',
        margin: '40px auto',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '20px',
          borderBottom: '1px solid #eee',
          marginBottom: '20px',
        }}
      >
        <h1 style={{ fontSize: '28px', color: '#2c3e50', margin: 0 }}>
          {projectContents.name} <span style={{ fontSize: '18px', color: '#777' }}> (Key: {projectContents.key})</span>
        </h1>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={() => setShowProjectUpdate(true)}
            style={{ ...buttonStyle, backgroundColor: '#ffc107', color: '#333' }}
          >
            프로젝트 수정하기
          </button>

          <button
            onClick={() => { if (!isGenerateTopicDisabled) setShowContentCreate(true); }}
            disabled={isGenerateTopicDisabled}
            style={isGenerateTopicDisabled ? disabledButtonStyle : buttonStyle}
          >
            주제 생성
          </button>

          <button
            onClick={() => setShowChatModal(true)} // 🔹 채팅 모달 열기
            style={{ ...buttonStyle, backgroundColor: '#28a745' }}
          >
            채팅하기
          </button>

          <button
            onClick={() => router.back()}
            style={{ ...buttonStyle, backgroundColor: '#6c757d' }}
          >
            목록으로
          </button>
        </div>
      </header>

      <h3 style={{ fontSize: '24px', color: '#2c3e50', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        콘텐츠 목록
      </h3>

      {projectContents.contents.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#777', padding: '30px 0' }}>콘텐츠가 없습니다.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {projectContents.contents.map((content) => (
            <li
              key={content.id}
              onClick={() => router.push(`/content?key=${content.key}`)}
              style={{
                border: '1px solid #ddd',
                padding: '18px',
                borderRadius: '10px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
                marginBottom: '15px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <h4 style={{ fontSize: '20px', color: '#34495e', margin: '0 0 10px 0' }}>
                주제: {content.title}
              </h4>
              <div style={{ fontSize: '13px', color: '#777', marginTop: '15px', borderTop: '1px dotted #eee', paddingTop: '10px' }}>
                <span>생성일: {new Date(content.createdAt).toLocaleString()}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showProjectUpdate && (
        <ProjectUpdateModal
          project={{
            key: projectContents.key,
            name: projectContents.name,
            openAiKey: projectContents.openAiKey,
            prompt: projectContents.prompt,
            embedModel: projectContents.embedModel,
            chatModel: projectContents.chatModel,
            dimensions: projectContents.dimensions,
            updatedUserId: userId,
          }}
          onClose={() => setShowProjectUpdate(false)}
          updatedUserId={userId}
        />
      )}

      {showContentCreate && (
        <ContentCreateModal
          projectKey={projectKey}
          onClose={() => setShowContentCreate(false)}
        />
      )}

      {showChatModal && (
        <ChatModal
          projectKey={projectKey}
          userId={userId}
          onClose={() => setShowChatModal(false)}
        />
      )}
    </div>
  );
}
