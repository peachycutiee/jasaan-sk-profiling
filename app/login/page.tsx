"use client";

import { useState } from "react";
import { signIn } from "@/app/auth/auth"; // Import authentication function
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script"; // Import Script for hCaptcha
import HCaptcha from "@hcaptcha/react-hcaptcha"; // Import hCaptcha React component

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState(""); // Store hCaptcha token
  const [error, setError] = useState("");
  const router = useRouter();
  const siteKey = "bf886fc0-5aee-4f3c-889e-3ca8a09000a2"; // hCaptcha site key

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      setError("Please complete the hCaptcha verification.");
      return;
    }

    try {
      await signIn(email, password);
      router.push("/dashboard"); // Redirect to dashboard on success
    } catch (err: unknown) {  
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }    
  };

  return (
    <div className="flex h-screen items-center justify-center">
      {/* Load hCaptcha script */}
      <Script src="https://js.hcaptcha.com/1/api.js" async defer />

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

      {/* Right Side - Login Form */}
      <div className="w-1/2 flex flex-col items-left p-10">
        <h1 className="text-4xl font-bold text-red-600">Welcome!</h1>
        <p className="text-gray-700">Monitor Jasaan Population</p>

        <form onSubmit={handleLogin} className="mt-6 w-full max-w-md">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded-full mb-4"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border rounded-full mb-2"
          />

          {/* hCaptcha Widget */}
          <div className="mb-4 flex justify-center">
            <HCaptcha
              sitekey={siteKey}
              onVerify={setCaptchaToken} // Save hCaptcha token when verified
            />
          </div>

          {/* Forgot Password Link */}
          <p className="text-right text-sm text-red-500 cursor-pointer">
            Forgot Password?
          </p>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-full mt-4 text-lg font-bold"
          >
            Login
          </button>

          {/* Display error message if login fails */}
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}

          {/* Sign Up Link */}
          <div className="mt-4 flex justify-center w-full">
            <Link href="/signup">
              <span className="text-black">
                Don’t have an account?{" "}
                <span className="text-red-600 font-bold cursor-pointer">
                  Sign Up
                </span>
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
