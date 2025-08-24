// LoginForm.tsx
import { useLogin } from "@/hooks/user/UseLogin/useLogin"
import { useRouter } from "next/router"

export default function LoginForm() {
  const { email, setEmail, password, setPassword, handleSubmit } = useLogin()
  const router = useRouter()

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-20 p-6 border rounded shadow flex flex-col space-y-4"
    >
      <h2 className="text-2xl font-semibold text-center mb-4">로그인</h2>

      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="border p-2 rounded"
      />

      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="border p-2 rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        로그인
      </button>

      <button
        type="button"
        onClick={() => router.push("/signup")}
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        회원가입
      </button>
    </form>
  )
}
