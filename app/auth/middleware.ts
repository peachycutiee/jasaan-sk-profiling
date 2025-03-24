import { NextResponse } from "next/server";
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  console.log("Middleware triggered:", req.nextUrl.pathname);
  const res = NextResponse.next();
  const supabase = createMiddlewareSupabaseClient({ req, res });

  const { data: { user } } = await supabase.auth.getUser();
  const protectedRoutes = ["/dashboard"];

  if (protectedRoutes.includes(req.nextUrl.pathname) && !user) {
    console.log("Redirecting to /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

// Apply middleware only to specific routes
export const config = {
  matcher: ["/dashboard/:path*"],
};
