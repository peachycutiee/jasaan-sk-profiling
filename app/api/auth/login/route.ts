import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body); // Example: Log or process the body to use it
    // Example: Process login with Supabase/Auth Logic
    
    return NextResponse.json({ success: true, message: "Login successful!" });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, message: "Login failed." }, { status: 400 });
  }
}
