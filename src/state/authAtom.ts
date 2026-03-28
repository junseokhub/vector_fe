import { atom } from "recoil";
import { storage } from "@/lib/storage";
import type { AuthState } from "@/types";

const isServer = typeof window === "undefined";

export const authState = atom<AuthState>({
  key: "authStateVector",
  default: {
    accessToken: "",
    id: 0,
    email: "",
  },
  effects: [
    ({ setSelf }) => {
      if (isServer) return;

      const accessToken = storage.get("accessToken") || "";
      const userId = storage.get("userId");
      const email = storage.get("email") || "";

      setSelf({
        accessToken,
        id: userId ? parseInt(userId) : 0,
        email,
      });
    },
  ],
});