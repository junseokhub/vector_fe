"use client";
import ProjectDetailContents from "@/components/project/ProjectDetailContents";
import { useSearchParams } from "next/navigation";

export default function ProjectDetailPage() {
  const searchParams = useSearchParams();
  const projectKey = searchParams?.get("key");

  if (!projectKey) return <div>프로젝트 키가 없습니다.</div>;

  return <ProjectDetailContents projectKey={projectKey} />;
}
