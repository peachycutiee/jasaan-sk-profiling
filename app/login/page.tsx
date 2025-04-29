"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import HCaptchaComponent from "../components/hcaptcha-component";

const LoginPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [error, setError] = useState("");
  const [captchaWarning, setCaptchaWarning] = useState(""); // 🛠 New: Captcha expired message
  const [captchaRefreshing, setCaptchaRefreshing] = useState(false); // 🛠 New: Loading spinner
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(0); // Used to reset captcha widget

  const resetCaptcha = () => {
    setCaptchaToken("");
    setCaptchaWarning(""); // Clear warning too
    setCaptchaRefreshing(true); // Start spinner
    setCaptchaKey((prevKey) => prevKey + 1);

    // Hide spinner after a short delay (simulate captcha re-rendering time)
    setTimeout(() => {
      setCaptchaRefreshing(false);
    }, 1000); // 1 second
  };

  const shouldShowCaptcha = email.trim() !== "" && password.trim() !== "";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      setError("Please complete the hCaptcha verification.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const currentCaptchaToken = captchaToken;
      setCaptchaToken("");

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, captchaToken: currentCaptchaToken }),
      });

      const data = await response.json();
      console.log("Server response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Login failed.");
      }

      if (data.user) {
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } else {
        throw new Error("No user data returned.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
      resetCaptcha(); // ✅ Always reset captcha after attempt
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      {/* Left - Logo */}
      <div className="w-1/2 flex justify-center items-center">
        <Image
          src="/jasaan-logo.png"
          width={1000}
          height={1000}
          alt="Municipality of Jasaan"
          className="w-64"
        />
      </div>

      <div className="w-px h-3/4 bg-gray-300"></div>

      {/* Right - Form */}
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

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border rounded-full mb-4 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 py-2 text-gray-500 hover:text-red-600 focus:outline-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Captcha */}
          {shouldShowCaptcha && (
            <div className="mb-4 flex flex-col items-center justify-center">
              {captchaRefreshing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin border-red-600"></div>
                  <span className="text-red-600">Refreshing captcha...</span>
                </div>
              ) : (
                <HCaptchaComponent
                  key={captchaKey}
                  onVerify={(token: string) => {
                    setCaptchaToken(token);
                    setCaptchaWarning(""); // Clear warning on success
                  }}
                  onExpire={() => {
                    setCaptchaWarning("Captcha expired. Please try again.");
                    resetCaptcha();
                  }}
                  onError={() => {
                    setCaptchaWarning("Captcha error occurred. Please try again.");
                    resetCaptcha();
                  }}
                />
              )}

              {/* Warning if captcha expired or error */}
              {captchaWarning && (
                <p className="text-red-500 text-sm mt-2">{captchaWarning}</p>
              )}
            </div>
          )}

          {/* Display general error */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-full mt-4 text-lg font-bold disabled:bg-gray-400"
            disabled={isLoading || !captchaToken}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <div className="mt-4 flex justify-center w-full">
            <Link href="/signup">
              <span className="text-black">
                Don&apos;t have an account?{" "}
                <span className="text-red-600 font-bold cursor-pointer">Sign Up</span>
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
