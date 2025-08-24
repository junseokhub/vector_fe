// useSignUp.ts
import client from "@/api/client"
import { SignUpParams, UserResponse } from "@/hooks/user/UseSignUp/interface"
import { useRouter } from "next/router"
import { useState } from "react"

export const useSignUp = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter();

  const signUp = async (params: SignUpParams) => {
    const data = await client.post("/api/user/sign-up", { json: params }).json<UserResponse>()
    return data
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signUp({ username, email, password })
      alert("회원가입 성공! 로그인 해주세요.")
      setUsername("")
      setEmail("")
      setPassword("")
      router.push("/login")
    } catch (error) {
      alert("회원가입 실패: " + (error as Error).message)
    }
  }

  return {
    username,
    email,
    password,
    handleUsernameChange,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  }
}
