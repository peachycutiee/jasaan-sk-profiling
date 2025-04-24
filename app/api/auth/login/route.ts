import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import jwt from "jsonwebtoken";

// Load environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const HCAPTCHA_SECRET_KEY = process.env.HCAPTCHA_SECRET_KEY!;
const NEXT_JWT_SECRET_KEY = process.env.NEXT_JWT_SECRET_KEY!;

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !HCAPTCHA_SECRET_KEY || !NEXT_JWT_SECRET_KEY) {
  console.error("🚨 Missing required environment variables.");
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

    console.log("Received captchaToken:", captchaToken); // Debugging: Log received token

    // Step 1: Verify hCaptcha token
    if (!captchaToken) {
      return NextResponse.json({ error: "Missing hCaptcha token." }, { status: 400 });
    }

    const captchaResponse = await axios.post(
      "https://hcaptcha.com/siteverify",
      null,
      {
        params: {
          secret: HCAPTCHA_SECRET_KEY,
          response: captchaToken,
        },
      }
    );

    console.log("hCaptcha verification response:", captchaResponse.data); // Debugging: Log hCaptcha response

    if (!captchaResponse.data.success) {
      return NextResponse.json({ error: "Invalid hCaptcha verification." }, { status: 400 });
    }

    // Step 2: Authenticate user with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        captchaToken, // Include the hCaptcha token here
      },
    });

    if (error) {
      console.error("Supabase auth error:", error.message);
      return NextResponse.json({ error: error.message || "Authentication failed." }, { status: 401 });
    }

    // Step 3: Generate JWT (optional, for session management)
    const token = jwt.sign({ userId: data.user?.id }, NEXT_JWT_SECRET_KEY, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    console.log("Generated JWT token:", token); // Debugging: Log generated token

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
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}