import { useRouter } from "next/router";
import ContentList from "@/components/content/ContentList";
import Layout from "@/components/layout/Layout";
import { useGetProject } from "@/hooks/project/useGetProject";

export default function ProjectDetailPage() {
  const { query } = useRouter();
  const projectKey = typeof query.key === "string" ? query.key : "";
  const { project } = useGetProject(projectKey);

  if (!projectKey) {
    return (
      <Layout headerTitle="내 프로젝트">
        <p className="text-center py-20 text-slate-500">프로젝트 키가 없습니다.</p>
      </Layout>
    );
  }

  return (
    <Layout headerTitle={`${project?.name}(${project?.key})`}>
      <ContentList projectKey={projectKey} />
    </Layout>
  );
}