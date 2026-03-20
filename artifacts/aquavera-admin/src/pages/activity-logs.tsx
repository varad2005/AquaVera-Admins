import { AppLayout } from "@/components/layout/app-layout";
import { useLogs } from "@/hooks/use-mock-api";
import { format } from "date-fns";
import { Shield, Download, Calendar } from "lucide-react";
import { useRole } from "@/context/role-context";

export default function ActivityLogs() {
  const { data: logs, isLoading } = useLogs();
  const { isAdmin } = useRole();

  if (!isAdmin) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <Shield className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground">Audit logs are restricted to Administrator roles only.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Audit Logs</h1>
          <p className="text-muted-foreground mt-1 text-sm">Immutable record of all system and user actions.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors">
            <Calendar className="w-4 h-4" />
            Last 7 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors text-primary border-primary/20 hover:bg-primary/5">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden flex flex-col h-[calc(100vh-200px)]">
        <div className="flex-1 overflow-auto p-0">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/50 sticky top-0 z-10 shadow-sm shadow-black/5">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-48">Timestamp</th>
                <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-64">User & Role</th>
                <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action Event</th>
                <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-32">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">Loading audit trail...</td>
                </tr>
              ) : (
                logs?.map(log => (
                  <tr key={log.id} className="hover:bg-muted/20 transition-colors font-mono">
                    <td className="px-6 py-3 whitespace-nowrap text-muted-foreground">
                      {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className="font-semibold text-slate-800 font-sans">{log.user}</span>
                      <span className="ml-2 text-[10px] uppercase tracking-wider bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-sans border border-slate-200">{log.role}</span>
                    </td>
                    <td className="px-6 py-3 text-foreground font-sans">
                      {log.action}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-muted-foreground text-xs">
                      {log.ip}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
