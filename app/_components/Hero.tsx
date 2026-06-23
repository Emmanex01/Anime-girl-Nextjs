'use client'
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-32 pb-16 min-h-[600px] flex items-center overflow-hidden">
      {/* Background with slight grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-8 items-stretch relative z-10">
        {/* Left Main Hero */}
        <div className="flex-1 relative rounded-2xl overflow-hidden min-h-[400px] md:min-h-[500px]">
          <div className="absolute inset-0 group">
            <img
              src="/images/hero_cyberpunk_tokyo_1779749518279.png"
              alt="Otaku District Hero"
              className="w-full h-full object-cover transition-transform duration-[10000ms] group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          </div>

          <div className="relative h-full flex flex-col justify-center p-8 md:p-16">
             <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-8xl font-display font-black leading-[0.9] tracking-tighter mb-4 italic uppercase"
            >
              FROM <span className="text-neon-red">TOKYO</span> <br /> 
              TO YOUR <span className="text-white">WORLD.</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base md:text-lg text-white/70 mb-8 max-w-lg leading-relaxed font-medium"
            >
              Premium anime merch, figures, apparel & more <br className="hidden md:block" />
              — straight from <span className="text-neon-red font-bold">Japan</span> to you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <button className="h-12 px-10 bg-neon-red hover:bg-neon-red/90 text-white font-black rounded-sm tracking-widest text-[11px] uppercase transition-all shadow-[0_0_20px_rgba(255,0,60,0.4)]">
                SHOP NOW
              </button>
              <button className="h-12 px-10 bg-white/10 hover:bg-white/20 text-white font-black rounded-sm border border-white/10 tracking-widest text-[11px] uppercase transition-all">
                NEW DROPS
              </button>
            </motion.div>
          </div>

          {/* Carousel Buttons */}
          <div className="absolute bottom-8 left-8 flex gap-2">
             <button className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-neon-red hover:border-neon-red transition-all group">
                <ChevronLeft className="w-5 h-5" />
             </button>
             <button className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-neon-red hover:border-neon-red transition-all group">
                <ChevronRight className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Right Side Feature Card */}
        <div className="w-full lg:w-[400px] flex flex-col gap-4">
           <div className="flex-1 glass-heavy rounded-2xl p-8 relative overflow-hidden group">
              {/* Background Anime character or art */}
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800" 
                  alt="New Drop"
                  className="w-full h-full object-cover opacity-40 grayscale-[50%] group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              </div>

              <div className="relative z-10 h-full flex flex-col justify-end">
                 <span className="text-neon-blue font-bold text-[10px] tracking-[0.3em] uppercase mb-1">NEW DROP</span>
                 <h2 className="text-3xl font-display font-black tracking-tighter uppercase mb-4 leading-none">
                   TOKYO <br /> ARRIVALS
                 </h2>
                 <p className="text-white/60 text-xs mb-6 max-w-[200px] uppercase font-bold tracking-widest leading-relaxed">
                   Fresh anime merch just landed!
                 </p>
                 
                 <Button variant="outline" className="w-max px-6 h-10 border-white/20 hover:border-neon-red hover:bg-white/5 rounded-sm text-[10px] font-black tracking-widest italic uppercase">
                   EXPLORE NOW
                 </Button>

                 <div className="flex gap-2 mt-8">
                    <div className="w-8 h-1 bg-white/10 rounded-full" />
                    <div className="w-8 h-1 bg-white/10 rounded-full" />
                    <div className="w-8 h-1 bg-neon-red rounded-full shadow-[0_0_10px_rgba(255,0,60,0.5)]" />
                    <div className="w-8 h-1 bg-white/10 rounded-full" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}
