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
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate captcha
    if (!captchaToken) {
      setError("Please complete the hCaptcha verification.");
      setIsLoading(false);
      return;
    }

    try {
      // Sign up the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.fullName, // Optional: Store additional user data
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      console.log("User signed up:", data.user);
      router.push("/dashboard"); // Redirect after successful signup
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message); // Display error to the user
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      {/* Left Side - Logo */}
      <div className="w-1/2 flex justify-center items-center">
        <Image
          src="/jasaan-logo.png"
          width={1000}
          height={1000}
          alt="Municipality of Jasaan"
          className="w-64"
        />
      </div>

      {/* Vertical Divider */}
      <div className="w-px h-3/4 bg-gray-300"></div>

      {/* Right Side - Signup Form */}
      <div className="w-1/2 flex flex-col items-left p-10">
        <h1 className="text-4xl font-bold text-red-600">Welcome!</h1>
        <p className="text-gray-700">Monitor Jasaan Population</p>

        <form className="mt-6 w-full max-w-md">
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
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-full mb-4 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 py-2 text-gray-500 hover:text-red-600 focus:outline-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

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
            disabled={isLoading}
            className="w-full bg-red-600 text-white py-3 rounded-full mt-4 text-lg font-bold disabled:bg-gray-400"
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>

          <div className="mt-4 flex justify-center w-full">
            <Link href="/login">
              <span className="text-black">
                Already have an account?{" "}
                <span className="text-red-600 font-bold cursor-pointer">
                  Login
                </span>
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}