import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { useRole } from "@/context/role-context";
import { useToast } from "@/hooks/use-toast";
import { 
  InputGroup, 
  InputGroupAddon, 
  InputGroupInput, 
  InputGroupButton 
} from "@/components/ui/input-group";

import { useLanguage } from "@/context/language-context";
import { API_BASE_URL } from "@/lib/api-config";

export default function SignUp() {
  const { t } = useLanguage();
  const { setRole, setUser } = useRole();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isFormValid = 
    formData.fullName.length > 0 && 
    formData.email.length > 0 && 
    formData.phone.length > 0 && 
    formData.password.length > 0 && 
    formData.password === formData.confirmPassword;

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const user = await response.json();
        setRole(user.role);
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));

        toast({ 
          title: "Account Created!", 
          description: `Welcome ${user.name}! Let's complete your profile.` 
        });
        
        setLocation("/auth/complete-profile");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Signup failed");
      }
    } catch (error: any) {
      toast({ 
        title: "Registration Failed", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout subtitle={t("auth.farmer_registration")}>
      <div className="space-y-4 px-2 pb-6">
        <InputGroup className="h-14 rounded-2xl border-slate-300">
          <InputGroupAddon className="text-primary pl-4">
            <User className="w-6 h-6" />
          </InputGroupAddon>
          <InputGroupInput 
            name="fullName"
            placeholder={t("signup.fullname_placeholder")} 
            className="text-lg placeholder:text-primary/60 text-primary"
            value={formData.fullName}
            onChange={handleChange}
          />
        </InputGroup>

        <InputGroup className="h-14 rounded-2xl border-slate-300">
          <InputGroupAddon className="text-primary pl-4">
            <Mail className="w-6 h-6" />
          </InputGroupAddon>
          <InputGroupInput 
            name="email"
            type="email" 
            placeholder={t("login.email_placeholder")} 
            className="text-lg placeholder:text-primary/60 text-primary"
            value={formData.email}
            onChange={handleChange}
          />
        </InputGroup>

        <InputGroup className="h-14 rounded-2xl border-slate-300">
          <InputGroupAddon className="text-primary pl-4">
            <Phone className="w-6 h-6" />
          </InputGroupAddon>
          <InputGroupInput 
            name="phone"
            type="tel" 
            placeholder={t("signup.phone_placeholder")} 
            className="text-lg placeholder:text-primary/60 text-primary"
            value={formData.phone}
            onChange={handleChange}
          />
        </InputGroup>

        <InputGroup className="h-14 rounded-2xl border-slate-300">
          <InputGroupAddon className="text-primary pl-4">
            <Lock className="w-6 h-6" />
          </InputGroupAddon>
          <InputGroupInput 
            name="password"
            type={showPassword ? "text" : "password"} 
            placeholder={t("login.password_placeholder")} 
            className="text-lg placeholder:text-primary/60 text-primary"
            value={formData.password}
            onChange={handleChange}
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

        <InputGroup className="h-14 rounded-2xl border-slate-300">
          <InputGroupAddon className="text-primary pl-4">
            <Lock className="w-6 h-6" />
          </InputGroupAddon>
          <InputGroupInput 
            name="confirmPassword"
            type={showPassword ? "text" : "password"} 
            placeholder={t("signup.confirm_password")} 
            className="text-lg placeholder:text-primary/60 text-primary"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </InputGroup>

        <div className="pt-2">
          <Button 
            className={`w-full h-14 text-xl font-semibold rounded-2xl transition-all duration-300 ${
              isFormValid ? "bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20" : "bg-slate-200 text-slate-400"
            }`}
            disabled={!isFormValid || loading}
            onClick={handleSignUp}
          >
            {loading ? "Creating Account..." : t("signup.button")}
          </Button>
        </div>

        <div className="flex justify-center pt-2">
          <div className="text-slate-600 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
            {t("signup.already_account")}{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-bold ml-1">
              {t("login.button")}
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
