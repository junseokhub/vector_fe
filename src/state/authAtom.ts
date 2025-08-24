import { storage } from "@/utils/storage";
import { atom } from "recoil";

export interface AuthState {
  accessToken: string;
  id: number;
  email: string;
}

export const authState = atom<AuthState>({
  key: "authStateVector",
  default: {
    accessToken: storage.get("accessToken") || "",
    id: storage.get("userId") ? parseInt(storage.get("userId")!) : 0,
    email: storage.get("email") || "",
  },
});
