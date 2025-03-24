import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient"; // Adjusted import path for Next.js alias

export async function POST(req: Request) {
  try {
    const { email, password, captchaToken } = await req.json();

    // Ensure all required fields are provided
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    if (!captchaToken) {
      return NextResponse.json({ error: "Captcha verification is required." }, { status: 400 });
    }

    // Authenticate user
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("Supabase Auth Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (!data?.user) {
      return NextResponse.json({ error: "Authentication failed." }, { status: 401 });
    }

    return NextResponse.json({ user: data.user });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
