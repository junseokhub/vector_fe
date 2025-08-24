"use client";

import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useGetContentDetail } from "@/hooks/content/DetailContent/useGetContentDetail";
import { useUpdateContent } from "@/hooks/content/UpdateContent/useUpdateContent";
import { authState } from "@/state/authAtom";

interface Props {
  contentKey: string;
}

export default function ContentDetail({ contentKey }: Props) {
  const auth = useRecoilValue(authState);
  const userId = auth.id;
  

  const { contentDetail: content, loading, error } = useGetContentDetail(contentKey);
  const [isEditing, setIsEditing] = useState(false);

  const [titleValue, setTitleValue] = useState("");
  const [answerValue, setAnswerValue] = useState("");

  const { handleUpdate, loading: updateLoading, error: updateError } = useUpdateContent();

  useEffect(() => {
    if (content) {
      setTitleValue(content.title);
      setAnswerValue(content.answer);
      setIsEditing(false);
    }
  }, [content]);

  if (!userId) {
    return <div style={{ padding: "40px", textAlign: "center" }}>로그인이 필요합니다.</div>;
  }

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>로딩중...</div>;
  if (error) return <div style={{ padding: "40px", textAlign: "center", color: "red" }}>에러: {error}</div>;
  if (!content) return <div style={{ padding: "40px", textAlign: "center" }}>데이터 없음</div>;

  const isChanged = (): boolean => {
    return titleValue !== content.title || answerValue !== content.answer;
  };

  const handleSave = async () => {
    if (!isChanged()) {
      alert("변경된 내용이 없습니다.");
      return;
    }

    await handleUpdate(content.id, {
      title: titleValue,
      answer: answerValue,
      updatedUserId: userId,
    });

    setIsEditing(false);
  };

  const buttonStyle = {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "bold",
    marginRight: "8px",
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "700px",
        margin: "40px auto",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {isEditing ? (
          <input
            type="text"
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              flex: 1,
              padding: "5px 8px",
            }}
          />
        ) : (
          <h1 style={{ fontSize: "24px", margin: 0 }}>{content.title}</h1>
        )}

        {isEditing ? (
          <>
            <button
              style={{ ...buttonStyle, backgroundColor: "#28a745" }}
              onClick={handleSave}
              disabled={updateLoading}
            >
              {updateLoading ? "수정 중..." : "수정하기"}
            </button>
            <button
              style={{ ...buttonStyle, backgroundColor: "#6c757d" }}
              onClick={() => {
                setTitleValue(content.title);
                setAnswerValue(content.answer);
                setIsEditing(false);
              }}
              disabled={updateLoading}
            >
              취소
            </button>
          </>
        ) : (
          <button style={buttonStyle} onClick={() => setIsEditing(true)}>
            수정
          </button>
        )}
      </header>

      <div style={{ marginTop: "20px" }}>
        <strong>Key:</strong> {content.key}
      </div>

      <div style={{ marginTop: "20px" }}>
        <strong>답변:</strong>
        {isEditing ? (
          <textarea
            value={answerValue}
            onChange={(e) => setAnswerValue(e.target.value)}
            style={{
              width: "100%",
              minHeight: "150px",
              padding: "8px",
              marginTop: "8px",
              fontSize: "14px",
            }}
          />
        ) : (
          <p style={{ marginTop: "8px", whiteSpace: "pre-wrap" }}>{content.answer}</p>
        )}
      </div>

      {updateError && <p style={{ color: "red", marginTop: "10px" }}>에러: {updateError}</p>}

      <div style={{ marginTop: "20px", fontSize: "13px", color: "#666" }}>
        생성일: {new Date(content.createdAt).toLocaleString()}
      </div>
    </div>
  );
}
