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

import { useLanguage } from "@/context/language-context";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setRole, setUser } = useRole();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const isFormValid = email.length > 0 && password.length > 0;

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const user = await response.json();
        setRole(user.role);
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));

        // Show success toast with user's name
        let welcomeMsg = "";
        if (user.role === "Admin") welcomeMsg = t("login.welcome_admin");
        else if (user.role === "Sub-Admin") welcomeMsg = t("login.welcome_subadmin");
        else welcomeMsg = t("login.welcome_farmer");

        toast({ 
          title: t("login.success_title"), 
          description: `${welcomeMsg} (${user.name})` 
        });
        
        if (user.role === "Farmer") {
          if (user.isProfileComplete === 0) {
            setLocation("/auth/complete-profile");
          } else {
            setLocation("/dashboard/farmer");
          }
        } else {
          setLocation("/dashboard");
        }
      } else {
        const errorData = await response.json();
        toast({ 
          title: t("login.failed_title"), 
          description: errorData.error || t("login.failed_desc"), 
          variant: "destructive" 
        });
      }
    } catch (error) {
      toast({ 
        title: t("login.failed_title"), 
        description: "Connection error. Please ensure the server is running.", 
        variant: "destructive" 
      });
    }
  };

  return (
    <AuthLayout subtitle={t("auth.admin_portal")}>
      <div className="space-y-6 px-2 pb-6">
        <div className="space-y-4">
          <InputGroup className="h-14 rounded-2xl border-slate-300">
            <InputGroupAddon className="text-primary pl-4">
              <Mail className="w-6 h-6" />
            </InputGroupAddon>
            <InputGroupInput 
              type="email" 
              placeholder={t("login.email_placeholder")} 
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
              placeholder={t("login.password_placeholder")} 
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
          {t("login.button")}
        </Button>

        <div className="flex flex-col items-center space-y-4 pt-2">
          <div className="text-slate-600 font-medium">
            {t("login.no_account")}{" "}
            <Link href="/auth/signup" className="text-primary hover:underline font-bold ml-1">
              {t("login.signup_link")}
            </Link>
          </div>
          
          <Link href="/auth/forget-password">
            <a className="text-slate-400 hover:text-primary text-sm font-medium transition-colors">
              {t("login.forgot_password")}
            </a>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
