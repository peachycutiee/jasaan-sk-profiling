import { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/app/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { email, password, captchaToken } = req.body;

    console.log("Received Login Request:", req.body);

    if (!email || !password || !captchaToken) {
      return res.status(400).json({ error: "Missing credentials" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) throw new Error(error.message);

    console.log("User authenticated:", data.user);
    return res.status(200).json({ user: data.user });
  } catch (error: unknown) {
    console.error("Login error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return res.status(500).json({ error: errorMessage });
  }
}
