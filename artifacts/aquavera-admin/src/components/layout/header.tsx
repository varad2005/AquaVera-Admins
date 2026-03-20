import { Bell, Search, User } from "lucide-react";
import { useRole } from "@/context/role-context";

export function Header() {
  const { role } = useRole();

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search Request ID, Farmer Name, or Land ID..." 
            className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full border-2 border-card"></span>
        </button>
        
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
