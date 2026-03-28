import { ReactNode } from "react";
import Link from "next/link";
import { useLogout } from "@/hooks/user/useLogout";

interface Props {
  children: ReactNode;
  headerTitle?: string;
}

export default function Layout({ children, headerTitle = "내 프로젝트" }: Props) {
  const { handleLogout } = useLogout();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-gradient-to-r from-slate-900 to-slate-700 text-white px-6 py-4 shadow-lg flex items-center justify-between">
        <Link href="/project" className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
          ⚡ {headerTitle}
        </Link>
        <button
          onClick={handleLogout}
          className="text-sm text-slate-300 hover:text-white transition-colors"
        >
          로그아웃
        </button>
      </header>
      <main className="flex-grow container mx-auto px-4 py-6 max-w-4xl">
        {children}
      </main>
      <footer className="bg-slate-100 border-t text-center py-4 text-sm text-slate-500">
        © 2025 내 프로젝트
      </footer>
    </div>
  );
}