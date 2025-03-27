import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (email === "test@example.com" && password === "password123") {
    return NextResponse.json({ success: true, message: "Login successful" });
  } else {
    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
  }
}
