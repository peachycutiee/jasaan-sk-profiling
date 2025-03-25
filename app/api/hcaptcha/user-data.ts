import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client (server-side only)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Never expose this key on the frontend!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check for authentication (Example: using Supabase auth)
  const { data: authData, error: authError } = await supabase.auth.getUser(req.headers.authorization || "");

    if (authError || !authData.user) {
    return res.status(401).json({ error: "Unauthorized" });
    }

const user = authData.user;


  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Fetch user data
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
}
