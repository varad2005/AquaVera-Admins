import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Droplets, 
  Users, 
  FileText, 
  Settings,
  LogOut,
  ShieldCheck
} from "lucide-react";
import { useRole } from "@/context/role-context";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();
  const { isAdmin, role } = useRole();

  const { t } = useLanguage();
  const navItems = [
    { href: "/dashboard", label: t("sidebar.dashboard"), icon: LayoutDashboard, visible: true },
    { href: "/requests", label: t("sidebar.requests"), icon: Droplets, visible: true },
    { href: "/farmers", label: t("sidebar.farmers"), icon: Users, visible: true },
    { href: "/users", label: t("sidebar.users"), icon: ShieldCheck, visible: isAdmin },
    { href: "/logs", label: t("sidebar.logs"), icon: FileText, visible: isAdmin },
  ];

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col h-screen fixed left-0 top-0 overflow-y-auto border-r border-sidebar-border z-20">
      <div className="p-6 flex items-center gap-3 border-b border-sidebar-border/50">
        <div className="bg-white/10 p-1.5 rounded-md overflow-hidden">
          <img 
            src="/logo.png" 
            alt="AquaVera Logo" 
            className="w-10 h-10 object-contain"
          />
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-tight leading-none text-white">AquaVera</h1>
          <p className="text-[10px] text-sidebar-foreground/60 uppercase tracking-wider mt-1 font-semibold">{t("sidebar.gov_portal")}</p>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="flex items-center gap-3 px-3 py-2 bg-sidebar-border/50 rounded-md border border-sidebar-border/50 mb-6">
          <div className="bg-slate-700 p-1.5 rounded-md">
            <ShieldCheck className="w-4 h-4 text-slate-300" />
          </div>
          <div>
            <p className="text-xs text-sidebar-foreground/60 font-medium">{t("sidebar.logged_in_as")}</p>
            <p className="text-sm font-semibold text-white">{role}</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.filter(item => item.visible).map((item) => {
            const isActive = location.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-sidebar-active text-sidebar-active-foreground shadow-sm" 
                  : "text-sidebar-foreground/70 hover:bg-sidebar-border/50 hover:text-white"
              )}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-sidebar-border/50">
        <button 
          onClick={() => window.location.assign('/')}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-left rounded-md text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-border/50 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {t("sidebar.secure_logout")}
        </button>
      </div>
    </aside>
  );
}
