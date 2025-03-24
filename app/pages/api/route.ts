import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/app/auth/auth";

const VERIFY_URL = "https://api.hcaptcha.com/siteverify";
const SECRET_KEY = process.env.HCAPTCHA_SECRET_KEY!; // Use backend secret

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, password, captchaToken } = req.body;

  // Validate hCaptcha Token
  const hCaptchaResponse = await fetch(VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: SECRET_KEY,
      response: captchaToken,
    }),
  });

  const hCaptchaData = await hCaptchaResponse.json();

  if (!hCaptchaData.success) {
    return res.status(400).json({ error: "hCaptcha verification failed", details: hCaptchaData["error-codes"] });
  }

  // Authenticate with Supabase
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({ user: data.user });
}
