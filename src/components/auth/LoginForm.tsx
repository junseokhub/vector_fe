import { useLogin } from "@/hooks/user/useLogin";
import { storage } from "@/lib/storage";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LoginForm() {
  const { email, setEmail, password, setPassword, handleSubmit } = useLogin();
  const router = useRouter();

    useEffect(() => {
      const token = storage.get("accessToken");
      if (token) router.replace("/project");
    }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">⚡</div>
            <h1 className="text-3xl font-bold text-white">로그인</h1>
            <p className="text-slate-400 mt-2 text-sm">계정에 로그인하세요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98]"
            >
              로그인
            </button>
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20 transition-all duration-200 active:scale-[0.98]"
            >
              회원가입
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}