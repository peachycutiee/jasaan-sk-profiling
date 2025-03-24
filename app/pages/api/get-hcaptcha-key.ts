import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Restrict the HTTP method to GET
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Retrieve the hCaptcha site key from environment variables
  const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

  // Check if the site key is configured
  if (!siteKey) {
    return res.status(500).json({ error: "hCaptcha site key is not configured." });
  }

  // Respond with the site key
  res.status(200).json({ siteKey });
}
