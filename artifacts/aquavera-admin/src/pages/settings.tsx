import { AppLayout } from "@/components/layout/app-layout";
import { useRole } from "@/context/role-context";
import { User, Shield, BellRing, Database } from "lucide-react";

export default function Settings() {
  const { role, user } = useRole();

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Platform Settings</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage preferences and platform configuration.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Profile Section */}
            <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden">
              <div className="p-5 border-b border-border flex items-center gap-3 bg-slate-50/50">
                <User className="w-5 h-5 text-slate-600" />
                <h2 className="font-semibold text-foreground">Personal Profile</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Full Name</label>
                    <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 select-none">
                      {user.name}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Department</label>
                    <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 select-none">
                      {user.department}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Official Email</label>
                    <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 select-none">
                      {user.email}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Phone Number</label>
                    <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 select-none">
                      {user.phone}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Officer ID</label>
                    <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black text-primary/60 bg-primary/5 select-all">
                      {user.id}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden">
              <div className="p-5 border-b border-border flex items-center gap-3 bg-slate-50/50">
                <BellRing className="w-5 h-5 text-slate-600" />
                <h2 className="font-semibold text-foreground">Notification Preferences</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-foreground">New Allocation Requests</p>
                    <p className="text-xs text-muted-foreground">Receive alerts when new requests enter the queue</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="w-full h-px bg-border my-2"></div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-foreground">Anomaly Flags (Urgent)</p>
                    <p className="text-xs text-muted-foreground">Alerts for AI confidence score mismatches</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden text-center">
              <div className="p-5 border-b border-border flex items-center justify-center gap-2 bg-primary/5">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-bold text-primary uppercase text-xs tracking-widest">{role} Session</span>
              </div>
              <div className="p-4 bg-primary/10">
                <p className="text-[10px] font-bold text-primary/70 uppercase mb-1">Authenticated via</p>
                <p className="text-xs font-black text-primary">AquaVera Govt Cloud</p>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden">
              <div className="p-5 border-b border-border flex items-center gap-3 bg-slate-50/50">
                <Database className="w-5 h-5 text-slate-600" />
                <h2 className="font-semibold text-foreground">System Info</h2>
              </div>
              <div className="p-6 space-y-3 text-sm">
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-medium font-mono text-xs mt-0.5 text-slate-700">v2.4.1-gov</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Environment</span>
                  <span className="font-medium text-green-600">Production</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Sync</span>
                  <span className="font-medium">12 mins ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
