// lib/createClient.ts
import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Initialize and export the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;