"use client";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa"; // Profile Icon
import Image from 'next/image';

export default function Dashboard() {
  // Mock Data
  const youthData = {
    childYouth: 419,
    coreYouth: 359,
    youngAdult: 301,
  };

  const childYouthBreakdown = [
    { label: "IN-SCHOOL", count: 419 },
    { label: "OUT-OF-SCHOOL", count: 359 },
    { label: "WORKING YOUTH", count: 301 },
    { label: "WITH SPECIAL NEEDS", count: 308 },
  ];

  const coreYouthBreakdown = [
    { label: "IN-SCHOOL", count: 419 },
    { label: "OUT-OF-SCHOOL", count: 359 },
    { label: "WORKING YOUTH", count: 301 },
    { label: "WITH SPECIAL NEEDS", count: 308 },
  ];

  const youngAdultBreakdown = [
    { label: "IN-SCHOOL", count: 350 },
    { label: "OUT-OF-SCHOOL", count: 290 },
    { label: "WORKING YOUTH", count: 280 },
    { label: "WITH SPECIAL NEEDS", count: 250 },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (Fixed) */}
      <aside className="w-64 bg-red-700 text-white flex flex-col p-6 fixed h-screen">
        {/* Logo */}
        <div className="flex items-center space-x-2 mb-10">
          <Image src="/jasaan-logo.png" width={500} height={500} alt="Logo" className="w-14"/>
          <h1 className="text-lg font-bold">POPCOM JASAAN</h1>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-4 flex-1">
          <Link href="/dashboard" className="block font-bold">OVERVIEW</Link>
          <Link href="/manage-data" className="block hover:underline">MANAGE DATA</Link>
          <Link href="/reports" className="block hover:underline">REPORTS</Link>
          <Link href="/settings" className="block hover:underline">SETTINGS</Link>
        </nav>

        {/* Logout */}
        <button className="mt-auto text-left text-sm">LOGOUT</button>
      </aside>

      {/* Main Content (Scrollable) */}
      <main className="flex-1 p-10 ml-64 overflow-y-auto h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">
            <span className="text-red-600">Welcome</span> Admin
          </h2>
          <FaUserCircle className="text-4xl text-gray-700" />
        </div>
        <hr className="border-t border-red-500 my-6" />

        {/* Youth Population Section (More Spacing & Stand Out) */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-center">YOUTH POPULATION</h3>
          <div className="grid grid-cols-3 gap-8">
            {Object.entries(youthData).map(([key, value]) => (
              <div key={key} className="p-8 border-4 border-red-500 rounded-lg text-center shadow-md bg-white">
                <h4 className="font-bold text-red-600 text-lg">{key.replace(/([A-Z])/g, " $1").toUpperCase()}</h4>
                <p className="text-4xl font-bold text-red-600">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Scrollable Youth Data Section (Reduced Height & Padding) */}
        <div className="max-h-[75vh] overflow-y-auto space-y-6">
          {/* Child Youth Section */}
          <section>
            <h3 className="text-lg font-bold mb-3">CHILD YOUTH</h3>
            <hr className="border-t border-red-500 mb-3" />
            <div className="grid grid-cols-4 gap-3">
              {childYouthBreakdown.map((item) => (
                <div key={item.label} className="p-4 border-2 border-red-500 rounded-lg text-center bg-white">
                  <h4 className="font-semibold text-red-600">{item.label}</h4>
                  <p className="text-2xl font-bold text-red-600">{item.count}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Core Youth Section */}
          <section>
            <h3 className="text-lg font-bold mb-3">CORE YOUTH</h3>
            <hr className="border-t border-red-500 mb-3" />
            <div className="grid grid-cols-4 gap-3">
              {coreYouthBreakdown.map((item) => (
                <div key={item.label} className="p-4 border-2 border-red-500 rounded-lg text-center bg-white">
                  <h4 className="font-semibold text-red-600">{item.label}</h4>
                  <p className="text-2xl font-bold text-red-600">{item.count}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Young Adult Section */}
          <section>
            <h3 className="text-lg font-bold mb-3">YOUNG ADULT</h3>
            <hr className="border-t border-red-500 mb-3" />
            <div className="grid grid-cols-4 gap-3">
              {youngAdultBreakdown.map((item) => (
                <div key={item.label} className="p-4 border-2 border-red-500 rounded-lg text-center bg-white">
                  <h4 className="font-semibold text-red-600">{item.label}</h4>
                  <p className="text-2xl font-bold text-red-600">{item.count}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
