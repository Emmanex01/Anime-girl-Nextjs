'use client'
import { ShieldCheck, CreditCard, Globe, Package, Users, Star, Truck, Shield } from 'lucide-react';
import { motion } from 'motion/react';

const mainFeatures = [
  { icon: ShieldCheck, title: 'AUTHENTIC GUARANTEE', desc: '100% official anime merchandise' },
  { icon: CreditCard, title: 'SECURE PAYMENT', desc: 'Pay safely with your preferred method' },
  { icon: Globe, title: 'WORLDWIDE SHIPPING', desc: 'We deliver to 40+ countries' },
  { icon: Package, title: 'TRACK YOUR ORDER', desc: 'Real-time tracking on every order' },
  { icon: Users, title: 'THOUSANDS OF FANS', desc: 'Join thousands of happy otaku' },
];

const sideFeatures = [
  { icon: Star, title: 'Official Anime Merch', desc: 'Only authentic & licensed products' },
  { icon: ShieldCheck, title: 'Japan Quality', desc: 'Carefully sourced from trusted suppliers' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Quick & reliable shipping to your door' },
  { icon: Shield, title: 'Safe & Secure', desc: 'Your payments & data are always protected' },
  { icon: Heart, title: 'Made for Otakus', desc: 'Built by anime fans, for anime fans ❤️' },
];

import { Heart } from 'lucide-react';

export function WhyShopWithUs() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-16">
        {/* Left Side: Why Shop With Us? */}
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-display font-black tracking-tighter uppercase italic mb-8">
            WHY <span className="text-white">SHOP WITH US?</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
             {mainFeatures.map((f, i) => (
               <div key={f.title} className="flex flex-col items-start gap-4">
                  <div className="text-white opacity-60">
                    <f.icon className="w-6 h-6 border rounded-full p-1" />
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black tracking-widest text-white uppercase leading-tight mb-1">
                      {f.title}
                    </h4>
                    <p className="text-[8px] font-bold text-white/30 uppercase tracking-[0.1em] leading-tight">
                      {f.desc}
                    </p>
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Right Side: Why You'll Love Us */}
        <div className="w-full lg:w-[350px]">
           <h2 className="text-xl md:text-2xl font-display font-black tracking-tighter uppercase italic mb-8">
            WHY <span className="text-white">YOU'LL LOVE US</span>
          </h2>
          <div className="space-y-6">
             {sideFeatures.map((f, i) => (
               <div key={f.title} className="flex items-start gap-4">
                  <div className="mt-1 text-white opacity-80">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black tracking-widest text-white uppercase leading-tight mb-1">
                      {f.title}
                    </h4>
                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.1em] leading-tight">
                      {f.desc}
                    </p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
}
