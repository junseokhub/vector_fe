import React, { useState } from "react";

interface Props {
  messages: { role: "user" | "assistant"; text: string }[];
  onSend: (text: string) => void;
  loading: boolean;
}

export default function ChatBox({ messages, onSend, loading }: Props) {
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              textAlign: msg.role === "user" ? "right" : "left",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "10px",
                borderRadius: "10px",
                backgroundColor: msg.role === "user" ? "#007bff" : "#e4e6eb",
                color: msg.role === "user" ? "#fff" : "#000",
                maxWidth: "70%",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", padding: "10px", borderTop: "1px solid #ccc" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onCompositionStart={() => setIsComposing(true)}   // 조합 시작
          onCompositionEnd={() => setIsComposing(false)}    // 조합 끝
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isComposing) {
              e.preventDefault(); // 폼 제출 방지
              handleSend();
            }
          }}
          style={{ flex: 1, padding: "10px" }}
          placeholder="메시지를 입력하세요"
        />
        <button onClick={handleSend} disabled={loading} style={{ marginLeft: "10px" }}>
          전송
        </button>
      </div>
    </div>
  );
}
