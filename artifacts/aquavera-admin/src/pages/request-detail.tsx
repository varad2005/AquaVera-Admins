import { useParams, Link, useLocation } from "wouter";
import { AppLayout } from "@/components/layout/app-layout";
import { useRequest, useUpdateRequestStatus } from "@/hooks/use-mock-api";
import { StatusBadge } from "@/components/ui-custom/status-badge";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowLeft, MapPin, Image as ImageIcon, CheckCircle, XCircle, AlertTriangle, UserCheck, ShieldAlert, Cpu, Droplets } from "lucide-react";
import { useState } from "react";

import { useLanguage } from "@/context/language-context";

export default function RequestDetail() {
  const { t } = useLanguage();
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { data: request, isLoading } = useRequest(id || '');
  const { mutate: updateStatus, isPending } = useUpdateRequestStatus();
  const [activeTab, setActiveTab] = useState<'satellite' | 'crop'>('satellite');

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex h-[60vh] items-center justify-center text-muted-foreground">
          {t("common.loading")}
        </div>
      </AppLayout>
    );
  }

  if (!request) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">{t("detail.not_found")}</h2>
          <p className="text-muted-foreground mb-6">{t("detail.not_found_desc").replace('{id}', id || '')}</p>
          <Link href="/requests" className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium">
            {t("detail.back_to_requests")}
          </Link>
        </div>
      </AppLayout>
    );
  }

  const handleAction = (status: 'Approved' | 'Rejected' | 'Flagged') => {
    updateStatus({ id: request.id, status }, {
      onSuccess: () => {
        setLocation("/requests");
      }
    });
  };

  return (
    <AppLayout>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/requests" className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{t("detail.title")} {request.id}</h1>
              <StatusBadge status={request.status} />
            </div>
            <p className="text-muted-foreground mt-1 text-sm">{t("detail.submitted_on")} {format(new Date(request.timestamp), 'PPP at p')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-24">
        {/* Left Column - Data Profile */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border bg-slate-50/50 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-slate-600" />
              <h2 className="font-semibold text-foreground">{t("detail.farmer_profile")}</h2>
            </div>
            <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("detail.fullname")}</p>
                <p className="font-medium text-foreground">{request.farmerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("detail.aadhaar")}</p>
                <p className="font-medium text-foreground font-mono">{request.aadhaar}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("detail.land_record_id")}</p>
                <p className="font-medium text-foreground font-mono bg-muted inline-block px-2 py-0.5 rounded">{request.landId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("detail.location")}</p>
                <p className="font-medium text-foreground">{request.village}, {request.district}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border bg-slate-50/50 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-slate-600" />
              <h2 className="font-semibold text-foreground">{t("detail.allocation_request")}</h2>
            </div>
            <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("detail.declared_crop")}</p>
                <p className="font-medium text-foreground">{t(`crop.${request.cropType.toLowerCase()}`)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("detail.duration")}</p>
                <p className="font-medium text-foreground">{request.durationHours} {t("detail.hours")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("detail.expected_start")}</p>
                <p className="font-medium text-foreground">{format(new Date(request.startDate), 'MMM dd, yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("detail.calculated_billing")}</p>
                <p className="font-medium text-primary text-lg">{formatCurrency(request.calculatedBilling)}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border bg-slate-50/50 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-slate-600" />
              <h2 className="font-semibold text-foreground">{t("detail.ai_analysis")}</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-foreground">{t("detail.confidence_score")}</p>
                <p className={`font-bold ${request.confidenceScore > 80 ? 'text-green-600' : request.confidenceScore > 60 ? 'text-amber-600' : 'text-red-600'}`}>
                  {request.confidenceScore}%
                </p>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5 mb-6">
                <div 
                  className={`h-2.5 rounded-full ${request.confidenceScore > 80 ? 'bg-green-600' : request.confidenceScore > 60 ? 'bg-amber-500' : 'bg-red-600'}`} 
                  style={{ width: `${request.confidenceScore}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-border rounded-md flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("detail.geofence_match")}</p>
                    <p className="text-xs text-muted-foreground mt-1 mb-2">{t("detail.geofence_desc")}</p>
                    <StatusBadge status={request.geoStatus} type="geo" />
                  </div>
                </div>
                <div className="p-4 border border-border rounded-md flex items-start gap-3">
                  <ImageIcon className="w-5 h-5 text-indigo-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("detail.ndvi_index")}</p>
                    <p className="text-xs text-muted-foreground mt-1 mb-2">{t("detail.ndvi_desc")}</p>
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded border border-indigo-200">{request.ndviIndex}</span>
                  </div>
                </div>
              </div>
              
              {request.confidenceScore < 70 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                  <p className="text-sm text-red-800 font-medium">{t("detail.anomaly_detected").replace('{crop}', t(`crop.${request.cropType.toLowerCase()}`))}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Media / Map */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="bg-card border border-border rounded-md shadow-sm flex flex-col h-full overflow-hidden">
            <div className="flex border-b border-border">
              <button 
                onClick={() => setActiveTab('satellite')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'satellite' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:bg-muted/50'}`}
              >
                <MapPin className="w-4 h-4" /> {t("detail.satellite_map")}
              </button>
              <button 
                onClick={() => setActiveTab('crop')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'crop' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:bg-muted/50'}`}
              >
                <ImageIcon className="w-4 h-4" /> {t("detail.drone_scan")}
              </button>
            </div>
            <div className="flex-1 bg-slate-900 relative min-h-[400px]">
              {activeTab === 'satellite' ? (
                <>
                  <img src={`${import.meta.env.BASE_URL}images/satellite-placeholder.png`} alt="Satellite map" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {/* Simulated plot highlight overlay */}
                    <div className="border-2 border-primary bg-primary/20 w-48 h-32 transform rotate-12 relative shadow-[0_0_15px_rgba(21,128,61,0.5)]">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap">
                        {t("detail.plot_id")}: {request.landId}
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur text-white p-3 rounded-md border border-slate-700 text-xs">
                    {t("detail.last_pass")}: {format(subHours(new Date(request.timestamp), 12), 'PPP p')}
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center bg-slate-800 relative min-h-[400px]">
                   {request.evidenceImage ? (
                     <img 
                       src={request.evidenceImage} 
                       alt="Field Evidence" 
                       className="w-full h-full object-contain" 
                     />
                   ) : (
                     <div className="flex flex-col items-center gap-3 text-slate-500">
                       <ImageIcon className="w-12 h-12 opacity-20" />
                       <p className="text-xs font-medium italic opacity-50">No evidence photo available</p>
                     </div>
                   )}
                   {request.deviceInfo && (
                     <div className="absolute bottom-4 left-4 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur border border-white/20 font-mono opacity-80 max-w-[80%] truncate">
                       Device: {request.deviceInfo}
                     </div>
                   )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-64 right-0 bg-card border-t border-border p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 flex justify-between items-center px-8">
        <div>
          <p className="text-sm font-medium text-foreground">{t("detail.decision_required")}</p>
          <p className="text-xs text-muted-foreground">{t("detail.action_notify")}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            disabled={isPending || request.status === 'Flagged'}
            onClick={() => handleAction('Flagged')}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 rounded-md font-medium text-sm transition-colors disabled:opacity-50"
          >
            <AlertTriangle className="w-4 h-4" />
            {t("detail.flag_button")}
          </button>
          
          <button 
            disabled={isPending || request.status === 'Rejected'}
            onClick={() => handleAction('Rejected')}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 rounded-md font-medium text-sm transition-colors disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" />
            {t("detail.reject_button")}
          </button>
          
          <button 
            disabled={isPending || request.status === 'Approved'}
            onClick={() => handleAction('Approved')}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium text-sm transition-all shadow-sm shadow-primary/20 disabled:opacity-50 disabled:transform-none active:scale-[0.98]"
          >
            <CheckCircle className="w-4 h-4" />
            {t("detail.approve_button")}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}

// Helper to use subHours dynamically for the UI mock
import { subHours } from 'date-fns';
