import { Bell, Search, User, FileText, CheckCircle2, AlertTriangle, Clock, Settings, LogOut, Mail, Phone, Building2 } from "lucide-react";
import { useRole } from "@/context/role-context";
import { useState } from "react";
import { useLocation, Link } from "wouter";
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
    bgColor: "bg-blue-50",
    href: "/requests"
  },
  {
    id: 2,
    title: "Land Match Verified",
    description: "Cadastral ID #AV-PUNE-8922 matched",
    time: "1 hour ago",
    type: "success",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    href: "/farmers"
  },
  {
    id: 3,
    title: "System Alert",
    description: "Unusual water flow: Sector 4",
    time: "3 hours ago",
    type: "warning",
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    href: "/logs"
  }
];

export function Header() {
  const { role, user } = useRole();
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
            className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <DropdownMenu onOpenChange={(open) => { if(open) setHasUnread(false) }}>
          <DropdownMenuTrigger asChild>
            <button className="relative text-muted-foreground hover:text-foreground transition-all duration-300 outline-none p-2 rounded-lg hover:bg-muted/50 group">
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {hasUnread && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-card ring-2 ring-destructive/20 animate-pulse"></span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[340px] p-0 overflow-hidden rounded-2xl border-border shadow-2xl bg-white/95 backdrop-blur-md">
            <DropdownMenuLabel className="p-5 flex justify-between items-center border-b border-border/40 bg-slate-50/50">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Alerts & Insights</span>
              {hasUnread && <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Recent</span>}
            </DropdownMenuLabel>
            <div className="py-2">
              {MOCK_NOTIFICATIONS.map((notif) => (
                <DropdownMenuItem 
                  key={notif.id} 
                  onClick={() => setLocation(notif.href)}
                  className="px-5 py-4 focus:bg-slate-50 cursor-pointer flex gap-4 transition-colors relative group"
                >
                  <div className={`w-10 h-10 rounded-xl ${notif.bgColor} flex items-center justify-center shrink-0 shadow-sm border border-black/5`}>
                    <notif.icon className={`w-5 h-5 ${notif.color}`} />
                  </div>
                  <div className="space-y-1 pr-6">
                    <p className="text-sm font-bold text-slate-900 leading-none group-hover:text-primary transition-colors">{notif.title}</p>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{notif.description}</p>
                    <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider pt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{notif.time}</span>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="h-6 w-px bg-border"></div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer group hover:bg-muted/30 p-1.5 rounded-xl transition-all">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{user.name}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{user.role} Portal</p>
              </div>
              <div className="bg-primary/10 p-2 rounded-xl border border-primary/20 shadow-sm group-hover:shadow-md transition-all">
                <User className="w-5 h-5 text-primary" />
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[300px] p-0 overflow-hidden rounded-2xl border-border shadow-2xl bg-white/95 backdrop-blur-md">
            <div className="p-6 bg-slate-50/50 border-b border-border/40">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-black text-slate-900 leading-none">{user.name}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{user.id}</p>
                </div>
              </div>
            </div>
            
            <div className="p-2">
              <div className="px-4 py-3 space-y-3">
                <div className="flex items-center gap-3 text-slate-500">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <Phone className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">{user.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <Building2 className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">{user.department}</span>
                </div>
              </div>

              <DropdownMenuSeparator className="mx-2 my-2 opacity-50" />
              
              <DropdownMenuItem onClick={() => setLocation('/settings')} className="mx-2 p-3 rounded-xl focus:bg-slate-50 cursor-pointer flex gap-3 group">
                <Settings className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Platform Settings</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => window.location.assign('/')} className="mx-2 p-3 rounded-xl focus:bg-destructive/5 cursor-pointer flex gap-3 group">
                <LogOut className="w-4 h-4 text-slate-400 group-hover:text-destructive transition-colors" />
                <span className="text-xs font-bold text-slate-600 group-hover:text-destructive transition-colors">Sign Out</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
