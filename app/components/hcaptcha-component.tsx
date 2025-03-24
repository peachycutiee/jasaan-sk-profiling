import { useState, useEffect } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const HCaptchaComponent = () => {
  const [siteKey, setSiteKey] = useState<string>(""); // Explicitly typed state
  const [error, setError] = useState<string | null>(null); // Explicitly typed error state

  useEffect(() => {
    const fetchSiteKey = async () => {
      try {
        const response = await fetch("/api/get-hcaptcha-key"); // Fetch hCaptcha key from API
        if (!response.ok) {
          throw new Error(`Failed to fetch site key: ${response.status}`);
        }
        const data = await response.json();
        setSiteKey(data.siteKey); // Store site key in state
      } catch (error) {
        console.error("Failed to fetch hCaptcha site key:", error);
        setError((error as Error).message); // Type assertion for error handling
      }
    };

    fetchSiteKey();
  }, []);

  return (
    <div>
      {error ? (
        <p className="text-red-500">Error: {error}</p> // Display error message if any
      ) : siteKey ? (
        <HCaptcha
          sitekey={siteKey}
          onVerify={(token: string) => console.log("Captcha token:", token)} // Explicitly type 'token' as string
        />
      ) : (
        <p>Loading hCaptcha...</p> // Show loading message until site key is fetched
      )}
    </div>
  );
};

export default HCaptchaComponent;
