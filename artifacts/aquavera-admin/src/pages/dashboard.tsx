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
  const { data: requests, isLoading: isLoadingReqs } = useRequests();
  const { data: logs, isLoading: isLoadingLogs } = useLogs();

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Operational Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">Real-time overview of irrigation requests and system health.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Requests (7d)" 
          value="1,247" 
          trend={{ value: '12%', isPositive: true }}
          icon={FileText} 
        />
        <StatCard 
          title="Pending Approvals" 
          value={requests?.filter(r => r.status === 'Pending').length || 0} 
          trend={{ value: '3%', isPositive: false }}
          icon={FileWarning} 
        />
        <StatCard 
          title="Volume Allocated (m³)" 
          value="2,340" 
          trend={{ value: '8%', isPositive: true }}
          icon={Droplets} 
        />
        <StatCard 
          title="Flagged Anomalies" 
          value={requests?.filter(r => r.status === 'Flagged').length || 0} 
          trend={{ value: '2', isPositive: false }}
          icon={CheckCircle2} 
          className="border-amber-200 bg-amber-50/30"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-card border border-border rounded-md p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-foreground">Request Volume Trends</h3>
            <select className="bg-muted text-sm rounded-md px-3 py-1 border-none outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
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
          <h3 className="text-base font-semibold text-foreground mb-6">Crop Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropData} layout="vertical" margin={{top: 0, right: 0, left: 0, bottom: 0}}>
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
            <h3 className="font-semibold text-foreground">Recent Requests</h3>
            <Link href="/requests" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-0 flex-1">
            {isLoadingReqs ? (
              <div className="p-8 text-center text-muted-foreground text-sm">Loading requests...</div>
            ) : (
              <ul className="divide-y divide-border">
                {requests?.slice(0, 5).map(req => (
                  <li key={req.id} className="p-4 hover:bg-muted/30 transition-colors flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-foreground">{req.id} - {req.farmerName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{req.cropType} • {req.village}</p>
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
            <h3 className="font-semibold text-foreground">System Audit Log</h3>
            <Link href="/logs" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
              Full Log <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-0 flex-1">
            {isLoadingLogs ? (
              <div className="p-8 text-center text-muted-foreground text-sm">Loading logs...</div>
            ) : (
              <ul className="divide-y divide-border">
                {logs?.slice(0, 5).map(log => (
                  <li key={log.id} className="p-4 hover:bg-muted/30 transition-colors">
                    <p className="text-sm text-foreground">{log.action}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span className="font-medium text-slate-700">{log.user}</span>
                      <span>•</span>
                      <span>{format(new Date(log.timestamp), 'MMM dd, HH:mm')}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
