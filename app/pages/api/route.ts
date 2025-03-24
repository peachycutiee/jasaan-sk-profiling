import supabase from "@/app/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password, captchaToken } = await req.json();

    if (!email || !password || !captchaToken) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // 🔹 Verify hCaptcha Token with hCaptcha API
    const hcaptchaResponse = await fetch("https://api.hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.HCAPTCHA_SECRET_KEY!, // Server-side secret key
        response: captchaToken, // User-provided token
      }).toString(),
    });

    const hcaptchaResult = await hcaptchaResponse.json();
    if (!hcaptchaResult.success) {
      return NextResponse.json({ error: "Captcha verification failed." }, { status: 400 });
    }

    // Proceed with Supabase authentication after hCaptcha validation
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("Supabase Auth Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ user: data.user });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
