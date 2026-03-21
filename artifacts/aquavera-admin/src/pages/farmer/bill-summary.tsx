import React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { useRole } from "@/context/role-context";
import { 
  CreditCard, 
  Receipt, 
  TrendingDown,
  Calendar,
  ArrowUpRight,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock
} from "lucide-react";
import { useRequests } from "@/hooks/use-mock-api";
import { formatCurrency, cn } from "@/lib/utils";
import { format } from "date-fns";
import { StatusBadge } from "@/components/ui-custom/status-badge";
import { WaterRequest } from "@/data/mock-data";
import { useLocation } from "wouter";

export default function BillSummary() {
  const { user } = useRole();
  const [, setLocation] = useLocation();

  if (!user) return null;
  const { data: allRequests } = useRequests();

  const farmerRequests = allRequests?.filter((r: any) => (r.farmerName === user.name)) || [];
  
  const paymentDone = farmerRequests.reduce((acc: number, req: any) => {
    const status = req.paymentStatus || req.payment_status;
    return acc + (req.status === 'Approved' && status === 'Paid' ? Number(req.calculatedBilling) : 0);
  }, 0);
  
  const paymentPending = farmerRequests.reduce((acc: number, req: any) => {
    const status = req.paymentStatus || req.payment_status || 'Unpaid';
    return acc + (req.status === 'Approved' && status === 'Unpaid' ? Number(req.calculatedBilling) : 0);
  }, 0);
    
  const pendingApproval = farmerRequests.reduce((acc: number, req: any) => 
    acc + (req.status === 'Pending' ? Number(req.calculatedBilling) : 0), 0);

  return (
    <AppLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
              Bill Summary
            </h1>
            <p className="text-slate-500 font-medium tracking-tight">Financial oversight of your irrigation usage</p>
          </div>
          <button 
            onClick={() => setLocation(`/payment?amount=${paymentPending}&requestId=all`)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold shadow-xl shadow-slate-900/20 hover:bg-emerald-600 transition-all duration-300"
          >
            Pay Dues <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="rounded-[2.5rem] border-none shadow-xl shadow-emerald-500/5 bg-emerald-600 text-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/20">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-200">Payment Done</span>
            </div>
            <div>
              <p className="text-3xl font-black tracking-tight">{formatCurrency(paymentDone)}</p>
              <p className="text-emerald-100/60 text-[10px] font-medium mt-1 text-nowrap">Cleared transactions</p>
            </div>
          </Card>

          <Card className="rounded-[2.5rem] border-none shadow-xl shadow-rose-500/5 bg-rose-600 text-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/20">
                <AlertCircle className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-rose-200">Payment Pending</span>
            </div>
            <div>
              <p className="text-3xl font-black tracking-tight">{formatCurrency(paymentPending)}</p>
              <p className="text-rose-100/60 text-[10px] font-medium mt-1 text-nowrap">Awaiting settlement</p>
            </div>
          </Card>

          <Card className="rounded-[2.5rem] border-none shadow-sm bg-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Approval Pending</span>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800 tracking-tight">{formatCurrency(pendingApproval)}</p>
              <p className="text-slate-400 text-[10px] font-medium mt-1 text-nowrap">In verification queue</p>
            </div>
          </Card>

          <Card className="rounded-[2.5rem] border-none shadow-sm bg-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                <TrendingDown className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Usage Trend</span>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800 tracking-tight">-12% <span className="text-sm font-bold text-slate-400">Liters</span></p>
              <p className="text-slate-400 text-[10px] font-medium mt-1 text-nowrap">Vs previous month</p>
            </div>
          </Card>
        </div>

        {/* Billing History Table */}
        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
          <div className="bg-slate-900 p-6 flex items-center justify-between">
            <h3 className="text-white font-black tracking-tight flex items-center gap-3">
              <Receipt className="w-5 h-5 text-emerald-400" />
              Billing History
            </h3>
            <div className="flex items-center gap-2">
              <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
                <Download className="w-4 h-4" />
              </button>
              <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
                <Calendar className="w-4 h-4" />
              </button>
            </div>
          </div>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Request ID</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Crop</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Consumption</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {farmerRequests.map((req: WaterRequest) => (
                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <span className="text-xs font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{req.id}</span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-xs font-bold text-slate-800">{format(new Date(req.timestamp), "MMM dd, yyyy")}</p>
                        <p className="text-[10px] text-slate-400 font-medium">At {format(new Date(req.timestamp), "HH:mm")}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-bold text-slate-800">{req.cropType}</span>
                      </td>
                      <td className="px-8 py-6 text-xs font-medium text-slate-600">
                        {req.durationHours * 50}k Liters
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-black text-slate-900">{formatCurrency(req.calculatedBilling)}</span>
                      </td>
                      <td className="px-8 py-6 text-right flex items-center justify-end gap-2">
                        {req.paymentStatus && (
                          <span className={cn(
                            "text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-wider border",
                            req.paymentStatus === 'Paid' 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                              : "bg-rose-50 text-rose-700 border-rose-100"
                          )}>
                            {req.paymentStatus === 'Paid' ? 'PAID' : 'UNPAID'}
                          </span>
                        )}
                        <div className="flex items-center justify-end gap-2">
                          <StatusBadge status={req.status} className="text-[10px] px-3 py-1 rounded-full" />
                          {req.status === 'Approved' && (req.paymentStatus === 'Unpaid' || (req as any).payment_status === 'Unpaid' || !req.paymentStatus) && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setLocation(`/payment?amount=${req.calculatedBilling}&requestId=${req.id}`);
                              }}
                              className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                            >
                              Pay Now
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {farmerRequests.length === 0 && (
              <div className="p-20 text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-slate-200 mx-auto" />
                <p className="text-slate-400 font-medium">No billing history found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
