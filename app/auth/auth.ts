import supabase from "@/app/lib/supabaseClient";

// Function to sign in with email/password
export const signIn = async (email: string, password: string, captchaToken: string) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, captchaToken }),
  });

  if (!res.ok) {
    const errorText = await res.text(); // Read response as text
    throw new Error(errorText || "An unknown error occurred");
  }

  try {
    return await res.json();
  } catch {
    throw new Error("Invalid JSON response from server");
  }
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
