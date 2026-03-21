import { useLanguage } from "@/context/language-context";

export function LandingFooter() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30 py-12 px-6">
      <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-8 h-8" />
            <span className="text-xl font-bold text-primary">AquaVera</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Smart water management for a sustainable future. Empowering farmers with innovation.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#home" className="hover:text-primary transition-colors">{t("nav.home")}</a></li>
            <li><a href="#about" className="hover:text-primary transition-colors">{t("nav.about")}</a></li>
            <li><a href="#contact" className="hover:text-primary transition-colors">{t("nav.contact")}</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#faqs" className="hover:text-primary transition-colors">{t("nav.faqs")}</a></li>
            <li><a href="#feedback" className="hover:text-primary transition-colors">{t("nav.feedback")}</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Newsletter</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Stay updated with our latest irrigation technology.
          </p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email" 
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-white px-3 h-9">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      
      <div className="container mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
        <p>&copy; {year} AquaVera. {t("footer.rights")}</p>
      </div>
    </footer>
  );
}
