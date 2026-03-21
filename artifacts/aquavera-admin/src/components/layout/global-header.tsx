import React from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/context/language-context";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe, Menu, Search, User } from "lucide-react";

export function GlobalHeader() {
  const { t, language, setLanguage } = useLanguage();
  const [location] = useLocation();
  
  const isLoginPage = location === "/auth/login";

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi (हिन्दी)" },
    { code: "mr", name: "Marathi (मराठी)" },
  ];

  const currentLangName = languages.find(l => l.code === language)?.name || "English";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <a className="flex items-center gap-3 group">
              <img src="/logo.png" alt="Logo" className="w-12 h-12 transition-transform group-hover:scale-105" />
              <div className="flex flex-col border-l pl-3 border-slate-200">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mb-0.5">Govt. of India | MoA&FW</span>
                <span className="text-xl font-black text-slate-800 tracking-tight leading-none group-hover:text-primary transition-colors">AquaVera</span>
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-0.5">Smart Irrigation Portal</span>
              </div>
            </a>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-[13px] font-bold uppercase tracking-wider text-slate-600">
          <a href="/#home" className="hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary py-7">{t("nav.home")}</a>
          <a href="/#about" className="hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary py-7">{t("nav.about")}</a>
          <a href="/#feedback" className="hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary py-7">{t("nav.feedback")}</a>
          <a href="/#contact" className="hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary py-7">{t("nav.contact")}</a>
          <a href="/#faqs" className="hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary py-7">{t("nav.faqs")}</a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center bg-slate-100 rounded-lg px-3 py-1.5 border border-slate-200 mr-1">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-xs w-20 focus:w-36 transition-all font-medium" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2 text-slate-600 font-bold text-[11px] uppercase tracking-wider">
                <Globe className="w-4 h-4" /> {currentLangName}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem 
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as any)}
                  className="text-xs font-bold uppercase tracking-wider"
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link href={isLoginPage ? "/auth/signup" : "/auth/login"}>
            <Button size="sm" variant="outline" className="font-bold text-[11px] uppercase tracking-widest border-2 hover:bg-primary hover:text-white transition-all">
              <User className="w-3 h-3 mr-2" /> {isLoginPage ? t("nav.signup") : t("nav.login")}
            </Button>
          </Link>
          
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
