import React, { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useFarmers } from "@/hooks/use-mock-api";
import { 
  Search, 
  MapPin, 
  Droplets, 
  Download, 
  User, 
  Calendar, 
  IdCard,
  Phone,
  ArrowRight
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

import { useLanguage } from "@/context/language-context";

export default function RegisteredFarmers() {
  const { t } = useLanguage();
  const { data: farmers, isLoading } = useFarmers();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFarmers = farmers?.filter((f: any) => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportCSV = () => {
    if (!farmers || farmers.length === 0) {
      toast({ title: "Export Error", description: "No farmer data available.", variant: "destructive" });
      return;
    }

    const headers = ["Farmer ID", "Name", "Aadhaar", "Land ID", "Village", "District", "Total Requests", "Active Connections", "Last Connection"];
    const rows = farmers.map((f: any) => [
      f.id,
      f.name,
      f.aadhaar,
      f.landId,
      f.village,
      f.district,
      f.totalRequests,
      f.activeConnections,
      format(new Date(f.lastConnection), 'yyyy-MM-dd')
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row: any[]) => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `registered_farmers_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({ title: t("farmers.export_button"), description: `Data for ${farmers.length} farmers exported successfully.` });
  };

  const totalActive = farmers?.reduce((acc: number, f: any) => acc + (f.activeConnections > 0 ? 1 : 0), 0) || 0;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t("farmers.title")}</h1>
            <p className="text-slate-500 mt-1 text-sm font-medium italic">{t("farmers.subtitle")}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder={t("farmers.search_placeholder")} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-72 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
              />
            </div>
            <Button 
              variant="outline"
              onClick={handleExportCSV}
              className="rounded-xl border-slate-200 hover:bg-primary/5 hover:text-primary transition-all font-bold gap-2"
            >
              <Download className="w-4 h-4" />
              {t("farmers.export_button")}
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
              <User className="w-16 h-16 text-primary" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t("farmers.total_enrollment")}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900">{farmers?.length || 0}</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+4% this month</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-semibold">Active profiles in the central database</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
              <Droplets className="w-16 h-16 text-blue-600" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t("farmers.active_connections")}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900">{totalActive}</span>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{Math.round((totalActive / (farmers?.length || 1)) * 100)}% utilization</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-semibold">Farmers currently utilizing water allocations</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
              <MapPin className="w-16 h-16 text-orange-600" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t("farmers.regional_coverage")}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900">
                {Array.from(new Set(farmers?.map((f: any) => f.district))).length || 0}
              </span>
              <span className="text-xs font-bold text-slate-400 ml-1 italic">{t("farmers.districts_reached")}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-semibold">Geographic footprint across the state</p>
          </div>
        </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-slate-100 h-64 rounded-2xl" />
          ))}
        </div>
      ) : filteredFarmers?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <Search className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900">{t("common.no_results")}</h3>
          <p className="text-slate-500">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarmers?.map((farmer: any) => (
            <div key={farmer.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group hover:border-primary/30">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-primary/5 transition-colors">
                    <User className="w-6 h-6 text-slate-400 group-hover:text-primary" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{farmer.id}</span>
                    <div className="mt-1 flex items-center gap-1.5 justify-end">
                      <div className={`w-2 h-2 rounded-full ${farmer.activeConnections > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {farmer.activeConnections > 0 ? t("farmers.active") : t("farmers.inactive")}
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-900 mt-2 group-hover:text-primary transition-colors">{farmer.name}</h3>
                
                <div className="space-y-3 mt-6 border-t border-slate-50 pt-4">
                  <div className="flex items-center gap-3 text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-semibold">{farmer.village}, {farmer.district}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <IdCard className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-mono">{farmer.landId}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Droplets className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-primary">{farmer.totalRequests} {t("farmers.connection_requests")}</span>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center group-hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{t("farmers.last_sync")}: {format(new Date(farmer.lastConnection), 'MMM dd')}</span>
                </div>
                <button className="text-primary hover:text-primary-foreground hover:bg-primary p-2 rounded-lg transition-all">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </AppLayout>
  );
}
