"use client"; // Add this line

import { useState, useEffect } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const HCaptchaComponent = () => {
  const [siteKey, setSiteKey] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSiteKey = async () => {
      try {
        const response = await fetch("/api/get-hcaptcha-key");
        if (!response.ok) {
          throw new Error(`Failed to fetch site key: ${response.status}`);
        }
        const data = await response.json();
        setSiteKey(data.siteKey);
      } catch (error) {
        console.error("Failed to fetch hCaptcha site key:", error);
        setError((error as Error).message);
      }
    };

    fetchSiteKey();
  }, []);

  return (
    <div>
      {error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : siteKey ? (
        <HCaptcha
          sitekey={siteKey}
          onVerify={(token: string) => console.log("Captcha token:", token)}
        />
      ) : (
        <p>Loading hCaptcha...</p>
      )}
    </div>
  );
};

export default HCaptchaComponent;