import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";
import { LandingLayout } from "@/components/layout/landing-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  Droplets, 
  MapPin, 
  Mail, 
  Phone,
  ArrowRight,
  Wind,
  Sun,
  Activity,
  Database,
  ShieldCheck,
  TrendingUp,
  FileText,
  Zap,
  Eye,
  CreditCard
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const billingData = [
  { name: 'Jan', usage: 85, cost: 2100 },
  { name: 'Feb', usage: 62, cost: 1550 },
  { name: 'Mar', usage: 110, cost: 2750 },
];

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <LandingLayout>
      {/* Hero Section */}
      <section id="home" className="relative min-h-[95vh] flex items-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-smart-farm.png" 
            alt="Smart Irrigation" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-12 py-20">
          <div className="lg:col-span-7 space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{t("hero.badge")}</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[0.95]"
            >
              {t("hero.title.styled").split('|')[0]} <br />
              <span className="text-emerald-400 text-6xl md:text-8xl">{t("hero.title.styled").includes('|') ? t("hero.title.styled").split('|')[1] : ""}</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed max-w-[700px]"
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link href="/auth/signup">
                <Button size="lg" className="h-16 px-10 text-lg font-bold rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl shadow-emerald-500/30 transition-all border-none">
                  {t("hero.cta")} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>

          <div className="lg:col-span-5 relative">
            {/* Cards removed as per user request */}
          </div>
        </div>
      </section>

      {/* Core Technology: 7/12 & satellite */}
      <section id="about" className="py-32 bg-white flex items-center overflow-hidden">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-slate-100 group"
          >
            <img src="/images/satellite-verify.png" alt="Satellite Verification" className="w-full h-auto" />
            
            {/* Professional Govt Overlay - Top Left */}
            <div className="absolute top-8 left-8 p-5 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-slate-200/50 max-w-[240px] z-20">
              <div className="flex gap-3 items-center mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">{t("about.cadastral_sync")}</span>
              </div>
              <p className="text-sm font-bold text-slate-800 leading-tight">{t("about.verified_desc")}</p>
            </div>

            {/* Scanning Effect Overlay */}
            <div className="absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent top-0 animate-[scan_4s_linear_infinite]" />
          </motion.div>

          <div className="space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t("about.security_first")}</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1] tracking-tight">
                {t("features.title.styled").split('|')[0]} 
                <span className="text-emerald-500">{t("features.title.styled").includes('|') ? t("features.title.styled").split('|')[1] : ""}</span>
              </h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-[500px]">{t("features.desc")}</p>
            </div>

            <div className="grid gap-8">
              {[
                { 
                  title: t("feature.1.title"), 
                  desc: t("feature.1.desc"),
                  icon: FileText,
                  color: "bg-blue-500"
                },
                { 
                  title: t("feature.2.title"), 
                  desc: t("feature.2.desc"),
                  icon: Eye,
                  color: "bg-emerald-500"
                },
                { 
                  title: t("feature.3.title"), 
                  desc: t("feature.3.desc"),
                  icon: TrendingUp,
                  color: "bg-amber-500"
                }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 items-start"
                >
                  <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center text-white shrink-0 shadow-lg`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 pt-1">
                    <h3 className="font-black text-slate-900 tracking-tight">{feature.title}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-[400px]">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Transparent Billing Section */}
      <section id="billing" className="py-32 bg-slate-950 relative overflow-hidden">
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-[1]">
              {t("flow.title.styled").split('|')[0]} <br />
              <span className="text-emerald-500">{t("flow.title.styled").includes('|') ? t("flow.title.styled").split('|')[1] : ""}</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-8"
            >
              {/* Coded Premium Billing UI */}
              <div className="relative rounded-[3.5rem] bg-white p-8 md:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20">
                <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
                      <Zap className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">AQUAVERA IRRIGATION</h3>
                      <p className="text-2xl font-black text-slate-900 tracking-tight">{t("billing.invoice_no")} #AF-20231021-01</p>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="px-4 py-1.5 rounded-full bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest border border-red-200">{t("billing.unpaid")}</span>
                    <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest italic">{t("billing.pay_now")} →</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t("billing.farmer_name")}</p>
                    <p className="text-sm font-bold text-slate-800">Ravi Patel</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t("billing.location")}</p>
                    <p className="text-sm font-bold text-slate-800">Anand, Gujarat</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Land ID</p>
                    <p className="text-sm font-bold text-slate-800">AP-8922</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Period</p>
                    <p className="text-sm font-bold text-slate-800">Oct 01 - Oct 31</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <div className="p-8 rounded-[2.5rem] bg-emerald-50/50 border border-emerald-100/50 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                        <Droplets className="w-5 h-5" />
                      </div>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">{t("billing.water_usage")}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-5xl font-black text-emerald-600 tracking-tighter">125,000</p>
                      <p className="text-xs font-bold text-emerald-900/40 uppercase tracking-widest">Liters Consumed</p>
                    </div>
                  </div>

                  <div className="p-8 rounded-[2.5rem] bg-slate-950 text-white flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-xl bg-white/10 text-emerald-400">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">{t("billing.bill_amount")}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-5xl font-black text-white tracking-tighter">₹4,250</p>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{t("billing.verified_satellite")}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-slate-100">
                  <div className="flex items-center gap-6">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500`}>U{i}</div>
                      ))}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified by 12+ Nodes</p>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="ghost" className="text-xs font-black uppercase text-slate-400 decoration-slate-200">{t("cta.secondary")}</Button>
                    <Button className="h-12 px-8 rounded-xl bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] hover:bg-slate-800">{t("billing.pay_now")}</Button>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="lg:col-span-4 space-y-12">
              {[
                { id: '01', title: t("flow.1.title"), desc: t("flow.1.desc") },
                { id: '02', idColor: 'text-emerald-500', title: t("flow.2.title"), desc: t("flow.2.desc") },
                { id: '03', title: t("flow.3.title"), desc: t("flow.3.desc") }
              ].map((step, i) => (
                <div key={i} className="space-y-3 relative pl-16 group">
                  <span className={`absolute left-0 top-0 text-5xl font-black transition-transform group-hover:scale-110 ${step.idColor || 'text-white/25'}`}>{step.id}</span>
                  <h3 className="text-xl font-black text-white tracking-tight">{step.title}</h3>
                  <p className="text-slate-400 font-medium text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section id="feedback" className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">{t("feedback.sect_title")}</h2>
            <div className="h-1.5 w-24 bg-emerald-500 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 relative"
              >
                <Zap className="absolute top-8 right-8 w-8 h-8 text-emerald-500/10" />
                <p className="text-lg font-medium text-slate-600 mb-6 italic leading-relaxed">
                  "{t(`feedback.${i}.quote`)}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                    {t(`feedback.${i}.author` || 'F').charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">{t(`feedback.${i}.author`)}</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t(`feedback.${i}.location`) || 'Verified Farmer'}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="py-32 bg-slate-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">{t("faqs.sect_title")}</h2>
            <p className="text-slate-500 font-medium">{t("faqs.title")}</p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {[1, 2].map((i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-white border border-slate-200 rounded-3xl px-8 overflow-hidden transition-all data-[state=open]:border-emerald-500/50 data-[state=open]:shadow-xl">
                <AccordionTrigger className="hover:no-underline py-6">
                  <span className="text-left font-black text-slate-800 tracking-tight">{t(`faq.${i}.q`)}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-slate-500 font-medium leading-relaxed">
                  {t(`faq.${i}.a`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-white">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-none">
              {t("contact.sect_title")}
            </h2>
            <div className="space-y-8">
              <div className="flex gap-6 items-start group">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-lg group-hover:bg-emerald-500 transition-colors">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">{t("contact.office")}</h4>
                  <p className="text-slate-500 font-medium">{t("footer.address")}</p>
                </div>
              </div>
              <div className="flex gap-6 items-start group">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-lg group-hover:bg-emerald-500 transition-colors">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">{t("contact.support")}</h4>
                  <p className="text-slate-500 font-medium">+91 1800-AQUA-VERA</p>
                </div>
              </div>
              <div className="flex gap-6 items-start group">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-lg group-hover:bg-emerald-500 transition-colors">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Email Inquiry</h4>
                  <p className="text-slate-500 font-medium">support@aquavera.gov.in</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-10 rounded-[3rem] bg-slate-950 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
            <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">{t("contact.name")}</label>
                <Input className="bg-white/5 border-white/10 h-14 rounded-xl focus:bg-white/10 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">{t("contact.email")}</label>
                <Input className="bg-white/5 border-white/10 h-14 rounded-xl focus:bg-white/10 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">{t("contact.message")}</label>
                <Textarea className="bg-white/5 border-white/10 min-h-[120px] rounded-xl focus:bg-white/10 transition-colors pt-4" />
              </div>
              <Button className="w-full h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-600 font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-500/20">
                {t("contact.send")}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-slate-950 rounded-[4rem] p-12 md:p-32 text-center text-white relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(16,185,129,0.3)]"
          >
            <div className="relative z-10 space-y-12 max-w-[800px] mx-auto text-center flex flex-col items-center">
              <h2 className="text-4xl md:text-7xl font-black leading-[1.05] tracking-tight">
                {t("cta.title.styled").split('|')[0]} 
                <span className="text-emerald-500 mx-4">{t("cta.title.styled").split('|')[1]}</span> 
                {t("cta.title.styled").split('|')[2]}
              </h2>
              <div className="flex flex-wrap gap-6 justify-center">
                <Link href="/auth/signup">
                  <Button size="lg" className="h-20 px-12 text-lg font-black rounded-3xl bg-emerald-500 text-white hover:bg-emerald-600 shadow-2xl shadow-emerald-500/30">
                    {t("cta.main")}
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-20 px-12 text-lg font-black rounded-3xl border-2 border-white/20 text-white bg-transparent hover:bg-white/10 transition-colors">
                  {t("cta.secondary")}
                </Button>
              </div>
            </div>
            {/* Visual Flairs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -ml-48 -mb-48" />
          </motion.div>
        </div>
      </section>

      {/* Footer Branding */}
      <section className="py-20 bg-slate-100 text-slate-400">
        <div className="container mx-auto px-6 text-center space-y-8">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 leading-none">{t("footer.tagline")}</p>
          <div className="h-[1px] w-32 bg-slate-200 mx-auto" />
          <div className="flex justify-center gap-12 font-bold text-[10px] uppercase tracking-widest">
            <Link href="/auth/signup" className="hover:text-emerald-500">{t("nav.signup")}</Link>
            <Link href="/auth/login" className="hover:text-emerald-500">{t("nav.login")}</Link>
            <span className="cursor-pointer hover:text-emerald-500">{t("footer.policy")}</span>
            <a href="/#contact" className="hover:text-emerald-500">{t("nav.contact")}</a>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
