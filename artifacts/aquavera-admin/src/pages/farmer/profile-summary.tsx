import React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { useRole } from "@/context/role-context";
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck,
  Edit2,
  Camera,
  Calendar,
  Fingerprint
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfileSummary() {
  const { user } = useRole();
  if (!user) return null;

  return (
    <AppLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
              My Profile
            </h1>
            <p className="text-slate-500 font-medium tracking-tight">Manage your personal and contact verification details</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-emerald-100">
            <ShieldCheck className="w-4 h-4" /> K-Verified Account
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Avatar & Basic Info Card */}
          <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
            <div className="relative h-32 bg-slate-900">
              <div className="absolute -bottom-12 left-8 w-24 h-24 rounded-3xl bg-white p-1.5 shadow-xl">
                <div className="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group relative cursor-pointer">
                  <UserIcon className="w-10 h-10" />
                  <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="pt-16 pb-8 px-8 space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">{user.name}</h2>
                <p className="text-sm font-bold text-emerald-600">Verified Farmer ID: AV-FRM-{user.id.slice(-4).toUpperCase()}</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-50 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Email Address</p>
                    <p className="text-sm font-bold text-slate-800">{user.email || "ramesh.patil@example.com"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-50 text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Phone Number</p>
                    <p className="text-sm font-bold text-slate-800">{user.phone || "+91 98XXX XXX01"}</p>
                  </div>
                </div>
              </div>

              <Button className="w-full rounded-2xl bg-slate-900 hover:bg-emerald-600 h-14 font-black text-sm uppercase tracking-widest gap-2">
                <Edit2 className="w-4 h-4" /> Edit Basic Details
              </Button>
            </CardContent>
          </Card>

          {/* Verification & Address Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-3">
                  <Fingerprint className="w-6 h-6 text-emerald-600" />
                  Government Verification
                </h3>
              </div>
              <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aadhaar Card (Masked)</p>
                  <p className="text-lg font-bold text-slate-800">XXXX-XXXX-4592</p>
                  <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest bg-emerald-50 w-fit px-2 py-0.5 rounded">Linked & Active</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Land Record (7/12)</p>
                  <p className="text-lg font-bold text-slate-800">{user.landRecordId || "MH-NGP-2023-8841"}</p>
                  <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest bg-emerald-50 w-fit px-2 py-0.5 rounded">Verified</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                  Primary Location
                </h3>
                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50">
                  Update Location
                </Button>
              </div>
              <CardContent className="p-8 grid grid-cols-2 md:grid-cols-3 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">State</p>
                  <p className="text-sm font-bold text-slate-800">{user.state || "Maharashtra"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Taluka</p>
                  <p className="text-sm font-bold text-slate-800">{user.taluka || "Niphad"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Village</p>
                  <p className="text-sm font-bold text-slate-800">{user.city || "Nashik"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pin Code</p>
                  <p className="text-sm font-bold text-slate-800">{user.pinCode || "422303"}</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center gap-4 p-6 rounded-3xl bg-slate-50 border border-slate-100">
              <div className="p-3 bg-white rounded-2xl text-amber-500 shadow-sm">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-slate-800 tracking-tight">Profile Last Updated</h4>
                <p className="text-xs text-slate-400 font-medium">Synced with AquaVera Central Grid on Jan 14, 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
