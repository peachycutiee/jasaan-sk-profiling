import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function verifyCaptcha(token: string) {
  const secret = process.env.HCAPTCHA_SECRET_KEY
  const params = new URLSearchParams({
    secret: secret!,
    response: token,
  })

  const res = await fetch("https://hcaptcha.com/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  })

  const data = await res.json()
  return data.success
}

export async function POST(req: Request) {
  const { email, captchaToken } = await req.json()

  if (!email || !captchaToken) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const captchaOk = await verifyCaptcha(captchaToken)
  if (!captchaOk) {
    return NextResponse.json({ error: "Captcha verification process failed" }, { status: 401 })
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: "https://popcom-jasaan.vercel.app/dashboard",
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true, message: "Magic link sent." })
}
