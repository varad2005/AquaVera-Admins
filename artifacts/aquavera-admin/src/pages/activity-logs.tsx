import { AppLayout } from "@/components/layout/app-layout";
import { useLogs } from "@/hooks/use-mock-api";
import { format } from "date-fns";
import { Shield, Download, Calendar } from "lucide-react";
import { useRole } from "@/context/role-context";
import { useToast } from "@/hooks/use-toast";

import { useLanguage } from "@/context/language-context";

export default function ActivityLogs() {
  const { t } = useLanguage();
  const { isAdmin } = useRole();
  const { toast } = useToast();
  const { data: logs, isLoading } = useLogs();

  const handleExportCSV = () => {
    if (!logs || logs.length === 0) {
      toast({ 
        title: "Export Error", 
        description: "No logs available to export.", 
        variant: "destructive" 
      });
      return;
    }

    const headers = ["Timestamp", "User", "Role", "Action Event", "IP Address"];
    const rows = logs.map((log: any) => [
      format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss'),
      log.user,
      log.role,
      log.action,
      log.ip
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row: string[]) => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `aqua_vera_audit_logs_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({ 
      title: "Export Success", 
      description: `Audit logs (${logs.length} entries) exported to CSV successfully!` 
    });
  };

  if (!isAdmin) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <Shield className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-foreground mb-2">{t("logs.access_denied")}</h2>
          <p className="text-muted-foreground">{t("logs.restricted")}</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("logs.title")}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{t("logs.subtitle")}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => toast({ title: t("common.filter"), description: "Date range filtering coming soon!" })}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors"
          >
            <Calendar className="w-4 h-4" />
            {t("logs.last_7_days")}
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors text-primary border-primary/20 hover:bg-primary/5"
          >
            <Download className="w-4 h-4" />
            {t("logs.export_csv")}
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden flex flex-col h-[calc(100vh-200px)]">
        <div className="flex-1 overflow-auto p-0">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/50 sticky top-0 z-10 shadow-sm shadow-black/5">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-48">{t("logs.timestamp")}</th>
                <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-64">{t("logs.user_role")}</th>
                <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("logs.action_event")}</th>
                <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-32">{t("logs.ip_address")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">{t("common.loading")}</td>
                </tr>
              ) : (
                logs?.map((log: any) => { // Changed Log to any to match existing usage
                  let action = log.action;
                  if (log.id === 'LOG-1') action = t("log.action.approved").replace("{id}", "#REQ-1003");
                  else if (log.id === 'LOG-2') action = t("log.action.auto_flagged").replace("{id}", "#REQ-1002");
                  else if (log.id === 'LOG-3') action = t("log.action.assigned").replace("{id}", "#REQ-1001");
                  else if (log.id === 'LOG-4') action = t("log.action.updated_settings");
                  else if (log.id === 'LOG-5') action = t("log.action.deactivated_user").replace("{id}", "#USR-003");

                  return (
                    <tr key={log.id} className="hover:bg-muted/20 transition-colors font-mono"> {/* Reverted to original row classes */}
                      <td className="px-6 py-3 whitespace-nowrap text-muted-foreground"> {/* Reverted to original cell classes */}
                        {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')} {/* Reverted to original date format */}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap"> {/* Reverted to original cell classes */}
                        <span className="font-semibold text-slate-800 font-sans">{log.user}</span> {/* Reverted to original user classes */}
                        <span className="ml-2 text-[10px] uppercase tracking-wider bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-sans border border-slate-200">{log.role}</span> {/* Reverted to original role classes */}
                      </td>
                      <td className="px-6 py-3 text-foreground font-sans"> {/* Reverted to original cell classes */}
                        {action}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-muted-foreground text-xs"> {/* Reverted to original cell classes */}
                        {log.ip}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
