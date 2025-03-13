"use client";
import { useState } from "react";
import Link from "next/link";

export default function Signup() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Data:", form);
    // Add authentication logic here
  };

  return (
    <div className="flex h-screen items-center justify-center">
      {/* Left Side - Logo */}
      <div className="w-1/2 flex justify-center items-center">
        <img src="/jasaan-logo.png" alt="Municipality of Jasaan" className="w-64" />
      </div>

      {/* Vertical Divider */}
      <div className="w-px h-3/4 bg-gray-300"></div>

      {/* Right Side - Signup Form */}
      <div className="w-1/2 flex flex-col items-left p-10">
        <h1 className="text-4xl font-bold text-red-600">Welcome!</h1>
        <p className="text-gray-700">Monitor Jasaan Population</p>

        <div className="mt-6 w-full max-w-md">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="w-full p-3 border rounded-full mb-4"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-full mb-4"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-full mb-2"
            required
          />

          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-red-600 text-white py-3 rounded-full mt-4 text-lg font-bold"
          >
            Sign Up
          </button>

          <div className="mt-4 flex justify-center w-full">
            <Link href="/login">
                <span className="text-black">
                Already have an account?{" "}
                <span className="text-red-600 font-bold cursor-pointer">Login</span>
                </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
