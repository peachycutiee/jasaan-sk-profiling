import { NextResponse } from "next/server";

const SECRET_KEY = process.env.HCAPTCHA_SECRET_KEY; // Ensure this is set
const VERIFY_URL = "https://api.hcaptcha.com/siteverify";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ success: false, error: "Missing hCaptcha token" }, { status: 400 });
    }

    if (!SECRET_KEY) {
      return NextResponse.json({ success: false, error: "Server misconfiguration: Missing hCaptcha secret key" }, { status: 500 });
    }

    // Prepare data for verification request
    const data = new URLSearchParams();
    data.append("secret", SECRET_KEY);
    data.append("response", token);

    // Verify hCaptcha response
    const hCaptchaRes = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: data.toString(),
    });

    if (!hCaptchaRes.ok) {
      return NextResponse.json({ success: false, error: "Failed to verify hCaptcha" }, { status: 500 });
    }

    let hCaptchaData;
    try {
      hCaptchaData = await hCaptchaRes.json(); // Ensure response is valid JSON
    } catch {
      return NextResponse.json({ success: false, error: "Invalid response from hCaptcha" }, { status: 500 });
    }

    if (!hCaptchaData.success) {
      return NextResponse.json({ success: false, error: "hCaptcha verification failed", details: hCaptchaData["error-codes"] }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "hCaptcha verified" });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: "Internal server error", details: (error as Error).message }, { status: 500 });
  }
}
