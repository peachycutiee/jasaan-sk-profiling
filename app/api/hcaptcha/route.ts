import { NextResponse } from "next/server";

const SECRET_KEY = process.env.HCAPTCHA_SECRET_KEY; // Ensure this is set
const VERIFY_URL = "https://api.hcaptcha.com/siteverify";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    
    if (!token) {
      return NextResponse.json({ success: false, error: "Missing hCaptcha token" }, { status: 400 });
    }

    console.log("✅ Received hCaptcha token:", token); // Debugging input

    if (!SECRET_KEY) {
      return NextResponse.json({ success: false, error: "Server misconfiguration: Missing hCaptcha secret key" }, { status: 500 });
    }

    // Prepare data for verification request
    const data = new URLSearchParams();
    data.append("secret", SECRET_KEY);
    data.append("response", token);

    const hCaptchaRes = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: data.toString(),
    });

    console.log("🔍 hCaptcha API response status:", hCaptchaRes.status); // Debug HTTP status

    const rawResponse = await hCaptchaRes.text();
    console.log("🔍 hCaptcha API raw response:", rawResponse); // Debug raw response

    if (!rawResponse) {
      return NextResponse.json({ success: false, error: "Empty response from hCaptcha" }, { status: 500 });
    }

    const hCaptchaData = JSON.parse(rawResponse); // Parse safely

    if (!hCaptchaData.success) {
      return NextResponse.json({ success: false, error: "hCaptcha verification failed", details: hCaptchaData["error-codes"] }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "hCaptcha verified" });

  } catch (error: unknown) {
    console.error("❌ Server Error:", error); // Debugging error logs
    return NextResponse.json({ success: false, error: "Internal server error", details: (error as Error).message }, { status: 500 });
  }
}
