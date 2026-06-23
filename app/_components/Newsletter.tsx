'use client'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Newsletter() {
  return (
    <section className="py-16 bg-[#0a0c14] relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-75 bg-neon-red/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-neon-blue/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-display font-black tracking-tighter italic uppercase mb-2">
            STAY IN <span className="text-white">THE LOOP</span>
          </h2>
          <p className="text-white/40 text-xs font-bold tracking-widest uppercase italic max-w-md">
            Get early access to new drops, exclusive deals & more.
          </p>
        </div>

        <div className="w-full max-w-md">
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-white/5 border-white/10 focus-visible:ring-neon-red/50 focus-visible:border-neon-red transition-all rounded-sm h-12 italic text-sm"
            />
            <button className="bg-neon-red hover:bg-neon-red/90 text-white font-black px-8 rounded-sm text-[10px] tracking-widest uppercase italic transition-all whitespace-nowrap shadow-[0_0_15px_rgba(255,0,60,0.3)] h-12">
              SUBSCRIBE
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
