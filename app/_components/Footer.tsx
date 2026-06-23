import { Music } from 'lucide-react';
import Image from 'next/image';


const footerLinks = {
  SHOP: ['New Drops', 'Best Sellers', 'Shop by Anime', 'Streetwear', 'Figures', 'Accessories', 'Mystery Boxes', 'Sale'],
  'CUSTOMER CARE': ['Track Order', 'Shipping & Delivery', 'Returns & Refunds', 'FAQ', 'Contact Us', 'Size Guide'],
  COMPANY: ['About Us', 'Our Story', 'Blog', 'Careers', 'Privacy Policy', 'Terms of Service'],
  HELP: ['Payment Methods', 'Order Help', 'Account Help', 'Wishlist', 'Gift Cards']
};

export function Footer() {
  return (
    <footer className="bg-[#050608] pt-16 pb-8 border-t border-white/5">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-8 mb-16">
          {/* Brand Info */}
          <div className="col-span-2 lg:col-span-3 space-y-6">
            <div className="flex flex-col">
              <span className="font-display font-black text-2xl tracking-tighter leading-none">OTAKU</span>
              <span className="font-display font-black text-2xl tracking-tighter text-neon-red leading-none">DISTRICT</span>
              <span className="text-[8px] font-bold tracking-[0.3em] text-white/40 uppercase mt-1">オタク地区</span>
            </div>
            <p className="text-white/40 text-xs leading-relaxed max-w-xs font-bold uppercase tracking-widest">
              Bringing anime culture closer to you. Premium merch, apparel, figures & more from Japan to your world.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white/40 hover:text-white transition-colors">

                <Image src="/instagram.svg" alt="Instagram" width={16} height={16} />
              </a>
              <a href="#" className="text-white/40 hover:text-white transition-colors">
                <Image src="/twitter.svg" alt="Twitter" width={16} height={16} />
              </a>
              <a href="#" className="text-white/40 hover:text-white transition-colors">
                <Image src="/youtube.svg" alt="YouTube" width={16} height={16} />
              </a>
              <a href="#" className="text-white/40 hover:text-white transition-colors">
                <Image src="/facebook.svg" alt="Facebook" width={16} height={16} />
              </a>
              <a href="#" className="text-white/40 hover:text-white transition-colors font-black text-xs"><Music className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className={`col-span-1 lg:col-span-2 ${title === 'HELP' ? 'lg:col-span-3' : ''} space-y-4`}>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[11px] font-bold text-white/60 hover:text-white transition-colors uppercase tracking-tight">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Accept Payments */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">WE ACCEPT</h4>
            <div className="grid grid-cols-3 gap-2">
               <div className="bg-white/5 h-8 rounded-sm flex items-center justify-center font-bold text-[8px] italic text-white/60">VISA</div>
               <div className="bg-white/5 h-8 rounded-sm flex items-center justify-center font-bold text-[8px] italic text-white/60">MC</div>
               <div className="bg-white/5 h-8 rounded-sm flex items-center justify-center font-bold text-[8px] italic text-white/60">PayPal</div>
               <div className="bg-white/5 h-8 rounded-sm flex items-center justify-center font-bold text-[8px] italic text-white/60">ApplePay</div>
               <div className="bg-white/5 h-8 rounded-sm flex items-center justify-center font-bold text-[8px] italic text-white/60">G Pay</div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">
            © 2024 Otaku District. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
             <span className="text-2xl font-black italic tracking-tighter text-white/5 uppercase">オタク地区</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
