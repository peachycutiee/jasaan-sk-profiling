import { createClient } from "../../utils/supabase/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Validate the request method
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const supabase = createClient();

  try {
    // Fetch data from the 'profiles' table
    const { data, error } = await supabase.from("profiles").select("*");

    // Handle Supabase errors
    if (error) {
      console.error("Supabase error:", error.message);
      return res.status(500).json({ error: "Failed to fetch data" });
    }

    // Return the data as a JSON response
    return res.status(200).json(data);
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}