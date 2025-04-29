import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

// Load environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!; // Load private key from environment variable

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

type LoginRequestBody = {
  email: string;
  password: string;
};

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { email, password } = (await request.json()) as LoginRequestBody;

    // Step 1: Authenticate user with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message || "Authentication failed." }, { status: 401 });
    }

    // Step 2: Generate JWT with dynamic payload and RS256 algorithm
    const payload = {
      userId: data.user?.id,
      email: data.user?.email,
      role: data.user?.role,
      iat: Math.floor(Date.now() / 1000), // Issued at (current timestamp)
      exp: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
      jti: crypto.randomUUID(), // Unique identifier for the token
    };

    const token = jwt.sign(payload, PRIVATE_KEY, { algorithm: "RS256" });

    // Step 3: Return user data and token
    return NextResponse.json({
      user: {
        id: data.user?.id,
        email: data.user?.email,
        role: data.user?.role,
      },
      token,
    });

  } catch (err: unknown) {
    console.error("🔥 Unexpected error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
