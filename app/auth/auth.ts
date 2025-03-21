import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Function to sign in with email/password
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
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
