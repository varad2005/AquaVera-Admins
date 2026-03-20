import { AppLayout } from "@/components/layout/app-layout";
import { useRole } from "@/context/role-context";
import { User, Shield, BellRing, Database } from "lucide-react";

export default function Settings() {
  const { role, setRole } = useRole();

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Platform Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage preferences and platform configuration.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Profile Section */}
          <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border flex items-center gap-3 bg-slate-50/50">
              <User className="w-5 h-5 text-slate-600" />
              <h2 className="font-semibold text-foreground">Personal Profile</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                  <input type="text" disabled value="Current Officer" className="w-full px-3 py-2 bg-muted/50 border border-border rounded-md text-sm text-muted-foreground cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Department</label>
                  <input type="text" disabled value="Water Allocation Board" className="w-full px-3 py-2 bg-muted/50 border border-border rounded-md text-sm text-muted-foreground cursor-not-allowed" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Official Email</label>
                <input type="email" disabled value="officer@aquavera.gov.in" className="w-full px-3 py-2 bg-muted/50 border border-border rounded-md text-sm text-muted-foreground cursor-not-allowed" />
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

        {/* Demo Controls - Right Column */}
        <div className="space-y-6">
          <div className="bg-primary/5 border border-primary/20 rounded-md shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full pointer-events-none"></div>
            <div className="p-5 border-b border-primary/10 flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-primary">Demo Controls</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-700 mb-4">Use this toggle to switch roles and observe the RBAC (Role-Based Access Control) changes in the sidebar and pages.</p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => setRole('Admin')}
                  className={`w-full py-2 px-4 rounded-md text-sm font-medium border transition-all ${role === 'Admin' ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20' : 'bg-card text-foreground border-border hover:bg-muted'}`}
                >
                  Assume Admin Role
                </button>
                <button 
                  onClick={() => setRole('Sub-Admin')}
                  className={`w-full py-2 px-4 rounded-md text-sm font-medium border transition-all ${role === 'Sub-Admin' ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20' : 'bg-card text-foreground border-border hover:bg-muted'}`}
                >
                  Assume Sub-Admin Role
                </button>
              </div>
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
    </AppLayout>
  );
}
