import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function verifyCaptcha(token: string) {
  const secret = process.env.HCAPTCHA_SECRET_KEY
  if (!secret) {
    console.error("🚨 hCaptcha secret key missing.")
    return false
  }

  try {
    const verifyUrl = "https://hcaptcha.com/siteverify"
    const params = new URLSearchParams({
      secret,
      response: token,
      sitekey: process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || ""
    })

    const response = await fetch(verifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params
    })

    const text = await response.text()
    const data = JSON.parse(text)

    if (!data.success) {
      console.error("❌ Captcha failed:", data["error-codes"])
    }

    return data.success
  } catch (error) {
    console.error("❌ Captcha verification error:", error)
    return false
  }
}

export async function POST(req: Request) {
  try {
    const { email, password, captchaToken } = await req.json()

    if (!email || !password || !captchaToken) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const isCaptchaValid = await verifyCaptcha(captchaToken)
    if (!isCaptchaValid) {
      return NextResponse.json(
        { success: false, error: "Captcha verification process failed" },
        { status: 401 }
      )
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: data.user,
    })
  } catch (err: unknown) {
    console.error("❌ Server error:", err)
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}
