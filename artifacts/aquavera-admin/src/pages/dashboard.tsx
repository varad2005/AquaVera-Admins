import { AppLayout } from "@/components/layout/app-layout";
import { StatCard } from "@/components/ui-custom/stat-card";
import { Droplets, FileWarning, CheckCircle2, FileText, ArrowRight } from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";
import { useRequests, useLogs } from "@/hooks/use-mock-api";
import { format } from "date-fns";
import { Link } from "wouter";
import { StatusBadge } from "@/components/ui-custom/status-badge";
import { WaterRequest, Log } from "@/data/mock-data";
import { useLanguage } from "@/context/language-context";

const trendData = [
  { name: 'Mon', requests: 120 },
  { name: 'Tue', requests: 150 },
  { name: 'Wed', requests: 180 },
  { name: 'Thu', requests: 140 },
  { name: 'Fri', requests: 210 },
  { name: 'Sat', requests: 190 },
  { name: 'Sun', requests: 240 },
];

const cropData = [
  { name: 'Wheat', value: 450 },
  { name: 'Sugarcane', value: 380 },
  { name: 'Rice', value: 290 },
  { name: 'Cotton', value: 210 },
];

export default function Dashboard() {
  const { t } = useLanguage();
  const { data: requests, isLoading: isLoadingReqs } = useRequests();
  const { data: logs, isLoading: isLoadingLogs } = useLogs();

  const totalRequests = requests?.length || 0;
  const pendingRequests = requests?.filter((r: WaterRequest) => r.status === 'Pending').length || 0;
  const flaggedRequests = requests?.filter((r: WaterRequest) => r.status === 'Flagged').length || 0;
  const totalVolume = requests?.reduce((acc: number, r: WaterRequest) => acc + (r.durationHours * 10), 0) || 0; // Mock calculation: 10m3 per hour

  const translatedTrendData = trendData.map(d => ({
    ...d,
    name: t(`day.${d.name.toLowerCase()}`)
  }));

  const translatedCropData = cropData.map(d => ({
    ...d,
    name: t(`crop.${d.name.toLowerCase()}`)
  }));

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground font-sans tracking-tight">{t("dashboard.title")}</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">{t("dashboard.subtitle")}</p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title={t("stat.total_requests")} 
          value={totalRequests.toLocaleString()} 
          trend={{ value: '12%', isPositive: true }}
          icon={FileText} 
        />
        <StatCard 
          title={t("stat.pending_approvals")} 
          value={pendingRequests.toLocaleString()} 
          trend={{ value: '3%', isPositive: false }}
          icon={FileWarning} 
        />
        <StatCard 
          title={t("stat.volume_allocated")} 
          value={totalVolume.toLocaleString()} 
          trend={{ value: '8%', isPositive: true }}
          icon={Droplets} 
        />
        <StatCard 
          title={t("stat.flagged_anomalies")} 
          value={flaggedRequests.toLocaleString()} 
          trend={{ value: '2', isPositive: false }}
          icon={CheckCircle2} 
          className="border-amber-200 bg-amber-50/30"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-card border border-border rounded-md p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-foreground">{t("chart.request_trends")}</h3>
            <select className="bg-muted text-sm rounded-md px-3 py-1 border-none outline-none">
              <option>{t("chart.last_7_days")}</option>
              <option>{t("chart.last_30_days")}</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={translatedTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#15803d', fontWeight: 600 }}
                />
                <Line type="monotone" dataKey="requests" stroke="#15803d" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-md p-6 shadow-sm">
          <h3 className="text-base font-semibold text-foreground mb-6">{t("chart.crop_distribution")}</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={translatedCropData} layout="vertical" margin={{top: 0, right: 0, left: 0, bottom: 0}}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#1e293b', fontWeight: 500}} width={80} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="#15803d" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-border flex justify-between items-center bg-muted/20">
            <h3 className="font-semibold text-foreground">{t("recent_requests.title")}</h3>
            <Link href="/requests" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
              {t("recent_requests.view_all")} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-0 flex-1">
            {isLoadingReqs ? (
              <div className="p-8 text-center text-muted-foreground text-sm">{t("recent_requests.loading")}</div>
            ) : (
              <ul className="divide-y divide-border">
                {requests?.slice(0, 5).map((req: WaterRequest) => (
                   <li key={req.id} className="p-4 hover:bg-muted/30 transition-colors flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-foreground">{req.id} - {req.farmerName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{t(`crop.${req.cropType.toLowerCase()}`)} • {req.village}</p>
                    </div>
                    <StatusBadge status={req.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-border flex justify-between items-center bg-muted/20">
            <h3 className="font-semibold text-foreground">{t("audit_log.title")}</h3>
            <Link href="/logs" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
              {t("audit_log.full_log")} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-0 flex-1">
            {isLoadingLogs ? (
              <div className="p-8 text-center text-muted-foreground text-sm">{t("audit_log.loading")}</div>
            ) : (
              <ul className="divide-y divide-border">
                {logs?.slice(0, 5).map((log: Log) => {
                  let action = log.action;
                  if (log.id === 'LOG-1') action = t("log.action.approved").replace("{id}", "#REQ-1003");
                  else if (log.id === 'LOG-2') action = t("log.action.auto_flagged").replace("{id}", "#REQ-1002");
                  else if (log.id === 'LOG-3') action = t("log.action.assigned").replace("{id}", "#REQ-1001");
                  else if (log.id === 'LOG-4') action = t("log.action.updated_settings");
                  else if (log.id === 'LOG-5') action = t("log.action.deactivated_user").replace("{id}", "#USR-003");

                  return (
                    <li key={log.id} className="p-4 hover:bg-muted/30 transition-colors">
                      <p className="text-sm text-foreground">{action}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span className="font-medium text-slate-700">{log.user}</span>
                        <span>•</span>
                        <span>{format(new Date(log.timestamp), 'MMM dd, HH:mm')}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
      </div>
    </AppLayout>
  );
}
