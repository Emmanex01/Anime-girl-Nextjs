'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingCart, User, Heart, Menu, X, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useShopStore } from '../../store/useShopStore';
import { SearchDropdown } from '../SearchDropdown';
import Link from 'next/link';
import MobileMenu from './MobileMenu';
import { menu } from '@/lib/shopify/types';
import SearchComponent from './Search';
import { useCart } from '../cart/cart-context';

const navLinks = [
  { name: 'HOME' },
  { name: 'NEW DROPS', hot: true },
  { name: 'STREETWEAR' },
  { name: 'FIGURES' },
  { name: 'ACCESSORIES' },
  { name: 'MYSTERY BOXES' },
  { name: 'SALE', highlighted: true },
];

export function Navbar({ navLinks }: { navLinks: menu[] }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLinkActive, setIsLinkActive] = useState<string>('Home');

  const {  
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

  const { cart } = useCart();
  const cartCount = cart ? cart.lines.length : 0;

  if (!cart) {
    console.log('Cart is undefined');
  } else {
    console.log('Cart:', cart);
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, query: string) => {
    if (e.key === 'Enter') {
      const q = query.trim();
      setSearchFilter(q);
      setCategoryFilter('');
      setCurrentRoute('products');
      setShowDropdown(false);
      setMobileMenuOpen(false);
    }
  };

  const handleNavLinkClick = (name: string) => {
    if (name === 'HOME') {
      setCurrentRoute('home');
      setCategoryFilter('');
      setSearchFilter('');
    } else if (name === 'FIGURES') {
      setCategoryFilter('');
      setSearchFilter('figure');
      setCurrentRoute('products');
    } else if (name === 'STREETWEAR') {
      setCategoryFilter('');
      setSearchFilter('streetwear');
      setCurrentRoute('products');
    } else if (name === 'ACCESSORIES') {
      setCategoryFilter('');
      setSearchFilter('accessories');
      setCurrentRoute('products');
    } else if (name === 'MYSTERY BOXES') {
      setCategoryFilter('');
      setSearchFilter('replica');
      setCurrentRoute('products');
    } else if (name === 'NEW DROPS') {
      setCategoryFilter('');
      setSearchFilter('NEW');
      setCurrentRoute('products');
    } else if (name === 'SALE') {
      setCategoryFilter('');
      setSearchFilter('SALE');
      setCurrentRoute('products');
    }
    setMobileMenuOpen(false);
  };

  // const isLinkActive = (name: string) => {
  //   if (name === 'HOME') return currentRoute === 'home';
  //   if (name === 'NEW DROPS') return currentRoute === 'products' && searchFilter === 'NEW';
  //   if (name === 'STREETWEAR') return currentRoute === 'products' && searchFilter === 'streetwear';
  //   if (name === 'FIGURES') return currentRoute === 'products' && searchFilter === 'figure';
  //   if (name === 'ACCESSORIES') return currentRoute === 'products' && searchFilter === 'accessories';
  //   if (name === 'MYSTERY BOXES') return currentRoute === 'products' && searchFilter === 'replica';
  //   if (name === 'SALE') return currentRoute === 'products' && searchFilter === 'SALE';
  //   return false;
  // };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md border-b border-white/10 py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          {/* Logo */}
          <Link href="/">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => handleNavLinkClick('HOME')}
            className="flex flex-col items-start cursor-pointer group"
          >
            
              <div className="flex items-center">
                <span className="font-display font-black text-2xl md:text-3xl tracking-tighter leading-none group-hover:text-neon-blue transition-colors">
                  OTAKU
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-display font-black text-2xl md:text-3xl tracking-tighter text-neon-red leading-none group-hover:text-neon-red/80 transition-colors">
                  DISTRICT
                </span>
              </div>
              <span className="text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase mt-1 leading-none">オタク地区</span>
            
          </motion.div>
          </Link>
          {/* Search bar Desktop */}
          <SearchComponent/>

          {/* User actions */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setCurrentRoute('track-order')}
              className="hidden md:flex items-center gap-2 cursor-pointer group text-white/60 hover:text-neon-blue transition-colors bg-transparent border-none outline-none font-bold"
            >
              <Package className="w-4 h-4 text-[#00f2ff]" />
              <span className="text-[10px] font-bold tracking-widest uppercase">Track Order</span>
            </button>
            <button 
              onClick={() => setWishlistOpen(true)}
              className="hidden md:flex items-center gap-2 cursor-pointer group text-white/60 hover:text-white transition-colors relative bg-transparent border-none outline-none"
            >
              <Heart className="w-4 h-4" />
              <span className="text-[10px] font-bold tracking-widest uppercase">Wishlist</span>
              <span className="ml-1 text-neon-red font-bold text-[10px]">{wishlistCount}</span>
            </button>
            <button 
              onClick={() => setCurrentRoute('account')}
              className={`hidden md:flex items-center gap-2 cursor-pointer group hover:text-neon-blue transition-colors bg-transparent border-none outline-none font-bold ${
                currentRoute === 'account' ? 'text-neon-blue' : 'text-white/60'
              }`}
            >
              <User className={`w-4 h-4 ${currentCustomer ? 'text-neon-blue animate-pulse' : 'text-white/40'}`} />
              <span className="text-[10px] font-bold tracking-widest uppercase">
                {currentCustomer ? currentCustomer.name.split(' ')[0] : 'My Account'}
              </span>
            </button>
            <button 
              onClick={() => setCurrentRoute('admin')}
              className={`hidden md:flex items-center gap-2 cursor-pointer group hover:text-neon-red transition-colors bg-transparent border-none outline-none font-bold ${
                currentRoute === 'admin' ? 'text-neon-red' : 'text-white/60'
              }`}
            >
              <User className="w-4 h-4 text-neon-red/60 group-hover:text-neon-red" />
              <span className="text-[10px] font-bold tracking-widest uppercase">Admin Portal</span>
            </button>
            <button 
              onClick={() => {
                console.log('cart button clicked');
                setCartOpen(true);
              }}
              className="flex items-center gap-2 cursor-pointer group text-white/60 hover:text-white transition-colors relative"
            >
              <div className="relative flex items-center">
                <ShoppingCart className="w-5 h-5 text-neon-red" />
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-neon-red text-white text-[10px] flex items-center justify-center rounded-full font-bold">{cartCount}</span>
              </div>
              <span className="hidden sm:block text-[10px] font-bold tracking-widest uppercase text-white">Cart</span>
            </button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-white"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Navigation Links - Desktop */}
        <div className="hidden lg:flex items-center justify-start gap-10 py-1 border-t border-white/5">
          {navLinks.map((link) => (
            <Link
              key={link.title}
              href={link.path}
              onClick={() => setIsLinkActive(link.title)}
              className={`text-[11px] font-bold tracking-widest transition-all relative flex items-center gap-1 group py-2 cursor-pointer uppercase ${
                isLinkActive === link.title ? 'text-neon-blue' : 'text-white/70 hover:text-white'
              }`}
            >
              {link.title.toUpperCase()}
              {link.title === 'New Drops' && (
                <span className="bg-neon-red text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm italic leading-none ml-1 uppercase scale-90">
                  HOT
                </span>
              )}
              <span className={`absolute -bottom-[1px] left-0 h-[1.5px] bg-current transition-all duration-300 w-0 group-hover:w-full ${isLinkActive === link.title ? 'w-full' : ''}`} />
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu navLinks={navLinks} />
        )}
      </AnimatePresence>
    </nav>
  );
}
