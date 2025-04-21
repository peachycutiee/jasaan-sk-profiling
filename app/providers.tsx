// app/providers.tsx
"use client";

import { createContext, useContext, useState } from "react";
import { createBrowserClient } from "@supabase/ssr"; // Use @supabase/ssr
import { SupabaseClient } from "@supabase/supabase-js"; // Import SupabaseClient from @supabase/supabase-js

// Create a context for Supabase client
const SupabaseContext = createContext<SupabaseClient | null>(null);

export function Providers({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ));

  return (
    <SupabaseContext.Provider value={supabaseClient}>
      {children}
    </SupabaseContext.Provider>
  );
}

// Custom hook to access the Supabase client
export function useSupabase() {
  const supabaseClient = useContext(SupabaseContext);
  if (!supabaseClient) {
    throw new Error("useSupabase must be used within a SupabaseContextProvider");
  }
  return supabaseClient;
}