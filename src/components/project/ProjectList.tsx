"use client";

import { useState } from "react"
import { useGetAllProject } from "@/hooks/project/GetAllProject/useGetAllProject"
import { useCreateProject } from "@/hooks/project/CreateProject/useCreateProject"
import { ProjectCreateModal } from "@/components/project/ProjectCreateModal"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { authState } from "@/state/authAtom"
import { Project } from "@/hooks/project/interface"
import { useRouter } from "next/navigation"
import { projectKeyState } from "@/state/projectKeyAtom"

export default function ProjectList() {
  const auth = useRecoilValue(authState)
  const userId = auth.id ?? 0

  const { projects, setProjects, loading, error } = useGetAllProject(userId)
  const { handleSubmit } = useCreateProject(userId, setProjects)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const setSelectedProjectKey = useSetRecoilState(projectKeyState)
  const router = useRouter();

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em', color: '#666', backgroundColor: '#f8f8f8' }}>프로젝트 로딩 중...</div>
  if (error) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em', color: 'red', backgroundColor: '#fef2f2' }}>오류 발생: {error}</div>

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
          borderBottom: '1px solid #eee',
          marginBottom: '20px',
        }}
      >
        <h1 style={{ fontSize: '28px', color: '#2c3e50', margin: 0 }}>프로젝트 목록</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '12px 25px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease',
          }}
        >
          새 프로젝트 생성
        </button>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}> 
        {projects.length === 0 && !loading && !error ? (
          <p style={{ textAlign: 'center', color: '#777', padding: '30px 0' }}>
            아직 프로젝트가 없어요! 새로운 프로젝트를 만들어보세요.
          </p>
        ) : (
          projects.map((project: Project) => (
            <div
              key={project.id}
              onClick={() => {
                setSelectedProjectKey(project.key)
                router.push(`/project/detail?key=${encodeURIComponent(project.key)}`);
              }}
              style={{
                border: '1px solid #ddd',
                padding: '18px',
                borderRadius: '10px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
                backgroundColor: project.mine ? '#e6fff5' : '#ffffff',
                transition: 'transform 0.2s ease-in-out',
              }}
            >
              <h3 style={{ fontSize: '22px', color: '#34495e', margin: '0 0 10px 0' }}>
                {project.name}{' '}
                {project.mine && (
                  <span
                  >
                    ⭐️
                  </span>
                )}
              </h3>
   
              <p style={{ fontSize: '15px', color: '#555', margin: '5px 0' }}>
                생성일: {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <ProjectCreateModal
          createdUserId={userId}
          onClose={() => setIsModalOpen(false)}
          onCreate={async (params) => {
            await handleSubmit(params)
            setIsModalOpen(false)
          }}
        />
      )}
    </div>
  )
}