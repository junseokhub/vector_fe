"use client";

import { useSearchParams } from "next/navigation";
import ContentDetail from "@/components/content/ContentDetail";

export default function ContentDetailPage() {
  const searchParams = useSearchParams();
  const contentKey = searchParams?.get("key") ?? "";

  if (!contentKey) {
    return <div style={{ padding: "40px", textAlign: "center" }}>key 값이 필요합니다.</div>;
  }

  return <ContentDetail contentKey={contentKey} />;
}
