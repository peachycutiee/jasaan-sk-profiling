import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import jwt from "jsonwebtoken";
import fs from "fs";

// Load environment variables
const HCAPTCHA_SECRET_KEY = process.env.HCAPTCHA_SECRET_KEY!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Load private key for JWT signing (use asymmetric algorithm)
const PRIVATE_KEY = fs.readFileSync("private.key", "utf-8"); // Path to your private key file

// Debugging: Log environment variables
console.log("HCAPTCHA_SECRET_KEY:", HCAPTCHA_SECRET_KEY ? "✅" : "❌ MISSING");
console.log("SUPABASE_URL:", SUPABASE_URL ? "✅" : "❌ MISSING");
console.log("SUPABASE_ANON_KEY:", SUPABASE_ANON_KEY ? "✅" : "❌ MISSING");

// Validate required environment variables
if (!HCAPTCHA_SECRET_KEY || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
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

      // Handle reused token error
      if (error.message.includes("already-seen-response")) {
        return NextResponse.json(
          { error: "This captcha token has already been used. Please solve the captcha again." },
          { status: 400 }
        );
      }

      return NextResponse.json({ error: error.message || "Authentication failed." }, { status: 401 });
    }

    // Step 3: Generate JWT with dynamic payload and RS256 algorithm
    const payload = {
      userId: data.user?.id,
      email: data.user?.email,
      role: data.user?.role,
      iat: Math.floor(Date.now() / 1000), // Issued at (current timestamp)
      exp: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
      jti: crypto.randomUUID(), // Unique identifier for the token
    };

    const token = jwt.sign(payload, PRIVATE_KEY, { algorithm: "RS256" });

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