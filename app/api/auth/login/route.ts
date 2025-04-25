import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import jwt from "jsonwebtoken";

// Load environment variables
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;
const HCAPTCHA_SECRET_KEY = process.env.HCAPTCHA_SECRET_KEY!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Debugging: Log environment variables
console.log("JWT_SECRET_KEY:", JWT_SECRET_KEY ? "✅" : "❌ MISSING");
console.log("HCAPTCHA_SECRET_KEY:", HCAPTCHA_SECRET_KEY ? "✅" : "❌ MISSING");
console.log("SUPABASE_URL:", SUPABASE_URL ? "✅" : "❌ MISSING");
console.log("SUPABASE_ANON_KEY:", SUPABASE_ANON_KEY ? "✅" : "❌ MISSING");

// Validate required environment variables
if (!JWT_SECRET_KEY || !HCAPTCHA_SECRET_KEY || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("🚨 Missing one or more required environment variables.");
  throw new Error("Missing required environment variables.");
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

type LoginRequestBody = {
  email: string;
  password: string;
  captchaToken: string;
};

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { email, password, captchaToken } = (await request.json()) as LoginRequestBody;

    console.log("🧠 Received captchaToken:", captchaToken);

    // Step 1: Verify hCaptcha token
    if (!captchaToken) {
      return NextResponse.json({ error: "Missing hCaptcha token." }, { status: 400 });
    }

    const params = new URLSearchParams();
    params.append("secret", HCAPTCHA_SECRET_KEY);
    params.append("response", captchaToken);

    const captchaResponse = await axios.post(
      "https://hcaptcha.com/siteverify",
      params.toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    console.log("🔒 hCaptcha verification response:", captchaResponse.data);

    if (!captchaResponse.data.success) {
      return NextResponse.json({
        error: "Invalid hCaptcha verification.",
        details: captchaResponse.data["error-codes"] || [],
      }, { status: 400 });
    }

    // Step 2: Authenticate user with Supabase
    console.log("🔒 Sending captchaToken to Supabase:", captchaToken); // Debugging log
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        captchaToken, // Include the hCaptcha token here
      },
    });

    if (error) {
      console.error("❌ Supabase auth error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // Step 3: Generate JWT (optional, for session management)
    const token = jwt.sign({ userId: data.user?.id }, JWT_SECRET_KEY, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    console.log("🔑 Generated JWT token:", token);

    // Step 4: Return user data and token
    return NextResponse.json({
      user: {
        id: data.user?.id,
        email: data.user?.email,
        role: data.user?.role,
      },
      token,
    });

  } catch (err) {
    console.error("🔥 Unexpected error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}