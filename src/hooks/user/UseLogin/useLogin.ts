import { useSetRecoilState } from "recoil";
import { authState } from "@/state/authAtom";
import client from "@/api/client";
import { LoginParams, LoginResponse } from "./interface";
import { useState } from "react";
import { useRouter } from "next/router";
import { storage } from "@/utils/storage";

export const useLogin = () => {
  const setAuth = useSetRecoilState(authState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async (params: LoginParams) => {
    const data = await client.post("/api/auth/login", { json: params }).json<LoginResponse>();

    setAuth({
      accessToken: data.accessToken,
      id: data.id,
      email: data.email,
    });

    storage.set("accessToken", data.accessToken);
    storage.set("userId", data.id.toString());
    storage.set("userEmail", data.email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      router.push("/project");
    } catch (error) {
      alert("로그인 실패: " + (error as Error).message);
    }
  };

  return { email, setEmail, password, setPassword, handleSubmit };
};
