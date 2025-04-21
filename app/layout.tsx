// app/layout.tsx

import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

// Metadata must be exported from a server component
export const metadata = {
  title: "JASAAN POPULATION",
  description: "Made with Next.JS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Ensure no "use client" directive here */}
        {children}
      </body>
    </html>
  );
}