import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

// Function to verify hCaptcha
async function verifyCaptcha(token: string) {
  const secret = process.env.HCAPTCHA_SECRET_KEY
  if (!secret) {
    console.error("🚨 hCaptcha secret key is missing.")
    return false
  }

  try {
    console.log("🔍 Verifying captcha token:", token.substring(0, 10) + "...", "Token length:", token.length)
    console.log("🔑 Using secret key:", secret.substring(0, 5) + "...")  // Print first few chars for debugging

    // FIXED URL: removed "api." prefix
    const response = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
        // Add sitekey for additional verification
        sitekey: process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || "",
      }),
    })

    const responseText = await response.text() // Get raw response first
    console.log("🔄 Raw hCaptcha API response:", responseText)
    
    // Parse JSON after logging the raw response
    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.error("❌ Failed to parse hCaptcha response:", e)
      return false
    }

    console.log("🔍 hCaptcha Verification Response:", data)

    if (!data.success) {
      console.error("❌ hCaptcha verification failed:", data["error-codes"] || "No error codes provided")
    }

    return data.success
  } catch (error) {
    console.error("❌ Error during captcha verification:", error)
    return false
  }
}

export async function POST(req: Request) {
  try {
    const { email, password, captchaToken } = await req.json()

    console.log("📨 Received login request", {
      email,
      passwordProvided: !!password,
      captchaTokenLength: captchaToken?.length || 0,
    })

    if (!email || !password) {
      console.warn("⚠️ Missing credentials", { email: !!email, password: !!password })
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 })
    }

    if (!captchaToken) {
      console.warn("⚠️ Missing captcha token")
      return NextResponse.json({ success: false, error: "Captcha verification is required" }, { status: 400 })
    }

    // Verify captcha
    const isCaptchaValid = await verifyCaptcha(captchaToken)
    console.log("🔍 hCaptcha Verification Result:", isCaptchaValid)

    if (!isCaptchaValid) {
      return NextResponse.json(
        { success: false, error: "Captcha verification process failed" }, // Match the exact error message
        { status: 401 },
      )
    }

    // Proceed with authentication
    console.log("🔑 Attempting to sign in with:", { email })
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log("🟢 Supabase Auth Response:", {
      userExists: !!data?.user,
      sessionExists: !!data?.session,
      errorMessage: error?.message || "none",
    })

    if (error) {
      console.error("❌ Authentication Error:", error.message)
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: data.user,
    })
  } catch (err) {
    console.error("❌ Server Error:", err)
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}