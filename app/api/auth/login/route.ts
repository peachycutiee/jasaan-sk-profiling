import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Function to verify hCaptcha
async function verifyCaptcha(token: string) {
  const secret = process.env.HCAPTCHA_SECRET_KEY;
  if (!secret) {
    console.error("🚨 hCaptcha secret key is missing.");
    return false;
  }

  const response = await fetch("https://api.hcaptcha.com/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret,
      response: token,
    }),
  });

  const data = await response.json();
  console.log("🔍 hCaptcha Verification Response:", data);
  return data.success;
}

export async function POST(req: Request) {
  try {
    const { email, password, captchaToken } = await req.json();

    console.log("📨 Received login request", { email, captchaTokenPresent: !!captchaToken });

    if (!email || !password || !captchaToken) {
      console.warn("⚠️ Missing fields", { email, passwordPresent: !!password, captchaTokenPresent: !!captchaToken });
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const isCaptchaValid = await verifyCaptcha(captchaToken);
    console.log("🔍 hCaptcha Verification Result:", isCaptchaValid);

    if (!isCaptchaValid) {
      return NextResponse.json({ success: false, error: "Captcha verification failed" }, { status: 401 });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    console.log("🟢 Supabase Response:", data, error);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Login successful", 
      user: data.user 
    });

  } catch (err) {
    console.error("❌ Server Error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
