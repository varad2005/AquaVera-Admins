import React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui-custom/stat-card";
import { Button } from "@/components/ui/button";
import { useRole } from "@/context/role-context";
import { 
  Droplets, 
  PlusCircle,
  CreditCard,
  Landmark,
  Clock,
  Activity,
  TrendingUp,
  Leaf,
  ArrowRight,
  ClipboardList,
  LucideIcon
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useRequests } from "@/hooks/use-mock-api";
import { format } from "date-fns";
import { StatusBadge } from "@/components/ui-custom/status-badge";
import { formatCurrency, cn } from "@/lib/utils";
import { WaterRequest } from "@/data/mock-data";
import { useLocation, Link } from "wouter";

// Sub-component: Section Header
const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-4">
    <h3 className="text-lg font-black text-slate-800 tracking-tight">{title}</h3>
    {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
  </div>
);

// Sub-component: Insight Item
const InsightItem = ({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) => (
  <div className="flex items-start gap-4 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
    <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{label}</p>
      <p className="text-base font-bold text-slate-800 leading-none">{value}</p>
    </div>
  </div>
);

export default function FarmerDashboard() {
  const { user } = useRole();
  if (!user) return null;
  const { t } = useLanguage();
  const { data: allRequests, isLoading } = useRequests();

  // Filter requests for this farmer
  const farmerRequests = allRequests?.filter((r: WaterRequest) => r.farmerName === user.name) || [];
  const activeRequest = farmerRequests.find((r: WaterRequest) => r.status === 'Pending' || r.status === 'Approved');
  const recentRequests = farmerRequests.slice(0, 5);

  // Dynamic calculations from real data
  const totalBill = farmerRequests.reduce((acc: number, req: WaterRequest) => acc + (req.status === 'Approved' ? req.calculatedBilling : 0), 0);
  const landInfo = `${user.plotNumber || "Plot #42"}, ${user.city || "Nashik"}`;
  const landArea = user.surveyNumber ? "5.5 Acres" : "Region Not Set"; // Fallback if no survey

  return (
    <AppLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        {/* Personalized Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
              Hello, <span className="text-emerald-600">{user.name}</span>
            </h1>
            <p className="text-slate-500 font-medium tracking-tight">Here’s your farm status for today</p>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
            <Clock className="w-4 h-4" />
            {format(new Date(), "EEEE, MMM dd")}
          </div>
        </div>

        {/* PROMINENT CTA: Request Water */}
        <Link href="/requests/new">
          <Card className="relative overflow-hidden border-none shadow-2xl shadow-emerald-500/10 group cursor-pointer hover:scale-[1.01] transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-500 opacity-90" />
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500" />
            
            <CardContent className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 text-white rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                  <Droplets className="w-3.5 h-3.5" /> Start Irrigation
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">Request Water</h2>
                  <p className="text-emerald-50 font-medium text-lg max-w-md opacity-80">
                    Instantly trigger a new irrigation sequence for your crop and sync with the smart grid.
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-2 rounded-[2.2rem] shadow-xl">
                <Button className="h-20 px-10 text-xl font-black rounded-[1.8rem] bg-slate-900 hover:bg-emerald-600 text-white transition-all duration-500 gap-4">
                  Schedule Now <PlusCircle className="w-6 h-6" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Dashboard Column (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Overview Stats */}
            <div className="space-y-4">
              <SectionHeader title="Farm Overview" subtitle="Real-time status tracking" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <StatCard 
                title="Active Request" 
                value={activeRequest ? activeRequest.status : "None"} 
                icon={Activity} 
                className={cn(
                  "rounded-3xl border-none shadow-sm",
                  activeRequest?.status === 'Pending' ? "bg-amber-50 text-amber-700" : (activeRequest?.status === 'Approved' ? "bg-emerald-50 text-emerald-700" : "bg-white")
                )}
              />
              <StatCard 
                title="Last Crop" 
                value={farmerRequests.length > 0 ? farmerRequests[0].cropType : "Not Recorded"} 
                icon={Leaf} 
                className="rounded-3xl border-none shadow-sm bg-white"
              />
              <StatCard 
                title="Total Billing" 
                value={formatCurrency(totalBill)} 
                icon={CreditCard} 
                className="rounded-3xl border-none shadow-sm bg-white"
              />
              <StatCard 
                title="Land Summary" 
                value={landArea} 
                icon={Landmark} 
                className="rounded-3xl border-none shadow-sm bg-white"
              />
            </div>
          </div>

            {/* Recent Requests List */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <SectionHeader title="Recent Activity" />
                {farmerRequests.length > 0 && (
                  <Link href="/request-activity">
                    <Button variant="ghost" className="text-xs font-black text-emerald-600 uppercase tracking-widest hover:bg-emerald-50">
                      View All <ArrowRight className="w-3 h-3 ml-2" />
                    </Button>
                  </Link>
                )}
              </div>

              {farmerRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-[2.5rem] border border-dashed border-slate-200 text-center space-y-6">
                  <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300">
                    <ClipboardList className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-black text-slate-800 tracking-tight">No water requests yet</h4>
                    <p className="text-slate-400 font-medium text-sm max-w-xs">
                      Your irrigation history is currently empty. Start by requesting water for your crop.
                    </p>
                  </div>
                  <Button className="rounded-2xl bg-slate-900 hover:bg-emerald-600 px-8 font-bold gap-2">
                    Request Water <PlusCircle className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentRequests.map((req: WaterRequest) => (
                    <div 
                      key={req.id} 
                      className="bg-white border-border border rounded-3xl p-5 flex items-center justify-between hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <Droplets className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-800 tracking-tight">{req.cropType}</h4>
                            <span className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-black uppercase tracking-wider">
                              {req.id}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-medium">
                            {format(new Date(req.timestamp), 'MMM dd')} • {req.durationHours} Hours • {req.village}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="text-sm font-black text-slate-800">
                          {formatCurrency(req.calculatedBilling)}
                        </span>
                        <StatusBadge status={req.status} className="text-[9px] px-2 py-0.5 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar Column (1/3) */}
          <div className="space-y-8">
            {/* Insights Section */}
            <div className="space-y-4">
              <SectionHeader title="Farm Insights" subtitle="Data-driven suggestions" />
              <div className="space-y-6">
                <InsightItem icon={TrendingUp} label="Best Current Crop" value="Sugarcane" />
                <InsightItem icon={Clock} label="Next Irrigation" value="In 3 Days" />
                <InsightItem icon={Droplets} label="Water Usage" value="Moderate" />
              </div>
            </div>

            {/* Land Summary Quick View */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Active Land Profile</p>
                <h4 className="text-2xl font-black tracking-tight">{landInfo}</h4>
                <p className="text-slate-400 text-xs font-medium">Synced with Govt. Survey Grid</p>
              </div>
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="text-center">
                  <p className="text-[9px] font-black uppercase text-slate-500 mb-1">Plot</p>
                  <p className="font-bold text-sm">#42A</p>
                </div>
                <div className="text-center border-l border-white/10 pl-6">
                  <p className="text-[9px] font-black uppercase text-slate-500 mb-1">Status</p>
                  <p className="font-bold text-sm text-emerald-400">Verified</p>
                </div>
                <div className="text-center border-l border-white/10 pl-6">
                  <p className="text-[9px] font-black uppercase text-slate-500 mb-1">Zone</p>
                  <p className="font-bold text-sm">North-2</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
