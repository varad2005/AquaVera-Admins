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
              <span>AI-Powered Water Governance</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[0.95]"
            >
              AI-Driven Irrigation <br />
              <span className="text-emerald-400 text-6xl md:text-8xl">Billing & 7/12 Recognition.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed max-w-[700px]"
            >
              Automated water auditing through satellite verification and 7/12 land record synchronization for a transparent and efficient agricultural ecosystem.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link href="/auth/signup">
                <Button size="lg" className="h-16 px-10 text-lg font-bold rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl shadow-emerald-500/30 transition-all border-none">
                  Onboard Your Farm <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>

          <div className="lg:col-span-5 relative">
            {/* Satellite 7/12 Overlay */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -top-10 -right-10 z-20 p-6 rounded-[2.5rem] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl min-w-[260px]"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-500/20">
                    <Eye className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-widest">Live Verification</span>
                </div>
                <div className="px-2 py-1 rounded bg-emerald-500/20 text-[10px] font-black text-emerald-400">MH-712</div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none mb-1">CADASTRAL ID</p>
                  <p className="text-lg font-black text-white">#AV-PUNE-8922</p>
                </div>
                <div className="h-[2px] w-full bg-white/10" />
                <div className="flex justify-between items-center text-sm font-bold text-white/80">
                  <span>Land Recognition</span>
                  <div className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Matched</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Invoicing Insights Overlay */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-40 p-8 rounded-[2.5rem] bg-white shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Billing Transparency</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verified Water Usage</p>
                </div>
                <CreditCard className="w-6 h-6 text-emerald-500" />
              </div>
              
              <div className="h-[180px] w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={billingData}>
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}}
                    />
                    <Bar dataKey="usage" fill="#10b981" radius={[4, 4, 0, 0]}>
                      {billingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 2 ? '#10b981' : '#e2e8f0'} />
                      ))}
                    </Bar>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} dy={10} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Current Dues</span>
                  <span className="text-xl font-black text-slate-900 animate-pulse">₹2,750.00</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Technology: 7/12 & satellite */}
      <section id="about" className="py-32 bg-white flex items-center">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[3rem] overflow-hidden shadow-2xl border-2 border-emerald-50"
          >
            <img src="/images/satellite-verify.png" alt="Satellite Verification" className="w-full h-auto" />
            <div className="absolute top-8 left-8 p-4 rounded-2xl bg-white/90 backdrop-blur-md shadow-lg max-w-[200px]">
              <div className="flex gap-3 items-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Cadastral Sync</span>
              </div>
              <p className="text-sm font-black text-slate-900 mt-2">7/12 Record verified via satellite map.</p>
            </div>
          </motion.div>

          <div className="space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Security First Architecture</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1] tracking-tight">Verified Records. <span className="text-emerald-500">Fair Billing.</span></h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-[500px]">We bridge the gap between traditional land records and modern billing through advanced computer vision and GIS integration.</p>
            </div>

            <div className="grid gap-8">
              {[
                { 
                  title: "Automated 7/12 Recognition", 
                  desc: "Instantly parse and verify digital land records against cadastral maps.",
                  icon: FileText,
                  color: "bg-blue-500"
                },
                { 
                  title: "Satellite Water Audit", 
                  desc: "Verify actual irrigation consumption via high-precision remote sensing telemetry.",
                  icon: Eye,
                  color: "bg-emerald-500"
                },
                { 
                  title: "AI Invoicing", 
                  desc: "Automated billing engine that eliminates manual errors and potential disputes.",
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
      <section className="py-32 bg-slate-50">
        <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-12 text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1]">How We Calculate <br /><span className="text-emerald-500">Transparent Billing</span></h2>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-8 flex justify-center"
          >
            <div className="relative rounded-[3.5rem] overflow-hidden shadow-2xl max-w-4xl border-[12px] border-white ring-1 ring-slate-100">
              <img src="/images/billing-ui.png" alt="Billing Interface" className="w-full h-auto" />
            </div>
          </motion.div>

          <div className="lg:col-span-4 space-y-10">
            {[
              { id: '01', title: 'Data Collection', desc: 'Satellite and field sensor data are collected every 6 hours.' },
              { id: '02', idColor: 'text-emerald-500', title: 'AI Verification', desc: 'AI verifies water flow against 7/12 land size and crop type.' },
              { id: '03', title: 'Invoice Issued', desc: 'Transparent billing is pushed to the farmer portal instantly.' }
            ].map((step, i) => (
              <div key={i} className="space-y-2 relative pl-10">
                <span className={`absolute left-0 top-0 text-3xl font-black ${step.idColor || 'text-slate-200'}`}>{step.id}</span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">{step.title}</h3>
                <p className="text-slate-500 font-medium text-sm">{step.desc}</p>
              </div>
            ))}
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
              <h2 className="text-4xl md:text-7xl font-black leading-[1.05] tracking-tight">Ready for the future <br /> of Water Governance?</h2>
              <div className="flex flex-wrap gap-6 justify-center">
                <Link href="/auth/signup">
                  <Button size="lg" className="h-20 px-12 text-lg font-black rounded-3xl bg-emerald-500 text-white hover:bg-emerald-600 shadow-2xl shadow-emerald-500/30">
                    Get Started Now
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-20 px-12 text-lg font-black rounded-3xl border-2 border-white/20 text-white bg-transparent hover:bg-white/10 transition-colors">
                  Speak to Admin
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
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 leading-none">AQUAVERA — THE NEXT GEN IRRIGATION SYSTEM</p>
          <div className="h-[1px] w-32 bg-slate-200 mx-auto" />
          <div className="flex justify-center gap-12 font-bold text-[10px] uppercase tracking-widest">
            <Link href="/auth/signup" className="hover:text-emerald-500">Signup</Link>
            <Link href="/auth/login" className="hover:text-emerald-500">Sign In</Link>
            <span className="cursor-pointer hover:text-emerald-500">Policy</span>
            <span className="cursor-pointer hover:text-emerald-500">Contact</span>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
