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

  const response = await fetch("https://api.hcaptcha.com/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret,
      response: token,
    }),
  })

  const data = await response.json()
  console.log("🔍 hCaptcha Verification Response:", data)
  return data.success
}

export async function POST(req: Request) {
  try {
    const { email, password, captchaToken } = await req.json()

    console.log("📨 Received login request", { email, captchaTokenPresent: !!captchaToken })

    if (!email || !password || !captchaToken) {
      console.warn("⚠️ Missing fields", { email, passwordPresent: !!password, captchaTokenPresent: !!captchaToken })
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const isCaptchaValid = await verifyCaptcha(captchaToken)
    console.log("🔍 hCaptcha Verification Result:", isCaptchaValid)

    if (!isCaptchaValid) {
      return NextResponse.json({ success: false, error: "Captcha verification failed" }, { status: 401 })
    }

    // Add more detailed logging for debugging
    console.log("🔑 Attempting to sign in with:", { email })

    // Try to authenticate with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log("🟢 Supabase Auth Response:", {
      user: data?.user ? "exists" : "null",
      session: data?.session ? "exists" : "null",
      error: error ? error.message : "none",
    })

    if (error) {
      console.error("❌ Authentication Error:", error.message)
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }

    if (!data.user) {
      console.error("❌ No user returned despite successful authentication")
      return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 401 })
    }

    // Check if user has a profile in the profiles table
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("uuid", data.user.id)
      .single()

    console.log("👤 Profile Check:", {
      profileExists: !!profileData,
      profileError: profileError ? profileError.message : "none",
    })

    // If no profile exists, create one
    if (profileError && profileError.code === "PGRST116") {
      // PGRST116 is "no rows returned" error
      console.log("📝 Creating new profile for user:", data.user.id)

      const { error: insertError } = await supabase.from("profiles").insert({
        uuid: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.full_name || email.split("@")[0],
        created_at: new Date().toISOString(),
      })

      if (insertError) {
        console.error("❌ Error creating profile:", insertError)
        // Continue anyway - we'll just return the auth user
      }
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
