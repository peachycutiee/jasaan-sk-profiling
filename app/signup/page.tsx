"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import HCaptcha from "@hcaptcha/react-hcaptcha"; // Import hCaptcha

export default function Signup() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [captchaToken, setCaptchaToken] = useState(""); // Store hCaptcha token
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError("");

    if (!captchaToken) {
      setError("Please complete the hCaptcha verification.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });
    
    if (error) {
      setError(error.message); // Display error to the user
    } else {
      console.log("User signed up:", data.user);
      router.push("/dashboard"); // Redirect after successful signup
    }    

    router.push("/dashboard");
  };

  return (
    <div className="flex h-screen items-center justify-center">
      {/* Left Side - Logo */}
      <div className="w-1/2 flex justify-center items-center">
        <Image src="/jasaan-logo.png" width={1000} height={1000} alt="Municipality of Jasaan" className="w-64" />
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

          {/* hCaptcha Widget */}
          <div className="mb-4 flex justify-center">
            <HCaptcha
              sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY as string}
              onVerify={setCaptchaToken} // Save hCaptcha token
            />
          </div>

          {/* Display Error Message */}
          {error && <p className="text-red-500 text-center">{error}</p>}

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
