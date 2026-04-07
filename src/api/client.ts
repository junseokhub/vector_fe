import ky, { HTTPError } from "ky";
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
      async (request, options, response) => {
        if (response.status === 401) {
          const expiredToken =
            getRecoil(authState)?.accessToken ?? storage.get("accessToken");
          if (!expiredToken) return response;

          try {
            const reissued = await ky
              .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/reissue`, {
                headers: { Authorization: `Bearer ${expiredToken}` },
              })
              .json<{ accessToken: string }>();

            // 새 토큰 저장
            setRecoil(authState, (prev) => ({
              ...prev,
              accessToken: reissued.accessToken,
            }));
            storage.set("accessToken", reissued.accessToken);

            // 원래 요청 새 토큰으로 재시도
            request.headers.set("Authorization", `Bearer ${reissued.accessToken}`);
            return ky(request);
          } catch {
            // Refresh Token도 만료 → 강제 로그아웃
            setRecoil(authState, { accessToken: null, id: null });
            storage.remove("accessToken");
            storage.remove("userId");
            window.location.href = "/login";
          }
        }

        return response;
      },
    ],
    beforeError: [(error) => error],
  },
});

export default client;