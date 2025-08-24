import ky from "ky";
import { getRecoil, setRecoil } from "recoil-nexus";
import { authState } from "@/state/authAtom";
import { storage } from "@/utils/storage";

const client = ky.create({
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  hooks: {
    beforeRequest: [
      (request) => {
        const url = new URL(request.url);
        const path = url.pathname;

        if (!path.includes("auth/login") && !path.includes("user/sign-up")) {
          const token = getRecoil(authState)?.accessToken ?? storage.get("accessToken");
          if (token) request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        const newAccessToken = response.headers.get("newAccessToken");
        if (newAccessToken) {
          setRecoil(authState, (prev) => ({ ...prev, accessToken: newAccessToken }));
          storage.set("accessToken", newAccessToken);
        }
      },
    ],
    beforeError: [(error) => error],
  },
});

export default client;
