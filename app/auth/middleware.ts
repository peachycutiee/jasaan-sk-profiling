import { NextResponse } from "next/server";
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareSupabaseClient({ req, res });

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();

  const protectedRoutes = ["/dashboard"]; // Add more protected routes here

  if (protectedRoutes.includes(req.nextUrl.pathname) && !user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

// Apply middleware only to specific routes
export const config = {
  matcher: ["/dashboard/:path*"], // Protect dashboard route
};
