import React, { useState } from "react";
import { Link } from "wouter";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { useRole } from "@/context/role-context";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { 
  InputGroup, 
  InputGroupAddon, 
  InputGroupInput, 
  InputGroupButton 
} from "@/components/ui/input-group";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setRole } = useRole();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const isFormValid = email.length > 0 && password.length > 0;

  const handleLogin = () => {
    if (email === "admin@aquavera.gov.in" && password === "admin123") {
      setRole("Admin");
      toast({ title: "Login Successful", description: "Welcome back, Admin." });
      setLocation("/dashboard");
    } else if (email === "subadmin@aquavera.gov.in" && password === "subadmin123") {
      setRole("Sub-Admin");
      toast({ title: "Login Successful", description: "Welcome back, Sub-Admin." });
      setLocation("/dashboard");
    } else {
      toast({ 
        title: "Login Failed", 
        description: "Invalid email or password. Use the provided demo credentials.", 
        variant: "destructive" 
      });
    }
  };

  return (
    <AuthLayout subtitle="ADMIN PORTAL">
      <div className="space-y-6 px-2 pb-6">
        <div className="space-y-4">
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

          <InputGroup className="h-14 rounded-2xl border-slate-300">
            <InputGroupAddon className="text-primary pl-4">
              <Lock className="w-6 h-6" />
            </InputGroupAddon>
            <InputGroupInput 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              className="text-lg placeholder:text-primary/60 text-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputGroupAddon align="inline-end" className="pr-2">
              <InputGroupButton 
                variant="ghost" 
                size="icon-sm"
                onClick={() => setShowPassword(!showPassword)}
                className="text-primary hover:bg-transparent"
              >
                {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>

        <Button 
          onClick={handleLogin}
          className={`w-full h-14 text-xl font-semibold rounded-2xl transition-all duration-300 ${
            isFormValid ? "bg-primary hover:bg-primary/90 text-white" : "bg-slate-200 text-slate-400"
          }`}
          disabled={!isFormValid}
        >
          Log In
        </Button>

        <div className="flex flex-col items-center space-y-4 pt-2">
          <div className="text-slate-600 font-medium">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline font-bold ml-1">
              Sign Up
            </Link>
          </div>
          
          <Link href="/auth/forgot-password">
            <a className="text-slate-400 hover:text-primary text-sm font-medium transition-colors">
              Forgot Password?
            </a>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
