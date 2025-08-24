// SignUpForm.tsx
import { useSignUp } from "@/hooks/user/UseSignUp/useSignUp"

export default function SignUpForm() {
  const {
    username,
    email,
    password,
    handleUsernameChange,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  } = useSignUp()

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-20 p-6 border rounded shadow flex flex-col space-y-4"
    >
      <h2 className="text-2xl font-semibold text-center mb-4">회원가입</h2>

      <input
        type="text"
        placeholder="사용자 이름"
        value={username}
        onChange={handleUsernameChange}
        required
        className="border p-2 rounded"
      />

      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={handleEmailChange}
        required
        className="border p-2 rounded"
      />

      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={handlePasswordChange}
        required
        className="border p-2 rounded"
      />

      <button
        type="submit"
        className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        회원가입
      </button>
    </form>
  )
}
