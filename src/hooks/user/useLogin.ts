import { useState } from "react";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import client from "@/api/client";
import { authState } from "@/state/authAtom";
import { storage } from "@/lib/storage";
import type { LoginParams, LoginResponse } from "@/types";
import { HTTPError } from "ky";
import toast from "react-hot-toast";

export function useLogin() {
  const setAuth = useSetRecoilState(authState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await client
        .post("/api/auth/login", { json: { email, password } as LoginParams })
        .json<LoginResponse>();
      setAuth({ accessToken: data.accessToken, id: data.id, email: data.email });
      storage.set("accessToken", data.accessToken);
      storage.set("userId", data.id.toString());
      storage.set("userEmail", data.email);
      router.push("/project");
    } catch (err) {
    if (err instanceof HTTPError) {
      const status = err.response.status;
      if (status === 400) {
        toast.error("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        toast.error("로그인 중 오류가 발생했습니다.");
      }
    }
    }
  };

  return { email, setEmail, password, setPassword, handleSubmit };
}