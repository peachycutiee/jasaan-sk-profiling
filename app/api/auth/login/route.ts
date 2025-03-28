import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Ensure env variables are set
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error("❌ Supabase env variables are missing!");
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    console.log("Received login request:", { email });

    // Attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    console.log("Supabase Response:", { data, error });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }

    return NextResponse.json({ success: true, message: "Login successful", user: data.user });
  } catch (err) {
    console.error("🚨 Server Error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
