import { useState, useEffect } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const HCaptchaComponent = () => {
  const [siteKey, setSiteKey] = useState(""); // State to store the hCaptcha site key
  const [error, setError] = useState<string | null>(null); // State to store any errors during API calls

  useEffect(() => {
    const fetchSiteKey = async () => {
      try {
        const response = await fetch("/api/get-hcaptcha-key"); // Fetch the site key from the API endpoint
        if (!response.ok) {
          throw new Error(`Failed to fetch site key: ${response.status}`);
        }
        const data = await response.json();
        setSiteKey(data.siteKey); // Save the site key for rendering the hCaptcha component
      } catch (error) {
        console.error("Failed to fetch hCaptcha site key:", error);
        setError((error as Error).message); // Set error message if the fetch fails
      }
    };

    fetchSiteKey();
  }, []);

  return (
    <div>
      {error ? (
        <p className="text-red-500">Error: {error}</p> // Display error if it occurs
      ) : siteKey ? (
        <HCaptcha
          sitekey={siteKey}
          onVerify={(token: string) => console.log("Captcha token:", token)} // Log the verification token
        />
      ) : (
        <p>Loading hCaptcha...</p> // Show a loading message until the site key is fetched
      )}
    </div>
  );
};

export default HCaptchaComponent;
