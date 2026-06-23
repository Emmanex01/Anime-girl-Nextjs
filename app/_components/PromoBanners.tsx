'use client'
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

const mainPromos = [
  {
    subtitle: 'NEW DROP',
    title: 'TOKYO ARRIVALS',
    desc: 'Fresh anime merch just landed!',
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1000&auto=format&fit=crop',
    cta: 'SHOP NOW',
    accent: 'neon-red'
  },
  {
    subtitle: 'MUST HAVE',
    title: 'STREETWEAR COLLECTION',
    desc: 'Elevate your anime street style.',
    image: '/images/streetwear_promo_banner_1779749535125.png',
    cta: 'SHOP STREETWEAR',
    accent: 'neon-blue'
  },
  {
    subtitle: 'LIMITED',
    title: 'MYSTERY BOX SURPRISE YOURSELF!',
    desc: 'Epic anime items inside every box.',
    image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=1000&auto=format&fit=crop',
    cta: 'GET YOURS',
    accent: 'neon-red'
  }
];

export function PromoBanners() {
  return (
    <section className="py-12 bg-background">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mainPromos.map((promo, i) => (
            <motion.div
              key={promo.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative group overflow-hidden rounded-xl aspect-[4/3] md:aspect-auto h-[350px] border border-white/5"
            >
              {/* Background Image */}
              <img 
                src={promo.image} 
                alt={promo.title} 
                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-[#0f111a]/40 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end items-start">
                <span className={`text-[10px] font-black tracking-[0.3em] uppercase mb-1 ${promo.accent === 'neon-red' ? 'text-neon-red' : 'text-neon-blue'}`}>
                  {promo.subtitle}
                </span>
                <h3 className="text-2xl md:text-3xl font-display font-black tracking-tighter italic mb-4 leading-none uppercase max-w-[250px]">
                  {promo.title}
                </h3>
                {promo.desc && (
                  <p className="text-white/60 text-xs mb-6 max-w-[200px] font-medium leading-relaxed uppercase tracking-widest">
                    {promo.desc}
                  </p>
                )}
                <Button 
                  variant="outline" 
                  className="border-white/20 hover:border-neon-red hover:bg-white/5 rounded-sm h-10 px-6 text-[10px] font-black tracking-widest uppercase italic group/btn"
                >
                  {promo.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
