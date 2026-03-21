import React, { useState } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  QrCode, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Lock,
  ChevronRight,
  Info
} from 'lucide-react';
import { useLocation, Link } from "wouter";
import { useRole } from "@/context/role-context";

export default function PaymentPage() {
  const { user } = useRole();
  const [location, setLocation] = useLocation();
  if (!user) return null;
  const [step, setStep] = useState('selection'); // selection, processing, success
  const [method, setMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    upiId: ''
  });

  // Get amount from search params or fallback
  const params = new URLSearchParams(window.location.search);
  const amountStr = params.get('amount') || '0';
  const amountValue = parseFloat(amountStr);

  const orderDetails = {
    amount: amountValue,
    orderId: "REQ-" + Math.floor(Math.random() * 1000000),
    merchant: "AquaVera Irrigation Services",
    items: [
      { id: 1, name: "Irrigation Dues (Current)", price: amountValue }
    ]
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const simulatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (method === 'qr' && !qrValue) {
      setQrValue(`upi://pay?pa=aquavera@ybl&pn=${encodeURIComponent(orderDetails.merchant)}&am=${orderDetails.amount}&cu=INR&tr=${orderDetails.orderId}`);
      setLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams(window.location.search);
      const requestId = params.get('requestId');
      
      if (requestId === 'all') {
        const res = await fetch(`/api/requests/pay-all`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ farmerName: user.name })
        });
        if (!res.ok) throw new Error('Failed to update bulk payment');
      } else if (requestId) {
        const res = await fetch(`/api/requests/${requestId}/pay`, {
          method: 'PATCH',
        });
        if (!res.ok) throw new Error('Failed to update payment');
      }

      setTimeout(() => {
        setLoading(false);
        setStep('success');
      }, 1500);
    } catch (error) {
      setLoading(false);
      alert("Payment failed to sync with server.");
    }
  };

  const resetGateway = () => {
    setLocation("/dashboard/farmer");
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 max-w-md w-full text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Payment Successful!</h2>
          <p className="text-slate-500 font-medium mb-8 text-sm">Your transaction was completed successfully. A digital receipt has been generated.</p>
          
          <div className="bg-slate-50 rounded-2xl p-5 mb-8 text-left space-y-3 border border-slate-100">
            <div className="flex justify-between text-[11px] uppercase tracking-wider font-black text-slate-400">
              <span>Transaction ID</span>
              <span className="font-mono">{Math.random().toString(36).substr(2, 10).toUpperCase()}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200/50">
              <span className="text-sm font-bold text-slate-500">Amount Paid</span>
              <span className="text-lg font-black text-slate-900">₹{orderDetails.amount.toLocaleString('en-IN')}</span>
            </div>
          </div>
          
          <button 
            onClick={resetGateway}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-xl shadow-slate-900/20 hover:bg-emerald-600 transition-all active:scale-95"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center lg:p-10 font-sans">
      <div className="bg-white shadow-2xl rounded-[2.5rem] max-w-5xl w-full flex flex-col lg:flex-row overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Left Section: Branding & Order Details */}
        <div className="bg-slate-900 w-full lg:w-2/5 p-8 lg:p-12 text-white relative flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-16">
              <Link href="/bills">
                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors mr-2">
                  <ArrowLeft size={20} />
                </button>
              </Link>
              <div className="bg-emerald-500 p-2 rounded-xl">
                <ShieldCheck className="text-white" size={24} />
              </div>
              <span className="font-black text-xl tracking-tight">AquaVera Pay</span>
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black mb-2">Total Amount Due</p>
                <h1 className="text-5xl font-black tracking-tighter">₹{orderDetails.amount.toLocaleString('en-IN')}</h1>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                <p className="text-emerald-400 text-[10px] uppercase font-black tracking-widest mb-4 pb-2 border-b border-white/10">Order Summary</p>
                <div className="space-y-4">
                  {orderDetails.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span className="text-slate-300 font-medium">{item.name}</span>
                      <span className="font-black">₹{item.price.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  <div className="pt-2 flex justify-between text-[10px] text-slate-500 font-black tracking-widest uppercase">
                    <span>Reference</span>
                    <span className="font-mono">{orderDetails.orderId}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-12 flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-widest bg-white/5 p-4 rounded-2xl border border-white/5">
            <Lock size={14} className="text-emerald-500" />
            <p>Secure 256-Bit SSL Encryption</p>
          </div>
          
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/5 rounded-full blur-3xl"></div>
        </div>

        {/* Right Section: Payment Methods */}
        <div className="w-full lg:w-3/5 p-8 lg:p-12 bg-white">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Select Method</h2>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-100"></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { id: 'card', label: 'Card', icon: <CreditCard size={20} /> },
              { id: 'upi', label: 'UPI ID', icon: <Smartphone size={20} /> },
              { id: 'qr', label: 'Scan QR', icon: <QrCode size={20} /> }
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => { setMethod(item.id); setQrValue(null); }}
                className={`flex flex-col items-center justify-center p-5 rounded-3xl border-2 transition-all duration-300 ${
                  method === item.id 
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-600 shadow-xl shadow-emerald-500/10' 
                  : 'border-slate-50 bg-slate-50/50 text-slate-400 hover:border-slate-100 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                <span className="text-[10px] font-black uppercase tracking-widest mt-3">{item.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={simulatePayment} className="space-y-8">
            <div className="min-h-[220px]">
              {method === 'card' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Card Number</label>
                    <div className="relative">
                      <input 
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        type="text" 
                        placeholder="0000 0000 0000 0000" 
                        className="w-full h-14 pl-12 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all outline-none text-slate-800 font-bold"
                        required 
                      />
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1/2 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Expiry Date</label>
                      <input 
                        name="expiry"
                        value={formData.expiry}
                        onChange={handleInputChange}
                        type="text" 
                        placeholder="MM / YY" 
                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all outline-none text-slate-800 font-bold"
                        required 
                      />
                    </div>
                    <div className="w-1/2 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">CVV</label>
                      <div className="relative">
                        <input 
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          type="password" 
                          maxLength={3}
                          placeholder="***" 
                          className="w-full h-14 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all outline-none text-slate-800 font-bold"
                          required 
                        />
                        <Info className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 cursor-help" size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {method === 'upi' && (
                <div className="animate-in slide-in-from-bottom-2 duration-300 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">UPI ID</label>
                  <div className="relative">
                    <input 
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleInputChange}
                      type="text" 
                      placeholder="mobile-number@bank" 
                      className="w-full h-14 pl-12 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all outline-none text-slate-800 font-bold"
                      required 
                    />
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  </div>
                  <p className="mt-3 text-[11px] text-slate-400 font-medium flex gap-2 items-center bg-slate-50 p-3 rounded-xl">
                    <Info size={14} className="text-emerald-500" />
                    Secure payment request will be sent to your UPI app.
                  </p>
                </div>
              )}

              {method === 'qr' && (
                <div className="flex flex-col items-center justify-center p-8 bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-[2rem] animate-in zoom-in duration-300">
                  {qrValue ? (
                    <div className="text-center space-y-6">
                      <div className="bg-white p-4 rounded-3xl shadow-2xl border border-slate-100 inline-block">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrValue)}`} 
                          alt="Payment QR" 
                          className="w-32 h-32"
                        />
                      </div>
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest shadow-sm">PhonePe</span>
                          <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest shadow-sm">GPay</span>
                          <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest shadow-sm">Bhim</span>
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Scan to Pay <span className="text-slate-900">₹{orderDetails.amount.toLocaleString('en-IN')}</span></p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto text-slate-400 shadow-sm">
                        <QrCode size={32} />
                      </div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-relaxed max-w-[200px]">Generate a unique dynamic QR for this transaction</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-8 border-t border-slate-100">
              <button 
                type="submit"
                disabled={loading}
                className={`w-full group relative overflow-hidden bg-slate-900 text-white font-black py-5 rounded-2xl transition-all shadow-2xl shadow-slate-900/20 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="text-lg uppercase tracking-tight">
                        {method === 'qr' && !qrValue ? 'Generate Payment QR' : `Confirm Payment`}
                      </span>
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
              
              <p className="text-center mt-8 text-[9px] text-slate-400 uppercase tracking-[0.3em] font-black">
                Locked & Secured by PCI-DSS 3.2
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
