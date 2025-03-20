import NextAuth from "next-auth"
import { SupabaseAdapter } from "@auth/supabase-adapter"
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [],
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL || "default_supabase_url",
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY || "default_supabase_secret",
  }),
})