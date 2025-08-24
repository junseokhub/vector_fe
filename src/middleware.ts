import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest, res: NextResponse) {
  if (req.nextUrl.pathname.startsWith("/api")) {
    const url = req.nextUrl.clone();
    const pathName = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${url.pathname
      .split("/")
      .slice(2)
      .join("/")}`;
    return NextResponse.rewrite(pathName);
  }

  return NextResponse.next();
}
