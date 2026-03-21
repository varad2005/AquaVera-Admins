import React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { useRole } from "@/context/role-context";
import { 
  MapPin, 
  Landmark, 
  Layers,
  Maximize,
  Navigation,
  ShieldCheck,
  FileText,
  Map as MapIcon
} from "lucide-react";
import { format } from "date-fns";

export default function LandSummary() {
  const { user } = useRole();
  if (!user) return null;

  const landDetails = [
    { label: "Survey Number", value: user.surveyNumber || "42/A-1" },
    { label: "7/12 Number", value: user.landRecordId || "MH-NGP-2023-8841" },
    { label: "Plot Number", value: user.plotNumber || "Zone-7/B" },
    { label: "Total Area", value: "5.5 Acres" },
    { label: "State", value: user.state || "Maharashtra" },
    { label: "Taluka", value: user.taluka || "Niphad" },
    { label: "Village/City", value: user.city || "Nashik" },
    { label: "Pincode", value: user.pinCode || "422303" },
  ];

  return (
    <AppLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
              Land Summary
            </h1>
            <p className="text-slate-500 font-medium tracking-tight">Verified agricultural records and plot mapping</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-emerald-100">
            <ShieldCheck className="w-4 h-4" /> Verified by Govt. Grid
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Details Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
              <div className="bg-slate-900 p-6 flex items-center justify-between">
                <h3 className="text-white font-black tracking-tight flex items-center gap-3">
                  <Landmark className="w-5 h-5 text-emerald-400" />
                  Property Particulars
                </h3>
                <button className="text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-white transition-colors">
                  Request Update
                </button>
              </div>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                  {landDetails.map((detail, idx) => (
                    <div key={idx} className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{detail.label}</p>
                      <p className="text-lg font-bold text-slate-800">{detail.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="rounded-3xl border-none shadow-sm p-6 bg-white space-y-4">
                <div className="p-3 w-fit rounded-2xl bg-blue-50 text-blue-600">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 tracking-tight">Soil Composition</h4>
                  <p className="text-xs text-slate-400 font-medium">Loamy Soil - High Water Retention</p>
                </div>
              </Card>
              <Card className="rounded-3xl border-none shadow-sm p-6 bg-white space-y-4">
                <div className="p-3 w-fit rounded-2xl bg-amber-50 text-amber-600">
                  <Navigation className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 tracking-tight">Elevation Profile</h4>
                  <p className="text-xs text-slate-400 font-medium">564m ASL - Gentle Slope North</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Map Column */}
          <div className="space-y-6">
            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 overflow-hidden bg-white aspect-square md:aspect-auto">
              <div className="relative h-full min-h-[400px] bg-slate-100 flex items-center justify-center group overflow-hidden">
                {/* Mock Satellite Map Background */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-20 transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 animate-pulse">
                    <MapIcon className="w-8 h-8" />
                  </div>
                  <p className="text-white font-black tracking-tight text-center">
                    Satellite Live View<br/>
                    <span className="text-[10px] text-emerald-400 uppercase tracking-widest">Plot #42/A-1 Center</span>
                  </p>
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                  <button className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20">
                    <Maximize className="w-5 h-5" />
                  </button>
                  <div className="flex gap-2">
                    <div className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">Live</div>
                    <div className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest">2D View</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="rounded-3xl border-none shadow-sm p-6 bg-slate-900 text-white space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h4 className="font-black tracking-tight">Digital Documents</h4>
              </div>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 cursor-pointer transition-colors">
                  <span className="text-xs font-bold">7/12 Extract (Latest)</span>
                  <span className="text-[9px] font-black text-emerald-400 uppercase">PDF</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 cursor-pointer transition-colors">
                  <span className="text-xs font-bold">Land Map Survey</span>
                  <span className="text-[9px] font-black text-emerald-400 uppercase">JPG</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
