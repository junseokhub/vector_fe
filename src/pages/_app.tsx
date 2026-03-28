import type { AppProps } from "next/app";
import "@/app/globals.css";
import { RecoilRoot, useSetRecoilState } from "recoil";
import RecoilNexus from "recoil-nexus";
import { authState } from "@/state/authAtom";
import { useEffect } from "react";
import { storage } from "@/utils/storage";
import { Toaster } from "react-hot-toast";

function AuthInitializer() {
  const setAuth = useSetRecoilState(authState);

  useEffect(() => {
    const token = storage.get("accessToken");
    const userId = storage.get("userId");
    const email = storage.get("userEmail");

    if (token && userId) {
      setAuth({
        accessToken: token,
        id: parseInt(userId),
        email: email || "",
      });
    }
  }, [setAuth]);

  return null;
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <RecoilNexus />
      <AuthInitializer />
      <Toaster position="top-center"/>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}

export default MyApp;
