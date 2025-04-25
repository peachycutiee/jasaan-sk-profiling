import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import HCaptcha from "@hcaptcha/react-hcaptcha";

interface HCaptchaInstance {
  resetCaptcha: () => void;
}

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const captchaRef = useRef<HCaptchaInstance | null>(null);
  const router = useRouter();
  const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

  if (!siteKey) {
    console.error("🚨 hCaptcha site key is missing.");
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      setError("Please complete the hCaptcha verification.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("Sending captchaToken:", captchaToken); // Debugging: Log the captchaToken
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, captchaToken }),
      });

      const data = await response.json();
      console.log("Server response:", data); // Debugging: Log server response

      if (!response.ok) {
        captchaRef.current?.resetCaptcha(); // Reset hCaptcha widget
        setCaptchaToken(""); // Reset captchaToken state
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
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      {/* Left - Logo */}
      <div className="w-1/2 flex justify-center items-center">
        <Image src="/jasaan-logo.png" width={1000} height={1000} alt="Municipality of Jasaan" className="w-64" />
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
              className="w-full p-3 border rounded-full mb-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 py-2 text-gray-500 hover:text-red-600 focus:outline-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* hCaptcha */}
          <div className="mb-4 flex justify-center">
            {siteKey && (
              <HCaptcha
                ref={(el: HCaptchaInstance | null) => (captchaRef.current = el)}
                sitekey={siteKey}
                onVerify={(token: string) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken("")}
                onError={() => setCaptchaToken("")}
              />
            )}
          </div>

          <p className="text-right text-sm text-red-500 cursor-pointer">Forgot Password?</p>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-full mt-4 text-lg font-bold disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          {error && <p className="text-red-500 text-center mt-2">{error}</p>}

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
  );
};

export default LoginPage;