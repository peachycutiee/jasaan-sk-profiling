import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token } = await req.json();
  const secretKey = process.env.HCAPTCHA_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json({ success: false, error: "hCaptcha secret key missing" }, { status: 500 });
  }

  const response = await fetch("https://api.hcaptcha.com/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret: secretKey, response: token }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}
