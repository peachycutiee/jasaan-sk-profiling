import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Attempt to sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    // Log response from Supabase
    console.log("Supabase Auth Response:", { data, error });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Login successful", 
      user: data.user 
    });
  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
