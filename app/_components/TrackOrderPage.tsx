import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Calendar, Clock, Truck, ShieldCheck, CheckCircle2, ChevronRight, CornerDownLeft, ArrowLeft } from 'lucide-react';
import { useShopStore } from '../store/useShopStore';

export function TrackOrderPage() {
  const { orders, setCurrentRoute } = useShopStore();
  const [searchId, setSearchId] = useState('');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto load if ID exists in URL query or hash
  useEffect(() => {
    const handleUrlQuery = () => {
      const hash = window.location.hash;
      const match = hash.match(/[?&]id=([^&]+)/);
      if (match && match[1]) {
        const orderId = match[1];
        setSearchId(orderId);
        const found = orders.find(o => o.id.toLowerCase() === orderId.toLowerCase());
        if (found) {
          setQueryResult(found);
          setErrorMsg('');
        } else {
          setErrorMsg('ORDER NOT FOUND IN DATABASE SECTOR.');
        }
      }
    };

    handleUrlQuery();
    window.addEventListener('hashchange', handleUrlQuery);
    return () => window.removeEventListener('hashchange', handleUrlQuery);
  }, [orders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    const found = orders.find(o => o.id.trim().toUpperCase() === searchId.trim().toUpperCase());
    if (found) {
      setQueryResult(found);
      setErrorMsg('');
    } else {
      setQueryResult(null);
      setErrorMsg('ORDER NOT FOUND. CHECK FORMAT (E.G. OD-9201)');
    }
  };

  const checkpointStatuses = [
    'Order Received',
    'Awaiting Purchase',
    'Purchased in Japan',
    'Arrived at Japan Facility',
    'Packed for Shipment',
    'Shipped',
    'Delivered'
  ];

  const getStatusIndex = (status: string) => {
    return checkpointStatuses.indexOf(status);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#070913] text-white selection:bg-neon-red/30 relative">
      <div className="max-w-4xl mx-auto px-4 relative z-10">

        {/* Back Button */}
        <div className="mb-8">
          <button 
            onClick={() => setCurrentRoute('home')}
            className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-white/50 hover:text-neon-blue transition-colors uppercase italic cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-neon-blue" />
            <span>RETURN TO HOME</span>
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <span className="text-[10px] font-black tracking-[0.4em] text-neon-blue uppercase block mb-3">GLOBAL CARGO DISPATCH MONITOR</span>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight uppercase italic leading-none">
            ORDER <span className="text-neon-red">TRACKING</span> PORTAL
          </h1>
          <p className="text-white/45 text-xs mt-3 leading-relaxed max-w-lg mx-auto">
            Input the order code dispatched to your neural mail inbox to query Tokyo facility logistics and real-time shipment logs.
          </p>
        </div>

        {/* Query Input Box */}
        <div className="bg-[#0a0d1a] border border-white/10 p-6 rounded-sm shadow-xl max-w-xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35" />
              <input 
                type="text"
                placeholder="ENTER ORDER ID (E.G. OD-9201)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full h-11 pl-12 pr-4 bg-white/5 border border-white/10 rounded-sm text-xs font-mono tracking-widest text-[#00f2ff] placeholder-white/20 focus:border-neon-blue outline-none transition-all uppercase"
              />
            </div>
            <button 
              type="submit"
              className="px-6 h-11 bg-neon-blue font-black text-black text-[10px] tracking-widest uppercase hover:bg-neon-blue/90 transition-all rounded-sm cursor-pointer"
            >
              QUERY STATUS
            </button>
          </form>

          {errorMsg && (
            <p className="text-[10px] font-mono font-black text-neon-red tracking-widest uppercase mt-3 text-center">
              ❌ {errorMsg}
            </p>
          )}

          {!queryResult && !errorMsg && (
            <p className="text-[9px] font-mono text-white/30 tracking-wider text-center mt-3 uppercase">
              HINT: TRY USING SAMPLE ID <strong className="text-white/60">OD-9201</strong> OR CHOOSE FROM THE ADMIN MODULE
            </p>
          )}
        </div>

        {/* Tracking Details Render */}
        {queryResult && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            
            {/* Order Overview Header Block */}
            <div className="p-6 bg-[#00f2ff]/5 border border-[#00f2ff]/10 rounded-sm grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <span className="text-[9px] font-mono text-[#00f2ff] tracking-widest block uppercase font-black mb-1">CURRENT STATUS</span>
                <span className="text-sm font-display font-black text-white uppercase italic tracking-wide">
                  {queryResult.status}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-mono text-white/40 tracking-widest block uppercase font-bold mb-1">ESTIMATED TRACE METHOD</span>
                <span className="text-xs text-white/95 font-bold uppercase truncate block">
                  {queryResult.shippingMethod}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-mono text-white/40 tracking-widest block uppercase font-bold mb-1">SECURAL CARGO ID</span>
                <span className="text-xs text-neon-red font-mono font-black tracking-wider truncate block">
                  {queryResult.trackingNumber || 'GENERATING PROTOCOL...'}
                </span>
              </div>
            </div>

            {/* Main Timeline Section */}
            <div className="p-8 bg-[#0a0d1a] border border-white/5 rounded-sm">
              <span className="text-[9px] font-black tracking-widest text-white/30 block mb-8 uppercase">TRANSIT SEGMENT GRAPH • タイムライン</span>
              
              <div className="relative">
                {/* Timeline Axis Line (Desktop) */}
                <div className="absolute top-[18px] left-6 right-6 h-[2px] bg-white/5 z-0 hidden md:block" />
                
                <div className="grid grid-cols-1 md:grid-cols-7 gap-6 relative z-10">
                  {checkpointStatuses.map((step, idx) => {
                    const isPassed = getStatusIndex(queryResult.status) >= idx;
                    const isCurrent = queryResult.status === step;
                    
                    return (
                      <div key={step} className="flex md:flex-col items-center gap-4 md:gap-0 text-left md:text-center group">
                        {/* Dot indicator */}
                        <div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 md:mb-3 flex-shrink-0 ${
                            isCurrent 
                              ? 'bg-neon-red border-neon-red text-white shadow-[0_0_15px_rgba(255,0,60,0.6)] scale-110'
                              : isPassed
                              ? 'bg-[#00f2ff]/10 border-neon-blue text-neon-blue'
                              : 'bg-slate-900 border-white/5 text-white/20'
                          }`}
                        >
                          <span className="text-[10px] font-mono font-black">{idx + 1}</span>
                        </div>

                        {/* Text labels */}
                        <div>
                          <p className={`text-[10px] font-black tracking-normal uppercase ${isCurrent ? 'text-neon-red' : isPassed ? 'text-[#00f2ff]' : 'text-white/30'}`}>
                            {step}
                          </p>
                          {isCurrent && (
                            <span className="text-[8px] leading-none bg-neon-red/15 text-neon-red font-black px-1.5 py-0.5 rounded-sm block md:inline-block w-max mx-auto mt-1 tracking-widest uppercase">ACTIVE</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Historical Status Logs Timeline (Chronological timeline of notes) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Left Log Stream */}
              <div className="md:col-span-8 p-6 bg-[#0a0d1a] border border-white/5 rounded-sm space-y-6">
                <span className="text-[9px] font-black tracking-widest text-[#00f2ff] block border-b border-white/5 pb-3 uppercase">LOG ENTRY CHRONICLES • 履歴履歴</span>
                
                <div className="space-y-6 relative border-l border-white/15 pl-4 ml-2">
                  {queryResult.statusHistory && [...queryResult.statusHistory].reverse().map((hist, index) => (
                    <div key={hist.id || index} className="relative group">
                      {/* Interactive indicator pin */}
                      <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-neon-blue border border-black group-hover:bg-neon-red transition-colors" />
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-[#00f2ff] font-bold">{hist.timestamp}</span>
                          <span className="text-white/30 text-[9px] font-mono">|</span>
                          <span className="bg-white/5 border border-white/10 text-[8px] px-1.5 py-0.5 rounded-sm text-white/60 uppercase tracking-wider font-extrabold leading-none">
                            UPDATED BY: {hist.updatedBy}
                          </span>
                        </div>
                        
                        <p className="text-[11px] font-bold text-white uppercase tracking-wide">
                          Status Transitioned To: <span className="text-neon-red italic font-semibold">{hist.status}</span>
                        </p>
                        
                        {hist.note && (
                          <p className="text-[10px] text-white/50 italic font-medium leading-relaxed bg-black/20 p-2.5 rounded-sm border border-white/5 mt-1">
                            "{hist.note}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Order Details Summary */}
              <div className="md:col-span-4 p-6 bg-[#0a0d1a] border border-white/5 rounded-sm flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-black tracking-widest text-white/30 block border-b border-white/5 pb-3 uppercase">MANIFEST SUMMARY</span>
                  
                  <div className="mt-4 space-y-3">
                    {queryResult.products.map((p: any) => (
                      <div key={p.id} className="flex gap-3 items-center">
                        <div className="w-10 h-10 bg-slate-900 border border-white/5 rounded-sm overflow-hidden flex-shrink-0">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold text-white truncate leading-tight">{p.name}</p>
                          <p className="text-[9px] text-white/40 mt-1">QTY: {p.quantity} {p.size ? `| SIZE: ${p.size}` : ''}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 mt-6">
                  <div className="flex justify-between text-[10px] font-black text-white/40 uppercase tracking-widest">
                    <span>NET CHARGE PAID</span>
                    <span className="text-white italic text-xs font-display font-black">N{queryResult.amountPaid.toLocaleString()}</span>
                  </div>
                </div>
              </div>

            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
}
