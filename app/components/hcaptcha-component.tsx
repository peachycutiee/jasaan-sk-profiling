"use client";

import { forwardRef } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

interface HCaptchaComponentProps {
  onVerify?: (token: string) => void;
  onExpire?: () => void; 
  onError?: () => void; 
}

const HCaptchaComponent = forwardRef<HTMLDivElement, HCaptchaComponentProps>((props, ref) => {
  const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

  if (!siteKey) {
    return <p className="text-red-500">Error: hCaptcha site key is not configured.</p>;
  }

  return (
    <div>
      <HCaptcha
        ref={ref}
        sitekey={siteKey}
        onVerify={(token: string) => {
          if (props.onVerify) props.onVerify(token);
        }}
        onExpire={() => {
          if (props.onExpire) props.onExpire();
        }}
        onError={() => {
          if (props.onError) props.onError();
        }}
      />
    </div>
  );
});

HCaptchaComponent.displayName = "HCaptchaComponent";

export default HCaptchaComponent;
