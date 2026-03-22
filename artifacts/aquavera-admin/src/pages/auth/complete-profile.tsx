import React, { useState } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";
import { 
  User, 
  MapPin, 
  Landmark, 
  ShieldCheck, 
  ArrowRight,
  FileText,
  BadgeCheck,
  Building2,
  ChevronDown
} from "lucide-react";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const MAHARASHTRA_TALUKAS = [
  "Nashik", "Niphad", "Sinnar", "Yeola", "Igatpuri", "Baramati", 
  "Dindori", "Baglan", "Chandwad", "Kalwan", "Malegaon", "Nandgaon",
  "Peint", "Surgana", "Trimbakeshwar", "Haveli", "Indapur", "Junnar",
  "Khed", "Maval", "Mulshi", "Shirur", "Velhe", "Ambegaon", "Bhor"
];

const COMMON_CITIES = [
  "Nashik City", "Niphad Town", "Baramati City", "Dindori Town", "Panchavati", 
  "Satpur", "Sinnar Town", "Pune City", "Mumbai", "Nagpur", "Aurangabad",
  "Ozar", "Lasalgaon", "Manmad", "Vinchur", "Pimpalgaon Baswant"
];

export default function CompleteProfile() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    aadhaar: "",
    landRecordId: "",
    plotNumber: "",
    state: "Maharashtra",
    city: "",
    taluka: "",
    pinCode: "",
    surveyNumber: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "aadhaar") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 12);
      setFormData({ ...formData, [name]: digitsOnly });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const isFormValid = Object.values(formData).every(val => val && val.trim().length > 0);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) throw new Error("User session not found");
      const user = JSON.parse(userStr);

      const response = await fetch(`/api/users/profile/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem("user", JSON.stringify(updatedUser)); 
        toast({ 
          title: t("signup.success_title"), 
          description: t("signup.success_desc").replace("{name}", user.name)
        });
        setLocation("/dashboard/farmer");
      } else {
        const err = await response.json();
        throw new Error(err.error || "Failed to update profile");
      }
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-1 p-8 max-w-5xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-200">
            <BadgeCheck className="w-3.5 h-3.5" /> {t("profile.id_req")}
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {t("profile.establish")}
          </h1>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">
            {t("profile.doc_sync")}
          </p>
        </div>

        <div className="grid gap-8">
          {/* Section 1: Personal & Land Identity */}
          <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-slate-200/50">
            <div className="bg-slate-900 px-8 py-6 flex items-center justify-between rounded-t-[2.5rem]">
              <div className="flex items-center gap-4 text-white">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-lg">{t("profile.identity_assets")}</h3>
                  <p className="text-slate-400 text-xs font-medium">{t("profile.verify_ownership")}</p>
                </div>
              </div>
              <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{t("common.section")} 01</div>
            </div>
            <CardContent className="p-10 grid md:grid-cols-2 gap-8 bg-white rounded-b-[2.5rem]">
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t("profile.aadhaar_label")}</label>
                <InputGroup className="h-14 rounded-2xl border-slate-200 bg-slate-50 focus-within:bg-white transition-colors">
                  <InputGroupInput 
                    name="aadhaar"
                    type="text"
                    inputMode="numeric"
                    placeholder="12 Digit Aadhaar Number" 
                    className="text-lg placeholder:text-slate-400 text-slate-800"
                    value={formData.aadhaar}
                    onChange={handleChange}
                  />
                </InputGroup>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t("profile.land_record_label")}</label>
                <InputGroup className="h-14 rounded-2xl border-slate-200 bg-slate-50 focus-within:bg-white transition-colors">
                  <InputGroupInput 
                    name="landRecordId"
                    placeholder="Land Registration Number" 
                    className="text-lg placeholder:text-slate-400 text-slate-800"
                    value={formData.landRecordId}
                    onChange={handleChange}
                  />
                </InputGroup>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t("profile.survey_number")}</label>
                <InputGroup className="h-14 rounded-2xl border-slate-200 bg-slate-50 focus-within:bg-white transition-colors">
                  <InputGroupInput 
                    name="surveyNumber"
                    placeholder="Enter Govt. Survey No." 
                    className="text-lg placeholder:text-slate-400 text-slate-800"
                    value={formData.surveyNumber}
                    onChange={handleChange}
                  />
                </InputGroup>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t("profile.plot_number")}</label>
                <InputGroup className="h-14 rounded-2xl border-slate-200 bg-slate-50 focus-within:bg-white transition-colors">
                  <InputGroupInput 
                    name="plotNumber"
                    placeholder="Land Plot Identifier" 
                    className="text-lg placeholder:text-slate-400 text-slate-800"
                    value={formData.plotNumber}
                    onChange={handleChange}
                  />
                </InputGroup>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Regional Location */}
          <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-slate-200/50">
            <div className="bg-slate-900 px-8 py-6 flex items-center justify-between rounded-t-[2.5rem]">
              <div className="flex items-center gap-4 text-white">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-lg">{t("profile.regional_placement")}</h3>
                  <p className="text-slate-400 text-xs font-medium">{t("profile.irrigation_zone")}</p>
                </div>
              </div>
              <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{t("common.section")} 02</div>
            </div>
            <CardContent className="p-10 grid md:grid-cols-2 gap-8 bg-white rounded-b-[2.5rem]">
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">State</label>
                <Select value={formData.state} onValueChange={(val) => handleSelectChange('state', val)}>
                  <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white transition-colors text-lg text-slate-800 px-5">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 max-h-[300px] bg-white">
                    {INDIAN_STATES.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">City / Village</label>
                <Select value={formData.city} onValueChange={(val) => handleSelectChange('city', val)}>
                  <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white transition-colors text-lg text-slate-800 px-5">
                    <SelectValue placeholder="Select City / Village" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 max-h-[300px] bg-white">
                    {COMMON_CITIES.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Taluka</label>
                <Select value={formData.taluka} onValueChange={(val) => handleSelectChange('taluka', val)}>
                  <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white transition-colors text-lg text-slate-800 px-5">
                    <SelectValue placeholder="Select Taluka" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 max-h-[300px] bg-white">
                    {MAHARASHTRA_TALUKAS.map(taluka => (
                      <SelectItem key={taluka} value={taluka}>{taluka}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Pin Code</label>
                <InputGroup className="h-14 rounded-2xl border-slate-200 bg-slate-50 focus-within:bg-white transition-colors">
                  <InputGroupInput 
                    name="pinCode"
                    placeholder="6-Digit Postal Code" 
                    className="text-lg placeholder:text-slate-400 text-slate-800"
                    value={formData.pinCode}
                    onChange={handleChange}
                  />
                </InputGroup>
              </div>
            </CardContent>
          </Card>

          {/* Submission Area */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 pb-12">
            <div className="flex items-center gap-3 text-slate-400 text-xs font-medium max-w-md">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              {t("profile.encrypted_sync")}
            </div>
            <Button 
              onClick={handleSubmit}
              className={`h-16 px-12 text-xl font-bold rounded-[1.5rem] transition-all duration-500 min-w-[280px] group ${
                isFormValid 
                  ? "bg-slate-900 border-none hover:bg-emerald-600 text-white shadow-2xl shadow-emerald-500/20" 
                  : "bg-slate-200 text-slate-400 pointer-events-none"
              }`}
              disabled={!isFormValid || loading}
            >
              {loading ? t("signup.creating") : (
                <span className="flex items-center gap-3">
                  {t("profile.submit_verification")}
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
