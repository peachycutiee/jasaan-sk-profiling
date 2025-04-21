import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { token } = await req.json();

    // Validate input
    if (!token) {
      return NextResponse.json({ success: false, error: "hCaptcha token is required" }, { status: 400 });
    }

    // Load environment variable
    const secretKey = process.env.HCAPTCHA_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json({ success: false, error: "hCaptcha secret key missing" }, { status: 500 });
    }

    // Verify hCaptcha token
    const response = await fetch("https://api.hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: secretKey, response: token }),
    });

    // Check if the request was successful
    if (!response.ok) {
      return NextResponse.json({ success: false, error: "Failed to verify hCaptcha token" }, { status: 500 });
    }

    // Parse the response
    const data = await response.json();

    // Return the verification result
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error verifying hCaptcha:", error);
        return NextResponse.json({ success: false, error: "An unexpected error occurred" });
      }
    }