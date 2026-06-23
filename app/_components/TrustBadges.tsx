'use client'
import { ShieldCheck, Plane, Truck, RotateCcw, Headset } from 'lucide-react';
import { motion } from 'motion/react';

const badges = [
  { icon: ShieldCheck, title: '100% AUTHENTIC', desc: 'Official & licensed products' },
  { icon: Plane, title: 'JAPAN TO YOU', desc: 'Direct from Japan to your doorstep' },
  { icon: Truck, title: 'FAST & SAFE SHIPPING', desc: 'Secure packaging worldwide' },
  { icon: RotateCcw, title: 'EASY RETURNS', desc: 'Hassle-free return within 7 days' },
  { icon: Headset, title: '24/7 SUPPORT', desc: "We're here to help you anytime" },
];

export function TrustBadges() {
  return (
    <section className="py-12 bg-background/50 border-y border-white/5">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="mt-1 text-white opacity-80">
                <badge.icon className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black tracking-widest text-white uppercase leading-tight mb-1 font-display">
                  {badge.title}
                </span>
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.1em] leading-tight max-w-[120px]">
                  {badge.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
