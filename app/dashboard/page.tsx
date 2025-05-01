"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";

// Reusable component for youth categories
const YouthCategory = ({
  title,
  data,
}: {
  title: string;
  data: { label: string; count: number }[];
}) => (
  <section>
    <h3 className="text-lg font-bold mb-3">{title}</h3>
    <hr className="border-t border-red-500 mb-3" />
    <div className="grid grid-cols-4 gap-3">
      {data.length > 0 ? (
        data.map((item) => (
          <div
            key={item.label}
            className="p-4 border-2 border-red-500 rounded-lg text-center bg-white hover:bg-gray-50 transition-colors"
          >
            <h4 className="font-semibold text-red-600">{item.label}</h4>
            <p className="text-2xl font-bold text-red-600">{item.count}</p>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No data available.</p>
      )}
    </div>
  </section>
);

export default function Dashboard() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [youthData, setYouthData] = useState<Record<string, { label: string; count: number }[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let supabase: SupabaseClient | null = null;

  if (supabaseUrl && supabaseAnonKey) {
    supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
  } else {
    console.error("Supabase credentials are missing. Please check your environment variables.");
  }

  useEffect(() => {
    if (!supabase) return;

    const fetchUserAndData = async () => {
      try {
        // Fetch user session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          console.error("Session expired or invalid. Redirecting to login...");
          router.push("/login");
          return;
        }

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("User not found. Redirecting to login...");
          router.push("/login");
          return;
        }

        setUser(user.email ? { email: user.email } : null);

        // Fetch youth data
        const { data, error: fetchError } = await supabase.from("youth_data").select("*");

        if (fetchError) throw fetchError;

        // Organize data by category
        const categorized: Record<string, { label: string; count: number }[]> = {};

        for (const row of data || []) {
          const category = row.category;
          const subCategory = row.sub_category;
          const count = row.count;

          if (!categorized[category]) categorized[category] = [];
          categorized[category].push({ label: subCategory, count });
        }

        setYouthData(categorized);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred while fetching data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndData();
  }, [supabase, router]);

  // Logout handler
  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/login");
  };

  // Calculate total counts for each category
  const totalCounts: Record<string, number> = {};
  for (const [category, entries] of Object.entries(youthData)) {
    totalCounts[category] = entries.reduce((sum, item) => sum + item.count, 0);
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-red-700 text-white flex flex-col p-6 fixed h-screen">
        <div className="flex items-center space-x-2 mb-10">
          <Image src="/jasaan-logo.png" width={500} height={500} alt="Logo" className="w-14" />
          <h1 className="text-lg font-bold">POPCOM JASAAN</h1>
        </div>

        <nav className="space-y-4 flex-1">
          <Link href="/dashboard" className="block font-bold hover:text-gray-300 transition-colors">
            OVERVIEW
          </Link>
          <Link href="/manage-data" className="block hover:underline hover:text-gray-300 transition-colors">
            MANAGE DATA
          </Link>
          <Link href="/reports" className="block hover:underline hover:text-gray-300 transition-colors">
            REPORTS
          </Link>
          <Link href="/settings" className="block hover:underline hover:text-gray-300 transition-colors">
            SETTINGS
          </Link>
        </nav>

        <button onClick={handleLogout} className="mt-auto text-left text-sm hover:text-gray-300 transition-colors">
          LOGOUT
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 ml-64 overflow-y-auto h-screen">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">
            <span className="text-red-600">Welcome</span> {user ? user.email : "Admin"}
          </h2>
          <FaUserCircle className="text-4xl text-gray-700" />
        </div>

        <hr className="border-t border-red-500 my-6" />

        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-center">YOUTH POPULATION</h3>
          <div className="grid grid-cols-3 gap-8">
            {Object.entries(totalCounts).map(([category, count]) => (
              <div
                key={category}
                className="p-8 border-4 border-red-500 rounded-lg text-center shadow-md bg-white hover:bg-gray-50 transition-colors"
              >
                <h4 className="font-bold text-red-600 text-lg">{category.toUpperCase()}</h4>
                <p className="text-4xl font-bold text-red-600">{count}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="max-h-[75vh] overflow-y-auto space-y-6">
          {loading ? (
            <p className="text-center text-gray-600">Fetching data...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : Object.keys(youthData).length === 0 ? (
            <p className="text-center text-gray-500">No youth data available.</p>
          ) : (
            Object.entries(youthData).map(([key, data]) => (
              <YouthCategory key={key} title={key} data={data} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}