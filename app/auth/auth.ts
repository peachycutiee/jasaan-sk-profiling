import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Function to sign in with email/password
export const signIn = async (email: string, password: string, captchaToken: string) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, captchaToken }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

// Function to sign out
export const signOut = async () => {
  await supabase.auth.signOut();
};

// Function to get the authenticated user
export const getUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};



