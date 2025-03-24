import { NextResponse } from "next/server";

const SECRET_KEY = process.env.HCAPTCHA_SECRET_KEY;
const VERIFY_URL = "https://api.hcaptcha.com/siteverify";

export async function POST(req: Request) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ error: "Missing hCaptcha token" }, { status: 400 });
        }

        if (!SECRET_KEY) {
            return NextResponse.json({ error: "Server misconfiguration: Missing hCaptcha secret key" }, { status: 500 });
        }

        // Prepare data for verification request
        const data = new URLSearchParams();
        data.append("secret", SECRET_KEY);
        data.append("response", token);

        // Verify hCaptcha response
        const hCaptchaRes = await fetch(VERIFY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: data,
        });

        if (!hCaptchaRes.ok) {
            return NextResponse.json({ error: "Failed to verify hCaptcha" }, { status: 500 });
        }

        const hCaptchaData = await hCaptchaRes.json();

        if (!hCaptchaData.success) {
            return NextResponse.json({ error: "hCaptcha verification failed", details: hCaptchaData["error-codes"] }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: "hCaptcha verified" });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error", details: error }, { status: 500 });
    }
}
