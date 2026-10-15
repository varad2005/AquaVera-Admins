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
  const farmerRequests = allRequests?.filter((r: WaterRequest) => r.userId === user.id) || [];
  const activeRequest = farmerRequests.find((r: WaterRequest) => r.status === 'Pending' || r.status === 'Approved');
  const recentRequests = farmerRequests.slice(0, 5);

  // Dynamic calculations from real data
  const paymentDone = farmerRequests.reduce((acc: number, req: any) => {
    const status = req.paymentStatus || req.payment_status;
    return acc + (req.status === 'Approved' && status === 'Paid' ? Number(req.calculatedBilling) : 0);
  }, 0);

  const paymentPending = farmerRequests.reduce((acc: number, req: any) => {
    const status = req.paymentStatus || req.payment_status || 'Unpaid';
    return acc + (req.status === 'Approved' && status === 'Unpaid' ? Number(req.calculatedBilling) : 0);
  }, 0);

  const totalBill = farmerRequests.reduce((acc: number, req: WaterRequest) => acc + (req.status === 'Approved' ? req.calculatedBilling : 0), 0);
  const landInfo = `${user.plotNumber || "Plot #42"}, ${user.city || "Nashik"}`;
  const landArea = user.surveyNumber ? `5.5 ${t("unit.acre")}s` : t("dashboard.not_recorded"); 

  return (
    <AppLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        {/* Personalized Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
              {t("dashboard.hello")}, <span className="text-emerald-600">{user.name}</span>
            </h1>
            <p className="text-slate-500 font-medium tracking-tight">{t("dashboard.status_today")}</p>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
            <Clock className="w-4 h-4" />
            {format(new Date(), "EEEE, MMM dd")}
          </div>
        </div>

        {/* Actionable Banner: Pending Dues Alert */}
        {paymentPending > 0 && (
          <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 rounded-[2.2rem] p-6 text-white shadow-xl shadow-rose-500/10 flex flex-col sm:flex-row items-center justify-between gap-6 border border-white/20">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="p-3.5 bg-white/20 rounded-2xl backdrop-blur-md shrink-0 shadow-inner">
                <CreditCard className="w-7 h-7 text-white" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full border border-white/30">Action Required</span>
                  <h3 className="text-lg font-black tracking-tight">{t("farmer.payment_pending")}: {formatCurrency(paymentPending)}</h3>
                </div>
                <p className="text-xs text-white/90 font-medium">{t("farmer.pending_desc")}</p>
              </div>
            </div>
            <Link href={`/payment?amount=${paymentPending}&requestId=all`}>
              <Button className="h-12 px-6 rounded-2xl bg-white text-rose-700 hover:bg-slate-100 font-black text-xs uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95 shrink-0 gap-2">
                {t("bill.pay_dues")} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}

        {/* PROMINENT CTA: Request Water */}
        <Link href="/requests/new">
          <Card className="relative overflow-hidden border-none shadow-2xl shadow-emerald-500/10 group cursor-pointer hover:scale-[1.01] transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-500 opacity-90" />
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500" />
            
            <CardContent className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 text-white rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                  <Droplets className="w-3.5 h-3.5" /> {t("dashboard.start_irrigation")}
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">{t("dashboard.request_water")}</h2>
                  <p className="text-emerald-50 font-medium text-lg max-w-md opacity-80">
                    {t("dashboard.request_water_desc")}
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-2 rounded-[2.2rem] shadow-xl">
                <Button className="h-20 px-10 text-xl font-black rounded-[1.8rem] bg-slate-900 hover:bg-emerald-600 text-white transition-all duration-500 gap-4">
                  {t("dashboard.schedule_now")} <PlusCircle className="w-6 h-6" />
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
              <SectionHeader title={t("dashboard.farm_overview")} subtitle={t("dashboard.real_time")} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <StatCard 
                title={t("dashboard.active_request")} 
                value={activeRequest ? activeRequest.status : "None"} 
                icon={Activity} 
                className={cn(
                  "rounded-3xl border-none shadow-sm",
                  activeRequest?.status === 'Pending' ? "bg-amber-50 text-amber-700" : (activeRequest?.status === 'Approved' ? "bg-emerald-50 text-emerald-700" : "bg-white")
                )}
              />
              <StatCard 
                title={t("dashboard.last_crop")} 
                value={farmerRequests.length > 0 ? farmerRequests[0].cropType : t("dashboard.not_recorded")} 
                icon={Leaf} 
                className="rounded-3xl border-none shadow-sm bg-white"
              />
              <Link href="/bills">
                <StatCard 
                  title={paymentPending > 0 ? t("farmer.payment_pending") : t("dashboard.total_billing")} 
                  value={formatCurrency(paymentPending > 0 ? paymentPending : totalBill)} 
                  icon={CreditCard} 
                  className={cn(
                    "rounded-3xl border-none shadow-sm cursor-pointer transition-all hover:scale-[1.02]",
                    paymentPending > 0 ? "bg-rose-50 text-rose-700 border border-rose-100" : "bg-white"
                  )}
                />
              </Link>
              <StatCard 
                title={t("land.title")} 
                value={landArea} 
                icon={Landmark} 
                className="rounded-3xl border-none shadow-sm bg-white"
              />
            </div>
          </div>

            {/* Recent Requests List */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <SectionHeader title={t("dashboard.recent_activity")} />
                {farmerRequests.length > 0 && (
                  <Link href="/request-activity">
                    <Button variant="ghost" className="text-xs font-black text-emerald-600 uppercase tracking-widest hover:bg-emerald-50">
                      {t("dashboard.view_all")} <ArrowRight className="w-3 h-3 ml-2" />
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
                    <h4 className="text-xl font-black text-slate-800 tracking-tight">{t("dashboard.no_requests")}</h4>
                    <p className="text-slate-400 font-medium text-sm max-w-xs">
                      {t("dashboard.no_requests_desc")}
                    </p>
                  </div>
                  <Link href="/requests/new">
                    <Button className="rounded-2xl bg-slate-900 hover:bg-emerald-600 px-8 font-bold gap-2">
                      {t("dashboard.request_water")} <PlusCircle className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentRequests.map((req: WaterRequest) => {
                    const isApproved = req.status === 'Approved';
                    const isPaid = req.paymentStatus === 'Paid';
                    const isUnpaid = isApproved && !isPaid;

                    return (
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
                              {format(new Date(req.timestamp), 'MMM dd')} • {req.durationHours} {t("unit.hours")} • {req.village}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-1.5">
                          <span className="text-sm font-black text-slate-800">
                            {formatCurrency(req.calculatedBilling)}
                          </span>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={req.status} className="text-[9px] px-2 py-0.5 rounded-full" />
                            {isUnpaid && (
                              <Link href={`/payment?amount=${req.calculatedBilling}&requestId=${req.id}`}>
                                <button className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 active:scale-95">
                                  {t("bill.pay_now")}
                                </button>
                              </Link>
                            )}
                            {isPaid && (
                              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                {t("bill.paid")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar Column (1/3) */}
          <div className="space-y-8">
            {/* Insights Section */}
            <div className="space-y-4">
              <SectionHeader title={t("dashboard.farm_insights")} subtitle={t("dashboard.data_driven")} />
              <div className="space-y-6">
                <InsightItem icon={Droplets} label={t("dashboard.next_irrigation")} value="Tomorrow, 06:00 AM" />
                <InsightItem icon={Droplets} label={t("dashboard.water_usage")} value="1,240 m³" />
                <InsightItem icon={Activity} label={t("activity.status")} value="Optimal" />
              </div>
            </div>

            {/* Land Summary Quick View */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{t("dashboard.active_land")}</p>
                <h4 className="text-2xl font-black tracking-tight">{landInfo}</h4>
                <p className="text-slate-400 text-xs font-medium">{t("dashboard.govt_survey")}</p>
              </div>
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="text-center">
                  <p className="text-[9px] font-black uppercase text-slate-500 mb-1">{t("land.plot")}</p>
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
