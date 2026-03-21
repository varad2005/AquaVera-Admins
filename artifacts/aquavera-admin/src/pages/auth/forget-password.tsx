import React, { useState } from "react";
import { Link } from "wouter";
import { Mail, ArrowLeft } from "lucide-react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { 
  InputGroup, 
  InputGroupAddon, 
  InputGroupInput 
} from "@/components/ui/input-group";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <AuthLayout subtitle="RECOVERY">
        <div className="space-y-6 px-2 pb-6 text-center">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Mail className="w-10 h-10" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-800">Check your email</h2>
            <p className="text-slate-600 font-medium">
              We've sent password recovery instructions to your email address.
            </p>
          </div>
          <Link href="/auth/login">
            <Button className="w-full h-14 text-xl font-semibold rounded-2xl bg-primary text-white">
              Back to Login
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout subtitle="RECOVERY">
      <div className="space-y-6 px-2 pb-6">
        <div className="space-y-2 text-center">
          <p className="text-slate-600 font-medium">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        <InputGroup className="h-14 rounded-2xl border-slate-300">
          <InputGroupAddon className="text-primary pl-4">
            <Mail className="w-6 h-6" />
          </InputGroupAddon>
          <InputGroupInput 
            type="email" 
            placeholder="Email Address" 
            className="text-lg placeholder:text-primary/60 text-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputGroup>

        <Button 
          className={`w-full h-14 text-xl font-semibold rounded-2xl transition-all duration-300 ${
            email.length > 0 ? "bg-primary hover:bg-primary/90 text-white" : "bg-slate-200 text-slate-400"
          }`}
          disabled={email.length === 0}
          onClick={() => setSubmitted(true)}
        >
          Send Instructions
        </Button>

        <Link href="/auth/login">
          <a className="flex items-center justify-center gap-2 text-slate-400 hover:text-primary text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </a>
        </Link>
      </div>
    </AuthLayout>
  );
}
