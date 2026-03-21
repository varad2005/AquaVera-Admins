import React, { useState } from "react";
import { Link } from "wouter";
import { ShieldCheck } from "lucide-react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function OTPVerification() {
  const [value, setValue] = useState("");

  return (
    <AuthLayout subtitle="VERIFICATION">
      <div className="space-y-8 px-2 pb-6 flex flex-col items-center">
        <div className="text-center space-y-2">
          <p className="text-slate-600 font-medium">
            We've sent a 6-digit code to your phone number.
          </p>
        </div>

        <InputOTP
          maxLength={6}
          value={value}
          onChange={(value) => setValue(value)}
          className="gap-2"
        >
          <InputOTPGroup className="gap-2">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <InputOTPSlot 
                key={index} 
                index={index} 
                className="w-12 h-14 text-2xl font-bold border-slate-300 rounded-xl text-primary"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <div className="w-full space-y-4">
          <Button 
            className={`w-full h-14 text-xl font-semibold rounded-2xl transition-all duration-300 ${
              value.length === 6 ? "bg-primary hover:bg-primary/90 text-white" : "bg-slate-200 text-slate-400"
            }`}
            disabled={value.length !== 6}
          >
            Verify OTP
          </Button>

          <div className="text-center">
            <button className="text-primary hover:underline font-bold">
              Resend Code
            </button>
          </div>
        </div>

        <Link href="/auth/login">
          <a className="text-slate-400 hover:text-primary text-sm font-medium transition-colors">
            Back to Login
          </a>
        </Link>
      </div>
    </AuthLayout>
  );
}
