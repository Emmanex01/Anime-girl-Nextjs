'use client';
import { useShopStore } from '@/app/store/useShopStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Package, Search, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useEffect, useState } from 'react'
import { SearchDropdown } from '../SearchDropdown';
import { getMenu } from '@/lib/shopify';
import { menu } from '@/lib/shopify/types';
import Link from 'next/link';

const MobileMenu = ({ navLinks }: { navLinks: menu[] }) => {
    const [mobileSearchVal, setMobileSearchVal] = useState('');
    const [showMobileDropdown, setShowMobileDropdown] = useState(false);
    const [isLinkActive, setIsLinkActive] = useState<string>('Home');


    const { 
        cartCount, 
        wishlistCount, 
        setCartOpen, 
        setWishlistOpen,
        isMobileMenuOpen,
        setMobileMenuOpen,
        currentRoute,
        setCurrentRoute,
        setSearchFilter,
        setCategoryFilter,
        searchFilter,
        currentCustomer
      } = useShopStore();

      const handleIsActiveLink = (title: string) => {
        setIsLinkActive(title);
      }

      const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, query: string) => {
          if (e.key === 'Enter') {
            const q = query.trim();
            setSearchFilter(q);
            setCategoryFilter('');
            setCurrentRoute('products');
            setShowMobileDropdown(false);
            setMobileMenuOpen(false);
          }
        };
  return (
    <div>
      <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-background lg:hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex flex-col">
                <span className="font-display font-black text-xl leading-none">OTAKU</span>
                <span className="font-display font-black text-xl text-neon-red leading-none">DISTRICT</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="flex flex-col gap-4 p-8 overflow-y-auto relative z-55">
               {/* Mobile Search Input */}
               <div className="relative mb-6">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                 <Input 
                   value={mobileSearchVal}
                   onChange={(e) => {
                     setMobileSearchVal(e.target.value);
                     setShowMobileDropdown(true);
                   }}
                   onFocus={() => setShowMobileDropdown(true)}
                   onBlur={() => setTimeout(() => setShowMobileDropdown(false), 200)}
                   onKeyDown={(e) => handleKeyDown(e, mobileSearchVal)}
                   placeholder="Search..." 
                   className="pl-10 bg-white/5 border-white/10"
                 />

                 {/* Floating Live Search Dropdown Mobile */}
                 <AnimatePresence>
                   {showMobileDropdown && mobileSearchVal.trim() && (
                     <SearchDropdown 
                       query={mobileSearchVal} 
                       onSelectResult={() => {
                         setShowMobileDropdown(false);
                         setMobileMenuOpen(false);
                       }}
                       onClearQuery={() => setMobileSearchVal('')}
                     />
                   )}
                 </AnimatePresence>
               </div>

               {/* Mobile Links */}
               {navLinks.map((link) => (
                 <Link
                   key={link.title} 
                   href={link.path}
                   onClick={() => handleIsActiveLink(link.title)}
                   className={`text-lg font-display font-black tracking-widest uppercase text-left py-2 cursor-pointer ${
                   isLinkActive === link.title ? 'text-neon-blue' : 'text-white/80'
                   }`}
                 >
                   {link.title.toUpperCase()}
                   {link.title === 'New Drops' && <span className="ml-2 text-xs text-neon-red italic border border-neon-red px-1 rounded-sm">HOT</span>}
                 </Link>
               ))}
               
               <div className="mt-10 pt-10 border-t border-white/5 space-y-6">
                  <div className="flex items-center gap-3 text-white/60">
                    <Package className="w-5 h-5 text-[#00f2ff] cursor-pointer" onClick={() => { setCurrentRoute('track-order'); setMobileMenuOpen(false); }} />
                    <span className="text-sm font-bold uppercase tracking-widest">Track Order</span>
                  </div>
                  <div onClick={() => { setWishlistOpen(true); setMobileMenuOpen(false); }} className="flex items-center gap-3 text-white/60 cursor-pointer">
                    <Heart className="w-5 h-5 text-neon-red" />
                    <span className="text-sm font-bold uppercase tracking-widest">Wishlist</span>
                    <span className="ml-1 text-neon-red font-bold text-xs">({wishlistCount})</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/60 cursor-pointer" onClick={() => { setCurrentRoute('account'); setMobileMenuOpen(false); }}>
                    <User className={`w-5 h-5 cursor-pointer ${currentCustomer ? 'text-neon-blue' : 'text-white/40'}`} />
                    <span className="text-sm font-bold uppercase tracking-widest">
                      {currentCustomer ? currentCustomer.name.split(' ')[0] : 'Account'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-white/60 cursor-pointer" onClick={() => { setCurrentRoute('admin'); setMobileMenuOpen(false); }}>
                    <User className="w-5 h-5 text-neon-red cursor-pointer" />
                    <span className="text-sm font-bold uppercase tracking-widest">Admin</span>
                  </div>
               </div>
            </div>
          </motion.div>
    </div>
  )
}

export default MobileMenu
