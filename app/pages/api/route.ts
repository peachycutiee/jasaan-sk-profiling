import { NextResponse } from "next/server";

const SECRET_KEY = process.env.HCAPTCHA_SECRET_KEY; // Ensure this is set
const VERIFY_URL = "https://api.hcaptcha.com/siteverify";

export async function POST(req: Request) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ 
                error: "Missing hCaptcha token" 
            }, { status: 400 });
        }

        if (!SECRET_KEY) {
            console.error("Server misconfiguration: Missing hCaptcha secret key");
            return NextResponse.json({ 
                error: "Server misconfiguration: Missing hCaptcha secret key" 
            }, { status: 500 });
        }

        // Prepare data for verification request
        const data = new URLSearchParams();
        data.append("secret", SECRET_KEY);
        data.append("response", token);

        // Verify hCaptcha response
        const hCaptchaRes = await fetch(VERIFY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: data.toString(),
        });

        // Handle server errors
        if (!hCaptchaRes.ok) {
            console.error(`hCaptcha verification failed: ${hCaptchaRes.status}`);
            return NextResponse.json({ 
                error: "Failed to verify hCaptcha" 
            }, { status: hCaptchaRes.status });
        }

        const hCaptchaData = await hCaptchaRes.json();

        // Check verification result
        if (!hCaptchaData.success) {
            console.error(`hCaptcha verification failed: ${hCaptchaData["error-codes"]}`);
            return NextResponse.json({ 
                error: "hCaptcha verification failed", 
                details: hCaptchaData["error-codes"] 
            }, { status: 400 });
        }

        return NextResponse.json({ 
            success: true, 
            message: "hCaptcha verified" 
        });

    } catch (error) {
        console.error("Internal server error:", error);
        return NextResponse.json({ 
            error: "Internal server error", 
            details: error instanceof Error ? error.message : "Unknown error" 
        }, { status: 500 });
    }
}
