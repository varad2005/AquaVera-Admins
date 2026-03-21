import React from "react";
import { Link } from "wouter";
import { useLanguage } from "@/context/language-context";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe, Menu } from "lucide-react";

export function LandingHeader() {
  const { t, language, setLanguage } = useLanguage();

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi (हिन्दी)" },
    { code: "mr", name: "Marathi (मराठी)" },
  ];

  const currentLangName = languages.find(l => l.code === language)?.name || "English";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/">
            <a className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="w-8 h-8" />
              <span className="text-xl font-bold text-primary hidden sm:inline-block">AquaVera</span>
            </a>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#home" className="transition-colors hover:text-primary">{t("nav.home")}</a>
          <a href="#about" className="transition-colors hover:text-primary">{t("nav.about")}</a>
          <a href="#feedback" className="transition-colors hover:text-primary">{t("nav.feedback")}</a>
          <a href="#contact" className="transition-colors hover:text-primary">{t("nav.contact")}</a>
          <a href="#faqs" className="transition-colors hover:text-primary">{t("nav.faqs")}</a>
        </nav>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline-block">{currentLangName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem 
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as any)}
                  className={language === lang.code ? "bg-accent" : ""}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/auth/login">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              {t("nav.login")}
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="sm" className="bg-primary text-white">
              {t("nav.signup")}
            </Button>
          </Link>
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
