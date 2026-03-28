import { useRouter } from "next/router";
import ContentDetail from "@/components/content/ContentDetail";
import Layout from "@/components/layout/Layout";
import { useGetContentDetail } from "@/hooks/content/useGetContentDetail";

export default function ContentPage() {
  const { query } = useRouter();
  const contentKey = typeof query.key === "string" ? query.key : "";
  const content = useGetContentDetail(contentKey);

  if (!contentKey) {
    return (
      <Layout headerTitle="내 콘텐츠">
        <p className="text-center py-20 text-slate-500">key 값이 필요합니다.</p>
      </Layout>
    );
  }

  return (
    <Layout headerTitle={`${content.contentDetail?.title}(${contentKey})`}>
      <ContentDetail contentKey={contentKey} />
    </Layout>
  );
}