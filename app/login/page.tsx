"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import HCaptcha from "@hcaptcha/react-hcaptcha"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [captchaToken, setCaptchaToken] = useState("") // Store hCaptcha token
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY
  if (!siteKey) {
    console.error("🚨 hCaptcha site key is missing in environment variables.")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!captchaToken) {
      setError("Please complete the hCaptcha verification.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      console.log("🔄 Sending login request to API...")
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, captchaToken }),
      })

      const data = await response.json()
      console.log("📥 Login API response:", {
        status: response.status,
        success: data.success,
        error: data.error || "none",
      })

      if (!response.ok) {
        throw new Error(data.error || "Login failed.")
      }

      // Store user data in localStorage or sessionStorage
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user))
        console.log("✅ Login successful, redirecting to dashboard")
        router.push("/dashboard") // Redirect on success
      } else {
        throw new Error("No user data returned")
      }
    } catch (err) {
      console.error("❌ Login Error:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred.")
      setCaptchaToken("") // Reset hCaptcha token on failure
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      {/* Left Side - Logo */}
      <div className="w-1/2 flex justify-center items-center">
        <Image src="/jasaan-logo.png" width={1000} height={1000} alt="Municipality of Jasaan" className="w-64" />
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
            {siteKey && (
              <HCaptcha
                sitekey={siteKey}
                onVerify={(token: string) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken("")}
              />
            )}
          </div>

          {/* Forgot Password Link */}
          <p className="text-right text-sm text-red-500 cursor-pointer">Forgot Password?</p>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-full mt-4 text-lg font-bold"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          {/* Display error message if login fails */}
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}

          {/* Sign Up Link */}
          <div className="mt-4 flex justify-center w-full">
            <Link href="/signup">
              <span className="text-black">
                Don&apos;t have an account? <span className="text-red-600 font-bold cursor-pointer">Sign Up</span>
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
