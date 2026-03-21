import { useLanguage } from "@/context/language-context";
import { Link } from "wouter";
import { ExternalLink, Mail, Phone, MapPin } from "lucide-react";

export function GlobalFooter() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="container py-16 px-6 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-6">
          <Link href="/">
            <a className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 pill shadow-sm" />
              <div className="flex flex-col">
                <span className="text-xl font-black text-slate-800 tracking-tight">AquaVera</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Agricultural Portal</span>
              </div>
            </a>
          </Link>
          <p className="text-sm text-slate-500 leading-relaxed font-medium max-w-xs">
            An official digital initiative to optimize water resources for sustainable agriculture and farmer empowerment.
          </p>
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-primary transition-all cursor-pointer group">
               <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white" />
             </div>
          </div>
        </div>
        
        <div className="lg:pl-8">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-[0.2em] mb-6">Quick Links</h4>
          <ul className="space-y-4 text-[13px] text-slate-500 font-bold">
            <li><a href="#home" className="hover:text-primary transition-colors flex items-center gap-2"> {t("nav.home")}</a></li>
            <li><a href="#about" className="hover:text-primary transition-colors flex items-center gap-2"> {t("nav.about")}</a></li>
            <li><a href="#feedback" className="hover:text-primary transition-colors flex items-center gap-2"> {t("nav.feedback")}</a></li>
            <li><a href="#contact" className="hover:text-primary transition-colors flex items-center gap-2"> {t("nav.contact")}</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-[0.2em] mb-6">Resources</h4>
          <ul className="space-y-4 text-[13px] text-slate-500 font-bold">
            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Help & Support</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-[0.2em] mb-6">Official Contact</h4>
          <ul className="space-y-5 text-[13px] text-slate-500 font-bold">
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span>Krishi Bhawan, New Delhi - 110001</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-primary shrink-0" />
              <span>1800-123-4455</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <span>support@aquavera.gov.in</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container px-6 pt-8 pb-12 border-t border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            &copy; {year} AquaVera. {t("footer.rights")}
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-[10px] uppercase font-black tracking-widest text-slate-300">
            <span className="hover:text-primary cursor-pointer transition-colors">Website Policies</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Help</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Contact Us</span>
          </div>
          <div className="text-[9px] text-slate-300 font-bold uppercase tracking-tight">
            Last Updated: March 21, 2026
          </div>
        </div>
      </div>
    </footer>
  );
}
