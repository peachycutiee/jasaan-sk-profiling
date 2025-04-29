"use client"; // Mark this file as a client component

import { useState, forwardRef } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

interface HCaptchaComponentProps {
  onVerify?: (token: string) => void; // Optional prop for handling verification
}

// Use forwardRef to pass the ref to the HCaptcha widget
const HCaptchaComponent = forwardRef<HTMLDivElement, HCaptchaComponentProps>((props, ref) => {
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
          ref={ref} // Forward the ref to manage the hCaptcha widget
          sitekey={siteKey}
          onVerify={(token: string) => {
            if (props.onVerify) {
              props.onVerify(token); // Pass the token to the parent component
            }
          }}
          onError={() => setError("An unexpected error occurred during hCaptcha verification.")}
        />
      )}
    </div>
  );
});

// Add a display name for better debugging
HCaptchaComponent.displayName = "HCaptchaComponent";

export default HCaptchaComponent;