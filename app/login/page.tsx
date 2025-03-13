import React from 'react';
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      {/* Left Side - Logo */}
      <div className="w-1/2 flex justify-center items-center">
        <img src="/jasaan-logo.png" alt="Municipality of Jasaan" className="w-64" />
      </div>

      {/* Vertical Divider */}
      <div className="w-px h-3/4 bg-gray-300"></div>

      {/* Right Side - Login Form */}
      <div className="w-1/2 flex flex-col items-left p-10">
        <h1 className="text-4xl font-bold text-red-600">Welcome!</h1>
        <p className="text-gray-700">Monitor Jasaan Population</p>

        <div className="mt-6 w-full max-w-md">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-full mb-4"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-full mb-2"
          />
          <p className="text-right text-sm text-red-500 cursor-pointer">
            Forgot Password?
          </p>

          <button className="w-full bg-red-600 text-white py-3 rounded-full mt-4 text-lg font-bold">
            Login
          </button>

          <div className="mt-4 flex justify-center w-full">
            <Link href="/signup">
                <span className="text-black">
                Don’t have an account?{" "}
                <span className="text-red-600 font-bold cursor-pointer">Sign Up</span>
                </span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
