import { useRouter } from "next/router";
import { useResetRecoilState } from "recoil";
import { authState } from "@/state/authAtom";
import { storage } from "@/utils/storage";
import client from "@/api/client";
import toast from "react-hot-toast";

export function useLogout() {
  const resetAuth = useResetRecoilState(authState);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await client.get("/api/auth/logout");
    } catch {
    } finally {
      resetAuth();
      storage.remove("accessToken");
      storage.remove("userId");
      storage.remove("userEmail");
      toast.success("로그아웃 됐습니다.");
      router.replace("/login");
    }
  };

  return { handleLogout };
}