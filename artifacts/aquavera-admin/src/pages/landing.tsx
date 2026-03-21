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
  ChevronRight,
  Database,
  ShieldCheck,
  TrendingUp
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
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const yieldData = [
  { name: 'Rice', value: 420, color: '#22c55e' },
  { name: 'Corn', value: 300, color: '#4ade80' },
  { name: 'Soybean', value: 180, color: '#86efac' },
];

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <LandingLayout>
      {/* Hero Section */}
      <section id="home" className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-950">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-smart-farm.png" 
            alt="Smart Farm" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-12 py-20">
          <div className="lg:col-span-7 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-400 text-xs font-bold uppercase tracking-widest"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Smart Farming Solutions for Data-Driven Growth</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[0.95]"
            >
              Intelligence insights <br />
              <span className="text-emerald-400 italic">tailored for farmers.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed max-w-[600px]"
            >
              Automate, monitor, and analyze your farmland through AI-powered sensors and satellite insights — accessible anytime, anywhere.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link href="/auth/signup">
                <Button size="lg" className="h-16 px-10 text-lg font-bold rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl shadow-emerald-500/20 transition-all border-none">
                  Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>

          <div className="lg:col-span-5 relative">
            {/* Status Overlays */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="absolute -top-10 -left-10 z-20 p-6 rounded-[2.5rem] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl min-w-[240px]"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Crop Health</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-500/20">
                      <Droplets className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-sm font-bold text-white">Humidity</span>
                  </div>
                  <span className="text-sm font-black text-white">74%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-blue-500/20">
                      <Wind className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-sm font-bold text-white">Wind Speed</span>
                  </div>
                  <span className="text-sm font-black text-white">12 km/h</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-500/20">
                      <Sun className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="text-sm font-bold text-white">UV Index</span>
                  </div>
                  <span className="text-sm font-black text-white">06</span>
                </div>
              </div>
            </motion.div>

            {/* Chart Overlay */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-40 p-10 rounded-[2.5rem] bg-white backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Smart Yield Insights</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Per Crop Analysis</p>
                </div>
                <div className="text-right">
                <span className="text-sm font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">+12.5%</span>
                </div>
              </div>
              
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yieldData}>
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 'bold'}}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {yieldData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} dy={10} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-8 border-t pt-8 border-slate-50">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Yield</p>
                  <p className="text-xl font-black text-slate-900">12,600 Kg</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Efficiency</p>
                  <p className="text-xl font-black text-slate-900">92%</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="about" className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-emerald-500">
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid)" />
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
          </svg>
        </div>

        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20"
          >
            <div className="max-w-[700px] space-y-6 text-center md:text-left mx-auto md:mx-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Modern Agriculture Eco-system</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
                Powerful Features to <br />
                <span className="text-emerald-500">Transform the Way You Farm</span>
              </h2>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="relative rounded-[3rem] overflow-hidden shadow-2xl"
             >
               <img src="/images/soil-analysis.png" alt="Soil Analysis" className="w-full h-auto" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-12">
                 <div className="space-y-4">
                   <div className="flex gap-4">
                     <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                       <p className="text-[10px] font-bold text-white/60 tracking-widest mb-1 uppercase">Soil Moisture</p>
                       <p className="text-xl font-black text-white tracking-tight">77%</p>
                     </div>
                     <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                       <p className="text-[10px] font-bold text-white/60 tracking-widest mb-1 uppercase">Nitrogen</p>
                       <p className="text-xl font-black text-white tracking-tight">65%</p>
                     </div>
                   </div>
                 </div>
               </div>
             </motion.div>

             <div className="grid gap-10">
               {[
                 { 
                   title: "Resource Optimization", 
                   desc: "Strategic water allocation driven by satellite imagery and local sensor data.",
                   icon: Droplets,
                   color: "bg-emerald-500"
                 },
                 { 
                   title: "Real-time Sync", 
                   desc: "All-data automatically syncs directly ensuring every farm update is accessible anytime.",
                   icon: Database,
                   color: "bg-blue-500"
                 },
                 { 
                   title: "AI Analysis", 
                   desc: "Our AI analyzes historical trends, predicts growth patterns and recommends efficient watering.",
                   icon: CheckCircle,
                   color: "bg-amber-500"
                 }
               ].map((feature, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: 20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.1 }}
                   className="flex gap-8 group"
                 >
                   <div className={`w-16 h-16 rounded-3xl ${feature.color} flex items-center justify-center text-white shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                     <feature.icon className="w-8 h-8" />
                   </div>
                   <div className="space-y-2">
                     <h3 className="text-xl font-black text-slate-900 tracking-tight">{feature.title}</h3>
                     <p className="text-slate-500 font-medium leading-relaxed max-w-[400px]">{feature.desc}</p>
                   </div>
                 </motion.div>
               ))}
             </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section id="feedback" className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-[800px] mx-auto mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Trusted by Leading Farmers</h2>
            <p className="text-lg text-slate-500 font-medium">Validating our impact through direct feedback from our community.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
             {[1, 2, 3].map((i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1 }}
                 className="p-10 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group"
               >
                 <div className="flex gap-1 mb-8 text-emerald-500">
                   {[1, 2, 3, 4, 5].map(s => <Sun key={s} className="w-4 h-4 fill-current" />)}
                 </div>
                 <p className="text-slate-700 font-medium text-lg leading-relaxed mb-10 italic">"The real-time insights have completely changed how we manage our irrigation schedules. Yields are up by 15% this season."</p>
                 <div className="flex items-center gap-4 pt-8 border-t border-slate-50">
                   <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-emerald-500">
                     {i === 1 ? "W" : i === 2 ? "R" : "H"}
                   </div>
                   <div>
                     <p className="font-black text-slate-900 leading-none mb-1">Rajesh Kumar</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{i === 1 ? "Wheat Farmer, Pune" : i === 2 ? "Rice Cultivator, Vidarbha" : "Horticulturist, Nashik"}</p>
                   </div>
                 </div>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-white">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[0.95]">Ready to start your <br /> <span className="text-emerald-500">smart farming journey?</span></h2>
              <p className="text-xl text-slate-500 font-medium max-w-[500px]">Get in touch with our experts for or technical support and policy clarifications.</p>
            </div>
            
            <div className="space-y-8">
              {[
                { icon: Mail, label: "Digital Support", value: "helpdesk-av@nic.in" },
                { icon: Phone, label: "Helpline", value: "1800-445-6677" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 group">
                  <div className="w-16 h-16 rounded-[2rem] bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tight">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-12 rounded-[3.5rem] bg-slate-50 border border-slate-200 shadow-sm relative overflow-hidden"
          >
            <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Your Name</label>
                  <Input placeholder="Rajesh Kumar" className="h-16 rounded-2xl border-none shadow-sm bg-white font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                  <Input type="email" placeholder="rajesh@example.com" className="h-16 rounded-2xl border-none shadow-sm bg-white font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Your Inquiry</label>
                <Textarea placeholder="How can we help you today?" className="min-h-[160px] rounded-2xl border-none shadow-sm bg-white font-bold py-4" />
              </div>
              <Button className="w-full h-20 text-lg font-black uppercase tracking-widest rounded-[2rem] mt-4 bg-emerald-500 text-white hover:bg-emerald-600 shadow-2xl shadow-emerald-500/20">
                Send Message
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer Branding */}
      <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 text-center space-y-12 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-8xl font-black tracking-tighter"
          >
            AQUAVERA — 2026
          </motion.h2>
          <div className="flex justify-center gap-12">
            <Link href="/auth/signup">
              <Button variant="link" className="text-white font-bold hover:text-emerald-400 p-0 h-auto uppercase tracking-widest text-xs">Join Network</Button>
            </Link>
            <Button variant="link" className="text-white font-bold hover:text-emerald-400 p-0 h-auto uppercase tracking-widest text-xs">System Status</Button>
            <Button variant="link" className="text-white font-bold hover:text-emerald-400 p-0 h-auto uppercase tracking-widest text-xs">Privacy Policy</Button>
          </div>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      </section>
    </LandingLayout>
  );
}
