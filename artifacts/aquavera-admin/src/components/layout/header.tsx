import { Bell, Search, User, FileText, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { useRole } from "@/context/role-context";
import { useState } from "react";
import { useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "New Irrigation Request",
    description: "Farmer: Rajesh Kumar (MH-PUNE-122)",
    time: "2 mins ago",
    type: "request",
    icon: FileText,
    color: "text-blue-500",
    bgColor: "bg-blue-50"
  },
  {
    id: 2,
    title: "Land Match Verified",
    description: "Cadastral ID #AV-PUNE-8922 matched 100%",
    time: "1 hour ago",
    type: "success",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50"
  },
  {
    id: 3,
    title: "System Alert",
    description: "Unusual water flow detected in Sector 4",
    time: "3 hours ago",
    type: "warning",
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-50"
  }
];

export function Header() {
  const { role } = useRole();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [hasUnread, setHasUnread] = useState(true);

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search Request ID, Farmer Name, or Land ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && search) {
                setLocation(`/requests?q=${encodeURIComponent(search)}`);
              }
            }}
            className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <DropdownMenu onOpenChange={(open) => { if(open) setHasUnread(false) }}>
          <DropdownMenuTrigger asChild>
            <button className="relative text-muted-foreground hover:text-foreground transition-colors outline-none">
              <Bell className="w-5 h-5" />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full border-2 border-card"></span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden rounded-xl border-border shadow-2xl">
            <DropdownMenuLabel className="p-4 bg-muted/30 flex justify-between items-center">
              <span className="text-sm font-bold tracking-tight">System Notifications</span>
              <span className="text-[10px] font-black uppercase text-primary bg-primary/10 px-2 py-0.5 rounded">3 New</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="m-0" />
            <div className="max-h-[350px] overflow-y-auto">
              {MOCK_NOTIFICATIONS.map((notif) => (
                <DropdownMenuItem key={notif.id} className="p-4 focus:bg-muted/50 cursor-pointer border-b border-border/50 last:border-0">
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-xl ${notif.bgColor} flex items-center justify-center shrink-0`}>
                      <notif.icon className={`w-5 h-5 ${notif.color}`} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-foreground leading-none">{notif.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{notif.description}</p>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-1">
                        <Clock className="w-3 h-3" />
                        <span>{notif.time}</span>
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator className="m-0" />
            <button className="w-full p-3 text-xs font-bold text-primary hover:bg-primary/5 transition-colors">
              View All Notifications
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="h-6 w-px bg-border"></div>
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Officer Desk</p>
            <p className="text-xs text-muted-foreground">{role} Portal</p>
          </div>
          <div className="bg-primary/10 p-2 rounded-md border border-primary/20">
            <User className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}
