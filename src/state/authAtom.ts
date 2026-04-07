import { atom } from "recoil";
import { storage } from "@/lib/storage";
import type { AuthState } from "@/types";

const isServer = typeof window === "undefined";

export const authState = atom<AuthState>({
  key: "authStateVector",
  default: {
    accessToken: null,
    id: null,
  },
  effects: [
    ({ setSelf }) => {
      if (isServer) return;

      const accessToken = storage.get("accessToken") || "";
      const userId = storage.get("userId");

      setSelf({
        accessToken,
        id: userId ? parseInt(userId) : 0,
      });
    },
  ],
});