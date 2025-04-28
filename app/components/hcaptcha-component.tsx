"use client"; // Mark this file as a client component

import { useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

interface HCaptchaComponentProps {
  onVerify?: (token: string) => void; // Optional prop for handling verification
}

const HCaptchaComponent = ({ onVerify }: HCaptchaComponentProps) => {
  const [error, setError] = useState<string | null>(null);

  // Load the site key from environment variables
  const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

  if (!siteKey) {
    return <p className="text-red-500">Error: hCaptcha site key is not configured.</p>;
  }

  return (
    <div>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <HCaptcha
          sitekey={siteKey}
          onVerify={(token: string) => {
            if (onVerify) {
              onVerify(token); // Pass the token to the parent component
            }
          }}
          onError={() => setError("An unexpected error occurred during hCaptcha verification.")}
        />
      )}
    </div>
  );
};

export default HCaptchaComponent;