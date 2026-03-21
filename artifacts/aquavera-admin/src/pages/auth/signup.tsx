import React, { useState } from "react";
import { Link } from "wouter";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { 
  InputGroup, 
  InputGroupAddon, 
  InputGroupInput, 
  InputGroupButton 
} from "@/components/ui/input-group";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
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

  return (
    <AuthLayout subtitle="FARMER REGISTRATION">
      <div className="space-y-4 px-2 pb-6">
        <InputGroup className="h-14 rounded-2xl border-slate-300">
          <InputGroupAddon className="text-primary pl-4">
            <User className="w-6 h-6" />
          </InputGroupAddon>
          <InputGroupInput 
            name="fullName"
            placeholder="Full Name" 
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
            placeholder="Email Address" 
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
            placeholder="Phone Number" 
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
            placeholder="Password" 
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
            placeholder="Confirm Password" 
            className="text-lg placeholder:text-primary/60 text-primary"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </InputGroup>

        <div className="pt-2">
          <Button 
            className={`w-full h-14 text-xl font-semibold rounded-2xl transition-all duration-300 ${
              isFormValid ? "bg-primary hover:bg-primary/90 text-white" : "bg-primary text-white"
            }`}
          >
            Create Account
          </Button>
        </div>

        <div className="flex justify-center pt-2">
          <div className="text-slate-600 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-bold ml-1">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
