import React from "react";
import { Link } from "wouter";
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
  MessageSquare,
  HelpCircle
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <LandingLayout>
      {/* Hero Section */}
      <section id="home" className="relative py-24 lg:py-40 overflow-hidden bg-white border-b border-slate-100">
        <div className="container mx-auto relative z-10 grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8 animate-in slide-in-from-left duration-700 max-w-[640px] mx-auto lg:mx-0 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mx-auto lg:mx-0">
              <Droplets className="w-3.5 h-3.5" />
              <span>Official Digital Initiative</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
              {t("hero.title")}
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
              <Link href="/auth/signup">
                <Button size="lg" className="h-14 px-10 text-lg font-bold rounded-xl bg-primary text-white shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all border-none">
                  {t("hero.cta")} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold rounded-xl border-slate-200 text-slate-700 bg-white hover:bg-slate-50">
                Explore Portal
              </Button>
            </div>
          </div>
          <div className="relative animate-in slide-in-from-right duration-700 max-w-[500px] lg:max-w-none mx-auto w-full">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-[12px] border-white ring-1 ring-slate-200">
              <img 
                src="https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=1000" 
                alt="Modern Farming" 
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-teal-500/20 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto">
          <div className="text-center max-w-[800px] mx-auto mb-20 space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">{t("about.title")}</h2>
            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full mb-6" />
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              {t("about.desc")}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { 
                title: "Resource Optimization", 
                desc: "Strategic water allocation driven by satellite imagery and local sensor data.",
                icon: Droplets 
              },
              { 
                title: "Stakeholder Portal", 
                desc: "A unified platform for farmers, administrators, and field officers.",
                icon: CheckCircle 
              },
              { 
                title: "National Coverage", 
                desc: "Scaling across districts to ensure equitable water distribution for all.",
                icon: MapPin 
              }
            ].map((feature, i) => (
              <div key={i} className="p-10 rounded-2xl bg-white border border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 border border-slate-100 group-hover:bg-primary/5 transition-colors">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-black mb-4 text-slate-900 tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 text-sm font-bold leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section id="feedback" className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-center md:text-left">
            <div className="space-y-4 max-w-[640px] mx-auto md:mx-0">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">{t("feedback.title")}</h2>
              <p className="text-lg text-slate-500 font-medium">Validating our impact through direct feedback from farmers.</p>
            </div>
            <Button variant="outline" className="rounded-xl border-slate-200 font-bold text-xs uppercase tracking-widest px-6 h-12 bg-white w-full md:w-auto">Public Testimonials</Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-10 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map(s => <span key={s} className="text-amber-500 text-lg">★</span>)}
                </div>
                <p className="text-slate-700 font-medium italic mb-8 leading-relaxed">"{t("feedback.1.text")}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center font-black text-primary">
                     {t("feedback.1.author")[0]}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 tracking-tight">{t("feedback.1.author")}</p>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{i === 1 ? "Wheat Farmer, Pune" : i === 2 ? "Rice Cultivator, Vidarbha" : "Horticulturist, Nashik"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="container grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">{t("contact.title")}</h2>
              <div className="w-16 h-1 bg-primary rounded-full mb-6" />
              <p className="text-lg text-slate-500 font-medium">For official inquiries, policy clarifications, or technical support, please contact our specialized desks.</p>
            </div>
            
            <div className="space-y-8">
              {[
                { icon: Mail, label: "Digital Support", value: "helpdesk-av@nic.in" },
                { icon: Phone, label: "Toll-Free Helpline", value: "1800-445-6677" },
                { icon: MapPin, label: "Headquarters", value: "Krishi Bhawan, Dr. Rajendra Prasad Rd, New Delhi" }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary shrink-0 hover:bg-primary/5 transition-colors">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{item.label}</p>
                    <p className="font-black text-slate-800 tracking-tight">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 md:p-12 rounded-3xl border border-slate-200 shadow-2xl relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
            <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{t("contact.name")}</label>
                <Input placeholder="Enter your full name" className="h-12 rounded-xl border-slate-200 font-bold text-sm bg-slate-50/50" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{t("contact.email")}</label>
                <Input type="email" placeholder="official@example.gov.in" className="h-12 rounded-xl border-slate-200 font-bold text-sm bg-slate-50/50" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{t("contact.message")}</label>
                <Textarea placeholder="Describe your inquiry in detail..." className="min-h-[140px] rounded-xl border-slate-200 font-bold text-sm bg-slate-50/50" />
              </div>
              <Button className="w-full h-14 text-sm font-black uppercase tracking-[0.2em] rounded-xl mt-4 bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200">
                {t("contact.send")}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container max-w-[800px]">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{t("faqs.title")}</h2>
            <p className="text-lg text-slate-500 font-medium italic">Standard Operating Procedures & Common Clarifications.</p>
          </div>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-white px-8 py-2 rounded-2xl border border-slate-200 shadow-sm hover:border-primary/30 transition-all">
                <AccordionTrigger className="text-left font-black text-slate-800 hover:text-primary transition-colors hover:no-underline py-4 text-base tracking-tight">
                  {i === 1 ? t("faqs.1.q") : i === 2 ? t("faqs.2.q") : i === 3 ? "How do I update my registered mobile number?" : "Is there a portal mobile application?"}
                </AccordionTrigger>
                <AccordionContent className="text-slate-500 leading-relaxed font-bold text-sm pb-6">
                  {i === 1 ? t("faqs.1.a") : i === 2 ? t("faqs.2.a") : i === 3 ? "Registered mobile numbers can be updated via the 'Profile Settings' after secure OTP validation of the existing number." : "Yes, the official mobile application follows the same security protocols and is available on major app stores."}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl border-4 border-primary/20">
            <div className="relative z-10 space-y-10 max-w-[800px] mx-auto">
              <h2 className="text-3xl md:text-5xl font-black leading-[1.15] tracking-tight">Modernize your agricultural operations today</h2>
              <p className="text-xl text-slate-400 font-bold max-w-[600px] mx-auto leading-relaxed">Secure your resource distribution and join a nationwide network of smart farmers.</p>
              <div className="flex flex-wrap gap-6 justify-center">
                <Link href="/auth/signup">
                  <Button size="lg" className="h-16 px-12 text-sm font-black uppercase tracking-[0.2em] rounded-xl bg-white text-slate-900 hover:bg-slate-100 transition-all border-none shadow-xl">
                    Register Now
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-16 px-12 text-sm font-black uppercase tracking-[0.2em] rounded-xl border-2 border-white/20 text-white bg-transparent hover:bg-white/10">
                  Contact Nodal Office
                </Button>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -mr-40 -mt-40" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-800/50 rounded-full blur-[100px] -ml-40 -mb-40" />
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
