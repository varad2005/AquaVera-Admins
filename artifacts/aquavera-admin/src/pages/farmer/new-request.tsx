import React, { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { useRole } from "@/context/role-context";
import { 
  PlusCircle, 
  Clock, 
  Leaf,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Camera,
  ArrowLeft,
  Calendar,
  Layers,
  IndianRupee,
  Maximize2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";
import { useAddRequest } from "@/hooks/use-mock-api";
import { formatCurrency, cn } from "@/lib/utils";
import { CameraCapture } from "@/components/ui-custom/camera-capture";

// ----------------------------------------------------------------------
// DATA STRUCTURES
// ----------------------------------------------------------------------

const CROP_CATEGORIES: Record<string, string[]> = {
  "Food Grains & Other Crops": ["Rice", "Wheat", "Jowar", "Bajra", "Maize"],
  "Sugarcane & Banana": ["Sugarcane", "Banana"],
  "Cotton": ["Cotton"],
  "Horticulture": ["Onion", "Tomato", "Potato", "Grapes", "Pomegranate", "Mango"]
};

type Category = keyof typeof CROP_CATEGORIES;
type Season = "kharif" | "rabi" | "hot";

const RATES: Record<Category, Record<Season, number>> = {
  "Food Grains & Other Crops": { kharif: 600, rabi: 1200, hot: 1800 },
  "Sugarcane & Banana": { kharif: 1890, rabi: 3780, hot: 5670 },
  "Cotton": { kharif: 810, rabi: 1620, hot: 2430 },
  "Horticulture": { kharif: 1422, rabi: 2844, hot: 4266 }
};

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------

export default function NewRequest() {
  const { user } = useRole();
  if (!user) return null;
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const addRequest = useAddRequest();
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    category: "Food Grains & Other Crops" as Category,
    crop: "Rice",
    season: "kharif" as Season,
    areaValue: "1",
    unit: "acre" as "acre" | "hectare",
    verificationData: null as any
  });

  // -------------------------------------------------------------------
  // BILLING CALCULATIONS
  // -------------------------------------------------------------------
  const billingInfo = useMemo(() => {
    const area = parseFloat(formData.areaValue) || 0;
    const isAcre = formData.unit === "acre";
    const areaInHa = isAcre ? area / 2.471 : area;
    const ratePerHa = RATES[formData.category][formData.season];
    const finalBill = Math.round(ratePerHa * areaInHa);

    return {
      ratePerHa,
      areaInHa,
      finalBill
    };
  }, [formData.category, formData.season, formData.areaValue, formData.unit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.verificationData) {
      toast({ title: "Verification Required", description: "Please capture a field image with geo-tagging.", variant: "destructive" });
      return;
    }
    setLoading(true);
    
    try {
      await addRequest.mutateAsync({
        farmerName: user.name,
        aadhaar: user.aadhaar,
        landId: user.landRecordId,
        village: user.city,
        district: user.taluka,
        cropType: `${formData.crop} (${formData.category})`,
        area: billingInfo.areaInHa,
        durationHours: 8,
        startDate: new Date(),
        calculatedBilling: billingInfo.finalBill,
        paymentStatus: 'Unpaid',
        verificationData: formData.verificationData
      });

      toast({ title: "Success", description: "Water request submitted for verification." });
      setLocation("/dashboard/farmer");
    } catch (error) {
      toast({ title: "Error", description: "Failed to submit request.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
        
        {/* Header */}
        <div className="flex items-center gap-4 py-2 border-b border-slate-100 pb-6">
          <Link href="/dashboard/farmer">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
          </Link>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Request Water</h1>
            <p className="text-xs text-slate-500 font-medium tracking-tight">Maharashtra State Smart Irrigation Portal</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          <div className="space-y-10">
            {/* Section 1: Crop Inputs */}
            <div className="space-y-8">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Crop Inputs</h3>
              </div>

              {/* Crop Category */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Crop Category</label>
                <Select 
                  value={formData.category} 
                  onValueChange={(v: Category) => {
                    setFormData({
                      ...formData, 
                      category: v,
                      crop: CROP_CATEGORIES[v][0]
                    });
                  }}
                >
                  <SelectTrigger className="h-14 rounded-xl border-slate-200 bg-white font-bold text-slate-800 focus:ring-slate-900 ring-offset-0">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200">
                    {Object.keys(CROP_CATEGORIES).map(cat => (
                      <SelectItem key={cat} value={cat} className="font-bold py-3">{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Crop Name */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Crop Name</label>
                <Select 
                  value={formData.crop} 
                  onValueChange={(v) => setFormData({...formData, crop: v})}
                >
                  <SelectTrigger className="h-14 rounded-xl border-slate-200 bg-white font-bold text-slate-800 focus:ring-slate-900 ring-offset-0">
                    <SelectValue placeholder="Select Crop" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200">
                    {CROP_CATEGORIES[formData.category].map(c => (
                      <SelectItem key={c} value={c} className="font-bold py-3">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Season */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Season</label>
                <ToggleGroup 
                  type="single" 
                  value={formData.season}
                  onValueChange={(v: Season) => v && setFormData({...formData, season: v})}
                  className="justify-start p-1.5 bg-slate-100 rounded-xl w-full"
                >
                  {["kharif", "rabi", "hot"].map((s) => (
                    <ToggleGroupItem 
                      key={s} 
                      value={s} 
                      className={cn(
                        "flex-1 rounded-lg py-3 font-bold text-xs capitalize transition-all",
                        formData.season === s 
                          ? "bg-white text-slate-900 shadow-sm" 
                          : "text-slate-500 hover:bg-white/50"
                      )}
                    >
                      {s === "hot" ? "Hot Weather" : s}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              {/* Land Area */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Land Area</label>
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button 
                      type="button" 
                      onClick={() => setFormData({...formData, unit: "acre"})}
                      className={cn("px-2 py-1 text-[9px] font-black uppercase rounded-md transition-all", formData.unit === "acre" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400")}
                    >Acre</button>
                    <button 
                      type="button" 
                      onClick={() => setFormData({...formData, unit: "hectare"})}
                      className={cn("px-2 py-1 text-[9px] font-black uppercase rounded-md transition-all", formData.unit === "hectare" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400")}
                    >Hectare</button>
                  </div>
                </div>
                <div className="relative">
                  <Input 
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.areaValue}
                    onChange={(e) => setFormData({...formData, areaValue: e.target.value})}
                    className="h-14 rounded-xl border-slate-200 bg-white font-bold text-slate-800 focus:ring-slate-900 ring-offset-0 px-4"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {formData.unit}s
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Verification */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-slate-600" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Verification</h3>
              </div>
              
              <CameraCapture 
                onCapture={(data) => setFormData({...formData, verificationData: data})}
                onClear={() => setFormData({...formData, verificationData: null})}
              />
            </div>
          </div>

          <div className="space-y-10">
            {/* Section 2: Bill Preview */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Estimated Irrigation Bill</h3>
              </div>
              
              <Card className="rounded-3xl border border-slate-100 shadow-xl overflow-hidden bg-slate-900 text-white">
                <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-2 gap-y-6 gap-x-10">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Crop Category</label>
                      <p className="text-sm font-bold truncate">{formData.category}</p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Crop Name</label>
                      <p className="text-sm font-bold">{formData.crop}</p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Season</label>
                      <p className="text-sm font-bold capitalize">{formData.season === "hot" ? "Hot Weather" : formData.season}</p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Rate (per Ha)</label>
                      <p className="text-sm font-bold">₹{billingInfo.ratePerHa}</p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Area (Converted)</label>
                      <p className="text-sm font-bold">{billingInfo.areaInHa.toFixed(3)} hectare</p>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/10 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Estimated Bill</p>
                      <p className="text-xs text-white/50 font-medium tracking-tight">Includes water distribution fees</p>
                    </div>
                    <p className="text-4xl font-black text-white tracking-tighter">
                      ₹{billingInfo.finalBill.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Protocol Alert */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Verification Protocol</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Final billing depends on satellite NDVI verification and actual land size reported in 7/12 land records.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              type="submit"
              disabled={loading || !formData.verificationData}
              className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-black text-lg shadow-xl gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Processing..." : "Submit Request"}
            </Button>
          </div>

        </form>

      </div>
    </AppLayout>
  );
}
