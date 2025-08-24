import { CreateProjectParams } from "@/hooks/project/CreateProject/interface"
import { useState } from "react"

interface Props {
  onClose: () => void
  onCreate: (params: CreateProjectParams) => Promise<void>
  createdUserId: number
}

export const ProjectCreateModal = ({ onClose, onCreate, createdUserId }: Props) => {
  const [name, setName] = useState("")
  const fixedDimensions = 3072

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      alert("프로젝트 이름을 입력하세요.")
      return
    }

    await onCreate({ name, createdUserId, dimensions: fixedDimensions })
  }

  return (
    <div style={modalStyle.overlay}>
      <div style={modalStyle.content}>
        <h2 style={{ color: "#000", marginBottom: 20 }}>프로젝트 생성하기</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <label style={{ color: "#000", fontWeight: "bold" }}>
            프로젝트 이름:
            <input
              type="text"
              placeholder="프로젝트 이름"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={inputStyle}
            />
          </label>

          <label style={{ color: "#000", fontWeight: "bold", userSelect: "none" }}>
            차원:
            <input
              type="text"
              value={fixedDimensions}
              readOnly
              disabled
              style={{ ...inputStyle, backgroundColor: "#eee", cursor: "not-allowed" }}
            />
          </label>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button type="submit" style={buttonStyle}>생성하기</button>
            <button type="button" onClick={onClose} style={{ ...buttonStyle, backgroundColor: "#ccc", color: "#000" }}>취소하기</button>
          </div>
        </form>
      </div>
    </div>
  )
}

const modalStyle = {
  overlay: {
    position: "fixed" as const,
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    background: "#fff",
    padding: 30,
    borderRadius: 10,
    width: 400,
    display: "flex",
    flexDirection: "column" as const,
    gap: 20,
    color: "#000",
  },
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  marginTop: 6,
  borderRadius: 4,
  border: "1px solid #ccc",
  fontSize: 16,
  color: "#000",
  outline: "none",
}

const buttonStyle: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: 6,
  border: "none",
  backgroundColor: "#0070f3",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
}
