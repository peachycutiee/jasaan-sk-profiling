"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

// Reusable Youth Category Component
const YouthCategory = ({ title, data }: { title: string; data: { label: string; count: number }[] }) => (
  <section>
    <h3 className="text-lg font-bold mb-3">{title}</h3>
    <hr className="border-t border-red-500 mb-3" />
    <div className="grid grid-cols-4 gap-3">
      {data.map((item) => (
        <div key={item.label} className="p-4 border-2 border-red-500 rounded-lg text-center bg-white">
          <h4 className="font-semibold text-red-600">{item.label}</h4>
          <p className="text-2xl font-bold text-red-600">{item.count}</p>
        </div>
      ))}
    </div>
  </section>
);

export default function Dashboard() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const router = useRouter();
  const supabase = createPagesBrowserClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login"); // Redirect if not logged in
      } else {
        setUser(user.email ? { email: user.email } : null);
      }
    };
    fetchUser();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Youth Population Data
  const youthData = {
    "Child Youth": 419,
    "Core Youth": 359,
    "Young Adult": 301,
  };

  const youthBreakdowns = {
    "Child Youth": [
      { label: "IN-SCHOOL", count: 419 },
      { label: "OUT-OF-SCHOOL", count: 359 },
      { label: "WORKING YOUTH", count: 301 },
      { label: "WITH SPECIAL NEEDS", count: 308 },
    ],
    "Core Youth": [
      { label: "IN-SCHOOL", count: 419 },
      { label: "OUT-OF-SCHOOL", count: 359 },
      { label: "WORKING YOUTH", count: 301 },
      { label: "WITH SPECIAL NEEDS", count: 308 },
    ],
    "Young Adult": [
      { label: "IN-SCHOOL", count: 350 },
      { label: "OUT-OF-SCHOOL", count: 290 },
      { label: "WORKING YOUTH", count: 280 },
      { label: "WITH SPECIAL NEEDS", count: 250 },
    ],
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-red-700 text-white flex flex-col p-6 fixed h-screen">
        <div className="flex items-center space-x-2 mb-10">
          <Image src="/jasaan-logo.png" width={500} height={500} alt="Logo" className="w-14" />
          <h1 className="text-lg font-bold">POPCOM JASAAN</h1>
        </div>

        <nav className="space-y-4 flex-1">
          <Link href="/dashboard" className="block font-bold">
            OVERVIEW
          </Link>
          <Link href="/manage-data" className="block hover:underline">
            MANAGE DATA
          </Link>
          <Link href="/reports" className="block hover:underline">
            REPORTS
          </Link>
          <Link href="/settings" className="block hover:underline">
            SETTINGS
          </Link>
        </nav>

        <button onClick={handleLogout} className="mt-auto text-left text-sm">
          LOGOUT
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 ml-64 overflow-y-auto h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">
            <span className="text-red-600">Welcome</span> {user ? user.email : "Admin"}
          </h2>
          <FaUserCircle className="text-4xl text-gray-700" />
        </div>
        <hr className="border-t border-red-500 my-6" />

        {/* Youth Population Section */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-center">YOUTH POPULATION</h3>
          <div className="grid grid-cols-3 gap-8">
            {Object.entries(youthData).map(([key, value]) => (
              <div key={key} className="p-8 border-4 border-red-500 rounded-lg text-center shadow-md bg-white">
                <h4 className="font-bold text-red-600 text-lg">{key.toUpperCase()}</h4>
                <p className="text-4xl font-bold text-red-600">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Scrollable Youth Data Section */}
        <div className="max-h-[75vh] overflow-y-auto space-y-6">
          {Object.entries(youthBreakdowns).map(([key, data]) => (
            <YouthCategory key={key} title={key} data={data} />
          ))}
        </div>
      </main>
    </div>
  );
}
