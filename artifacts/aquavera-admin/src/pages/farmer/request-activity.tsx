import React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useRole } from "@/context/role-context";
import { useRequests } from "@/hooks/use-mock-api";
import { format } from "date-fns";
import { StatusBadge } from "@/components/ui-custom/status-badge";
import { formatCurrency } from "@/lib/utils";
import { WaterRequest } from "@/data/mock-data";
import { Link } from "wouter";
import { ArrowLeft, Droplets, Calendar, Clock, MapPin, ChevronRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RequestActivity() {
  const { user } = useRole();
  if (!user) return null;
  const { data: allRequests, isLoading } = useRequests();

  const farmerRequests = allRequests?.filter((r: WaterRequest) => r.farmerName === user.name) || [];

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/farmer">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Button>
            </Link>
            <div className="space-y-0.5">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Request Activity</h1>
              <p className="text-xs text-slate-500 font-medium tracking-tight">History of all your water allocation requests</p>
            </div>
          </div>
          <Button variant="outline" className="rounded-xl border-slate-200 gap-2 font-bold text-xs h-10 px-4">
            <Filter className="w-3.5 h-3.5" /> Filter Results
          </Button>
        </div>

        {/* Requests List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64 text-slate-400 font-medium">
            Loading your activity...
          </div>
        ) : farmerRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-center space-y-4">
            <Droplets className="w-12 h-12 text-slate-300" />
            <h3 className="text-xl font-black text-slate-800">No requests found</h3>
            <p className="text-slate-500 text-sm max-w-xs">You haven't submitted any water requests yet.</p>
            <Link href="/requests/new">
              <Button className="mt-4 rounded-xl bg-slate-900 px-6 font-bold">Request Now</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {farmerRequests.map((req: WaterRequest) => (
              <div 
                key={req.id} 
                className="group bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg group-hover:bg-emerald-600 transition-colors duration-500">
                    <Droplets className="w-7 h-7" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                       <h3 className="text-lg font-black text-slate-900 tracking-tight">{req.cropType}</h3>
                       <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-lg text-slate-500 font-black tracking-widest">{req.id}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(new Date(req.timestamp), 'PPP')}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {req.durationHours} Hours
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                        <MapPin className="w-3.5 h-3.5" />
                        {req.village}, {req.district}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 md:gap-10 border-t md:border-t-0 pt-4 md:pt-0 border-slate-50">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Billing</p>
                    <p className="text-xl font-black text-slate-900">{formatCurrency(req.calculatedBilling)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Status</p>
                    <StatusBadge status={req.status} className="px-3 py-1 rounded-full text-[10px]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
