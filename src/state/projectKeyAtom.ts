import { storage } from '@/utils/storage';
import { atom } from 'recoil';

export const projectKeyState = atom<string | null>({
  key: "selectedProjectKeyState",
  default: storage.get("selectedProjectKey") || null,
});