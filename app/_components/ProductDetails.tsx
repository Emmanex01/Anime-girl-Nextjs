'use client';
import React, { useState, useEffect, useRef, useMemo, MouseEvent as ReactMouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Star, Heart, ShoppingCart, Plus, Minus, ArrowLeft, 
  CheckCircle2, Flame, RefreshCw, Shield, Truck, Sparkles, MessageSquare
} from 'lucide-react';
import { useShopStore } from '../store/useShopStore';
import { products } from '../data';
import { Product } from '../types';

// Anime & Otaku details and reviews records
const DEFAULT_REVIEWS: Record<string, { username: string; rating: number; date: string; comment: string; helpful: number }[]> = {
  '1': [
    { username: '@SatoruSensei', rating: 5, date: '2026-05-18', comment: 'Infinite void styling! The paint job on the hair is cel-shaded beautifully under purple ambient light.', helpful: 42 },
    { username: '@GigaChadOtaku', rating: 5, date: '2026-05-10', comment: 'Looks amazing on my desktop. Package arrived in mint condition with holo authentication sticker.', helpful: 18 },
    { username: '@MegumisWolf', rating: 4, date: '2026-04-29', comment: 'Very high quality sculpt, though the base stand is slightly larger than expected. Still 100% worth it.', helpful: 5 }
  ],
  '2': [
    { username: '@ItachiSweaves', rating: 5, date: '2026-05-24', comment: 'Absolutely majestic embroidery. Warm and thick heavyweight fleece perfect for Tokyo winter walkthroughs.', helpful: 67 },
    { username: '@UchihaLegacy', rating: 5, date: '2026-05-15', comment: 'Best street collection buy this year. The fit is beautifully oversized and holds its shape.', helpful: 24 }
  ],
  '3': [
    { username: '@KingOfPirates', rating: 5, date: '2026-05-25', comment: 'Gear 5 hype is real! The visual energy of this figure is absolute top-tier. Dynamic lighting hits it perfectly!', helpful: 110 },
    { username: '@NamiMandar', rating: 5, date: '2026-05-02', comment: 'Wonderful details on Luffy\'s straw hat texture and clothing fabric. Fast shipping!', helpful: 31 }
  ],
  '4': [
    { username: '@SneakerChunin', rating: 5, date: '2026-05-20', comment: 'Walked through Shibuya with these. Insanely comfortable responsive soles and subtle reflecting side panels.', helpful: 53 },
    { username: '@SasukeStan', rating: 4, date: '2026-05-08', comment: 'Really love the Sharingan heel printing. Fits slightly snug on wider feet, maybe order half US size up.', helpful: 12 }
  ],
  '5': [
    { username: '@NezukoBoxer', rating: 5, date: '2026-05-26', comment: 'Excellent water-resistant material, lots of utility compartments. Perfect for carrying laptop and manga scrolls!', helpful: 29 }
  ]
};

const GALLERY_IMAGES: Record<string, string[]> = {
  '1': [
    'https://images.unsplash.com/photo-1608889476561-6242afdbf622?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1000&auto=format&fit=crop',
  ],
  '2': [
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1000&auto=format&fit=crop',
  ],
  '3': [
    'https://images.unsplash.com/photo-1613333151270-4f5bd191f692?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop',
  ],
  '4': [
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop',
  ],
  '5': [
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1577733966973-d6b91397f906?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop',
  ],
};

interface ProductDetailsContentProps {
  product: Product;
  key?: string | number;
}

export function ProductDetailsContent({ product: selectedProduct }: ProductDetailsContentProps) {
  const { 
    setSelectedProduct, 
    addToCart, 
    addToWishlist, 
    removeFromWishlist, 
    isWishlisted 
  } = useShopStore();

  // Variants Mapping based on product characteristics
  const getVariants = (product: Product) => {
    const isFigure = product.category === 'Jujutsu Kaisen' || product.category === 'One Piece';
    const isSneaker = product.name.toLowerCase().includes('sneakers');
    const isClothing = product.name.toLowerCase().includes('hoodie');

    if (isFigure) {
      return {
        sizes: ['1/8 SCALE MODEL', '1/6 SCALE DELUXE + BASE', '1/4 COLLECTORS MECH'],
        colors: ['ORIGINAL SHADING', 'TOKYO CELESTIAL METALLIC', 'GLITCH MONOCHROME'],
      };
    }
    if (isSneaker) {
      return {
        sizes: ['US 8 / EU 41', 'US 9 / EU 42', 'US 10 / EU 43', 'US 11 / EU 44'],
        colors: ['ONYX ECLIPSE', 'AURORA VOLT CHIP', 'SHARINGAN CRIMSON'],
      };
    }
    if (isClothing) {
      return {
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['STREET MATTE CHARCOAL', 'NEO SHINJUKU BLACK', 'CYBER GLOW PIGMENT'],
      };
    }
    return {
      sizes: ['TACTILE SLIM', 'EXPANDED STORAGE DUAL'],
      colors: ['TACTICAL OBSIDIAN', 'VANDAL GREEN STITCH'],
    };
  };

  const { sizes, colors } = useMemo(() => getVariants(selectedProduct), [selectedProduct.id]);

  // Component State
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [reviewsList, setReviewsList] = useState(DEFAULT_REVIEWS[selectedProduct.id] || []);
  const [isStickyVisible, setIsStickyVisible] = useState(false);

  // Gallery Zoom Lens State
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);

  // Write Review form state
  const [formName, setFormName] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Refs for sticky detection & scroll resets
  const containerRef = useRef<HTMLDivElement>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);

  const imagesList = GALLERY_IMAGES[selectedProduct.id] || [selectedProduct.image];

  // Reset states when dynamic selection updates
  useEffect(() => {
    setActiveImageIndex(0);
    setSelectedSize(sizes[0]);
    setSelectedColor(colors[0]);
    setQuantity(1);
    setReviewsList(DEFAULT_REVIEWS[selectedProduct.id] || []);
    setFormSuccess(false);
    setFormName('');
    setFormComment('');
    setFormRating(5);
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [selectedProduct.id, sizes, colors]);

  // Handle Close Keyboard action
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProduct(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedProduct]);

  // Monitor CTA button intersection to display Sticky Panel
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStickyVisible(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const target = ctaButtonRef.current;
    if (target) {
      observer.observe(target);
    }
    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [selectedProduct.id, reviewsList]);

  // Ratings calculation
  const totalReviewsCount = reviewsList.length;
  const avgRatingScore = totalReviewsCount > 0 
    ? Number((reviewsList.reduce((sum, rev) => sum + rev.rating, 0) / totalReviewsCount).toFixed(1))
    : selectedProduct.rating;

  // Zoom Handler
  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleHelpfulIncrement = (index: number) => {
    const updated = [...reviewsList];
    updated[index].helpful += 1;
    setReviewsList(updated);
  };

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) return;

    const newReview = {
      username: `@${formName.replace(/\s+/g, '')}`,
      rating: formRating,
      date: new Date().toISOString().split('T')[0],
      comment: formComment,
      helpful: 0
    };

    setReviewsList([newReview, ...reviewsList]);
    setFormSuccess(true);
    setFormName('');
    setFormComment('');
  };

  // Add to cart payload handler
  const handleAddToBag = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(selectedProduct, selectedSize, selectedColor);
    }
  };

  // Related products logic - filter from same category or list others
  const relatedList = products
    .filter((p) => p.id !== selectedProduct.id)
    .slice(0, 3);

  const wishlisted = isWishlisted(selectedProduct.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#060810] z-[150] overflow-y-auto"
        ref={containerRef}
        id="product-details-immersion-page"
      >
        {/* Upper Brand Control Row */}
        <div className="sticky top-0 bg-[#060810]/95 backdrop-blur-md border-b border-white/5 z-[160] flex items-center justify-between px-4 md:px-8 py-4">
          <button 
            onClick={() => setSelectedProduct(null)}
            className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-white/50 hover:text-[#00f2ff] transition-all uppercase italic"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO DECK
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-neon-blue font-black uppercase">
              DECK CONTROL // 0{selectedProduct.id}
            </span>
          </div>

          <button 
            onClick={() => setSelectedProduct(null)}
            className="w-10 h-10 rounded-sm border border-white/5 hover:border-white/20 transition-all flex items-center justify-center text-white/50 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Page Workspace Content */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            
            {/* COLUMN 1: Galleried Media System (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Massive Main Viewport Frame */}
              <div 
                className="relative aspect-square md:aspect-[4/3] w-full overflow-hidden bg-[#0d0f19] border border-white/10 rounded-sm cursor-zoom-in"
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={handleMouseMove}
              >
                <motion.img
                  key={activeImageIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  src={imagesList[activeImageIndex]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  style={{
                    transform: isZooming ? 'scale(2.2)' : 'scale(1)',
                    transformOrigin: isZooming ? `${zoomPos.x}% ${zoomPos.y}%` : 'center',
                    transition: isZooming ? 'none' : 'transform 0.25s ease-out'
                  }}
                />

                {/* Cyber HUD Overlays */}
                <div className="absolute inset-0 pointer-events-none border border-[#00f2ff]/20 flex flex-col justify-between p-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] font-mono tracking-widest text-[#00f2ff] bg-[#0c0e17]/80 px-2 py-1 rounded-sm border border-[#00f2ff]/20">
                      SYS_LENS: HD_ZOOM
                    </span>
                    {isZooming && (
                      <span className="text-[8px] font-mono tracking-widest text-[#ff003c] bg-black/80 px-2 py-1 rounded-sm border border-[#ff003c]/20 animate-pulse">
                        LENS_LOCK: ACTIVE
                      </span>
                    )}
                  </div>
                  
                  {/* Scope markings */}
                  <div className="flex items-center justify-between text-white/20 font-mono text-[7px] tracking-widest">
                    <span>X: {zoomPos.x.toFixed(0)}%</span>
                    <span>Y: {zoomPos.y.toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              {/* Horizontal Scrollable Thumbnails Dock */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 md:w-24 md:h-24 bg-[#0d0f19] rounded-sm overflow-hidden flex-shrink-0 border transition-all ${
                      idx === activeImageIndex 
                        ? 'border-neon-blue shadow-[0_0_12px_rgba(0,242,255,0.3)]' 
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${idx + 1}`} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>

              {/* Trust badges and Cyber Meta-Data */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/5">
                <div className="p-3 bg-[#0c0e17] border border-white/5 rounded-sm flex flex-col items-center text-center gap-1.5">
                  <Truck className="w-4 h-4 text-neon-blue" />
                  <span className="text-[9px] font-black uppercase tracking-wider text-white">WORLD SHIPPING</span>
                  <span className="text-[7.5px] font-mono text-white/40 tracking-tight">SHIPS ENROUTE IN 24H</span>
                </div>
                <div className="p-3 bg-[#0c0e17] border border-white/5 rounded-sm flex flex-col items-center text-center gap-1.5">
                  <Shield className="w-4 h-4 text-neon-red" />
                  <span className="text-[9px] font-black uppercase tracking-wider text-white">100% AUTHENTIC</span>
                  <span className="text-[7.5px] font-mono text-white/40 tracking-tight">TOKYO OFFICIAL CHRONIC</span>
                </div>
                <div className="p-3 bg-[#0c0e17] border border-white/5 rounded-sm flex flex-col items-center text-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-emerald-400" />
                  <span className="text-[9px] font-black uppercase tracking-wider text-white">RETURNS CHANCE</span>
                  <span className="text-[7.5px] font-mono text-white/40 tracking-tight">7-DAY ROTATION POLICY</span>
                </div>
                <div className="p-3 bg-[#0c0e17] border border-white/5 rounded-sm flex flex-col items-center text-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span className="text-[9px] font-black uppercase tracking-wider text-white">TOKYO COB CURD</span>
                  <span className="text-[7.5px] font-mono text-white/40 tracking-tight">AUTHENTIFIED S-VANGUARD</span>
                </div>
              </div>

            </div>

            {/* COLUMN 2: Meta Control Panel & Specifications (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Title & Metadata Header */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-[#ff003c]/20 border border-[#ff003c]/40 text-[#ff003c] text-[8px] px-2 py-0.5 font-black uppercase tracking-widest italic rounded-sm">
                    {selectedProduct.label || 'OFFICIAL RELEASE'}
                  </span>
                  <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">
                    {selectedProduct.category.toUpperCase()}
                  </span>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight text-white uppercase italic">
                  {selectedProduct.name}
                </h1>

                {/* Dynamic Rating Review block */}
                <div className="flex items-center gap-4 py-1.5 border-y border-white/5">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-yellow-400" />
                    <span className="font-mono text-xs font-black text-white">{avgRatingScore}</span>
                  </div>
                  <span className="text-white/20">|</span>
                  <a href="#reviews-anchor" className="text-[10px] font-black tracking-widest text-neon-blue hover:underline uppercase italic flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {totalReviewsCount} NEURAL REVIEWS
                  </a>
                </div>
              </div>

              {/* Price Details */}
              <div className="bg-[#0b0d16] p-4 rounded-sm border border-white/5 flex items-baseline justify-between">
                <div>
                  <span className="text-[8px] font-mono tracking-widest text-white/30 uppercase block mb-1">RETAIL VALUE</span>
                  <span className="text-2xl font-display font-black text-white italic tracking-tighter">
                    N{selectedProduct.price.toLocaleString()}
                  </span>
                </div>
                {selectedProduct.originalPrice && (
                  <div className="text-right">
                    <span className="text-[8px] font-mono tracking-widest text-[#ff003c] uppercase block mb-1">MSRP OFF</span>
                    <span className="text-sm line-through text-white/25 italic font-black">
                      N{selectedProduct.originalPrice.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Variant 1: Size Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                    VARIANT SIZE: <span className="text-neon-blue">{selectedSize}</span>
                  </span>
                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">FLEX MATRIX</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-3 rounded-sm text-[9px] font-black tracking-wider uppercase italic border transition-all ${
                        selectedSize === sz
                          ? 'bg-[#00f2ff]/10 border-neon-blue text-white shadow-[0_0_10px_rgba(0,242,255,0.15)]'
                          : 'bg-[#0a0c13] border-white/5 text-white/50 hover:border-white/10 hover:text-white'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Variant 2: Color/Skin Option Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                    VARIANT SKIN: <span className="text-neon-red">{selectedColor}</span>
                  </span>
                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">GLITCH SYSTEM</span>
                </div>
                <div className="space-y-2">
                  {colors.map((col) => (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      className={`w-full py-3.5 px-4 rounded-sm border flex items-center justify-between transition-all ${
                        selectedColor === col
                          ? 'bg-[#ff003c]/10 border-neon-red text-white shadow-[0_0_10px_rgba(255,0,60,0.1)]'
                          : 'bg-[#0a0c13] border-white/5 text-white/50 hover:border-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full ring-2 ring-offset-2 ring-offset-[#060810] ${
                          col.includes('CRIMSON') || col.includes('RED') || col.includes('GLOW')
                            ? 'bg-neon-red ring-neon-red' 
                            : col.includes('AURORA') || col.includes('VOLT') || col.includes('METALLIC')
                            ? 'bg-neon-blue ring-neon-blue'
                            : 'bg-white/40 ring-white/20'
                        }`} />
                        <span className="text-[9.5px] font-black uppercase tracking-wider italic leading-none">{col}</span>
                      </div>
                      <span className="text-[7px] font-mono tracking-widest text-white/25">SECURE MATRIX</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions Stack: Quantity increments & Checkout Grid */}
              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-4">
                  {/* Quantity adjustments */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/40">BATCH QUANTITY</span>
                    <div className="flex items-center border border-white/10 bg-black/40 rounded-sm p-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 rounded-sm hover:bg-white/5 flex items-center justify-center text-white/50 hover:text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-12 text-center text-xs font-mono font-black text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 rounded-sm hover:bg-white/5 flex items-center justify-center text-white/50 hover:text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Primary ADD TO ZIP BAG action */}
                  <div className="flex-1 flex flex-col gap-1.5 justify-end">
                    <span className="text-[8.5px] font-black uppercase tracking-widest text-white/40 text-right">COMMENCE IMPORT</span>
                    <button
                      ref={ctaButtonRef}
                      onClick={handleAddToBag}
                      className="w-full bg-[#ff003c] hover:bg-[#ff003c]/90 text-white font-black h-[42px] px-6 rounded-sm text-[11px] tracking-[0.2em] uppercase italic transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,0,60,0.3)] hover:shadow-[0_0_25px_rgba(255,0,60,0.5)] active:scale-[0.98]"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      IMPORT TO SHIP BAG
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Wishlist triggers */}
                  <button
                    onClick={() => {
                      if (wishlisted) {
                        removeFromWishlist(selectedProduct.id);
                      } else {
                        addToWishlist(selectedProduct);
                      }
                    }}
                    className={`h-[42px] rounded-sm text-[9.5px] uppercase font-black tracking-widest italic border flex items-center justify-center gap-2 transition-all ${
                      wishlisted
                        ? 'border-neon-red bg-neon-red/10 text-neon-red shadow-[0_0_10px_rgba(255,0,60,0.25)]'
                        : 'border-white/10 hover:border-white/20 text-white'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-neon-red' : ''}`} />
                    {wishlisted ? 'WISHLISTED // SECURE' : 'TAG TO WISHLIST'}
                  </button>

                  {/* Direct Instant Recruit option */}
                  <button
                    onClick={() => {
                      handleAddToBag();
                      useShopStore.getState().setCartOpen(true);
                    }}
                    className="h-[42px] rounded-sm text-[9.5px] uppercase font-black tracking-widest italic border border-[#00f2ff]/30 hover:bg-[#00f2ff]/5 text-[#00f2ff] flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,242,255,0.05)] hover:shadow-[0_0_15px_rgba(0,242,255,0.2)]"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    INSTANT DEPLOYBAG
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* SECTION: Related Releases Carousel */}
          <div className="mt-20 pt-12 border-t border-white/5 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <h3 className="text-lg md:text-xl font-display font-black uppercase tracking-tight italic text-white">
                RELATED <span className="text-neon-blue">RELEASES</span>
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedList.map((rel) => (
                <motion.div
                  key={rel.id}
                  whileHover={{ y: -6 }}
                  onClick={() => setSelectedProduct(rel)}
                  className="bg-[#0b0d16] border border-white/5 hover:border-white/10 rounded-sm p-4 cursor-pointer flex gap-4 items-center group transition-all"
                >
                  <div className="w-16 h-16 bg-slate-900 rounded-sm overflow-hidden flex-shrink-0 border border-white/5">
                    <img 
                      src={rel.image} 
                      alt={rel.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[7.5px] font-mono text-[#00f2ff] tracking-widest block uppercase mb-0.5">{rel.category}</span>
                    <h4 className="text-xs font-display font-black text-white group-hover:text-neon-blue transition-colors uppercase tracking-tight truncate">
                      {rel.name}
                    </h4>
                    <span className="font-display font-black text-xs italic text-white mt-1 block">N{rel.price.toLocaleString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* SECTION: Extended Anime Reviews Center */}
          <div id="reviews-anchor" className="mt-20 pt-12 border-t border-white/5 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            
            {/* Reviews list & statistics breakdown */}
            <div className="lg:col-span-7 space-y-8">
              <div className="flex items-center gap-3">
                <h3 className="text-lg md:text-xl font-display font-black uppercase tracking-tight italic text-white">
                  OTAKU RATING <span className="text-[#00f2ff]">INDEX</span>
                </h3>
                <span className="bg-white/5 border border-white/10 text-[9px] font-mono px-2 py-0.5 rounded-sm text-white/50">
                  {totalReviewsCount} SUBMISSIONS
                </span>
              </div>

              {/* Advanced Ratings Breakdown Bar metrics */}
              <div className="bg-[#0b0d16] p-6 rounded-sm border border-white/5 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                <div className="sm:col-span-4 text-center sm:text-left space-y-1">
                  <span className="font-display font-black text-4xl tracking-tighter text-white italic">
                    {avgRatingScore}
                  </span>
                  <div className="flex justify-center sm:justify-start items-center gap-0.5 text-yellow-500 py-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        className={`w-3.5 h-3.5 ${s <= Math.round(avgRatingScore) ? 'fill-yellow-500' : 'text-white/10'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest block">PROPORTIONAL SYSTEM</span>
                </div>

                <div className="sm:col-span-8 space-y-2 text-[9px] font-mono">
                  {/* 5 Star */}
                  <div className="flex items-center gap-3">
                    <span className="w-10 text-white/60 font-bold uppercase text-right">5 STAR</span>
                    <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: '85%' }} />
                    </div>
                    <span className="w-8 text-white/40 text-right font-bold">85%</span>
                  </div>
                  {/* 4 Star */}
                  <div className="flex items-center gap-3">
                    <span className="w-10 text-white/60 font-bold uppercase text-right">4 STAR</span>
                    <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: '10%' }} />
                    </div>
                    <span className="w-8 text-white/40 text-right font-bold">10%</span>
                  </div>
                  {/* Under 3 Stars */}
                  <div className="flex items-center gap-3">
                    <span className="w-10 text-white/60 font-bold uppercase text-right">≤ 3 STAR</span>
                    <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-yellow-400/40 rounded-full" style={{ width: '5%' }} />
                    </div>
                    <span className="w-8 text-white/40 text-right font-bold">5%</span>
                  </div>
                </div>
              </div>

              {/* Render review posts with staggered entry styles */}
              <div className="space-y-4">
                {reviewsList.length === 0 ? (
                  <div className="text-center py-8 text-white/30 uppercase tracking-widest font-black text-[10px]">
                    NO CURRENT NEURAL REVIEWS RECORDED
                  </div>
                ) : (
                  reviewsList.map((rev, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-5 bg-[#090b12] border border-white/5 rounded-sm space-y-3 hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-display font-black tracking-tight text-[#00f2ff] uppercase italic">
                            {rev.username}
                          </span>
                          <span className="text-white/20 text-[9px]font-bold">|</span>
                          <span className="text-[8px] font-mono text-white/30">{rev.date}</span>
                        </div>
                        
                        <div className="flex items-center gap-0.5 text-yellow-500">
                          {[1,2,3,4,5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-3 h-3 ${star <= rev.rating ? 'fill-yellow-500' : 'text-white/10'}`} 
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs leading-relaxed text-white/70 uppercase tracking-tight">
                        {rev.comment}
                      </p>

                      <div className="flex items-center justify-between text-[9px] font-mono pt-1">
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          VERIFIED OUTPOST SECY BUYER
                        </span>
                        
                        <button 
                          onClick={() => handleHelpfulIncrement(index)}
                          className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded-sm hover:text-white text-white/60 transition-colors flex items-center gap-1 cursor-pointer font-bold leading-none uppercase"
                        >
                          Helpful ({rev.helpful})
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

            </div>

            {/* Sticky/Responsive interactive Write A Review Form Column (lg:col-span-5) */}
            <div className="lg:col-span-5">
              <div className="bg-[#0b0d16] p-6 rounded-sm border border-white/5 space-y-6 lg:sticky lg:top-24">
                <div className="space-y-1">
                  <h4 className="text-sm font-display font-black uppercase tracking-widest text-[#ff003c]">WRITE OUTPOST FEEDBACK</h4>
                  <p className="text-[9px] font-mono text-white/40 uppercase tracking-tight leading-snug">
                    TRANSLATE YOUR ACQUISITION INSIGHTS SECURELY VIA DECKING FREQS.
                  </p>
                </div>

                {formSuccess ? (
                  <div className="p-4 bg-emerald-400/10 border border-emerald-400/30 rounded-sm text-center space-y-3">
                     <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                     <p className="text-xs uppercase font-black text-emerald-400 tracking-wider font-display">
                       TRANSMISSION DELIVERED SECURELY!
                     </p>
                     <p className="text-[9px] text-white/50 uppercase font-bold tracking-tight">
                       Your review has been cataloged to the Outpost index.
                     </p>
                     <button
                       onClick={() => setFormSuccess(false)}
                       className="text-[9px] uppercase tracking-widest text-white hover:text-neon-blue border border-white/5 hover:border-white/20 transition-all rounded-sm px-4 py-2 bg-white/5"
                     >
                       WRITE ANOTHER RECON
                     </button>
                  </div>
                ) : (
                  <form onSubmit={handlePostReview} className="space-y-4">
                    {/* Star selection rate inputs */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/50 block">RATING SELECTION</label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setFormRating(star)}
                            className="text-white/30 hover:text-yellow-400 transition-colors cursor-pointer"
                          >
                            <Star 
                              className={`w-6 h-6 ${star <= formRating ? 'fill-yellow-500 text-yellow-500' : 'text-neutral-750'}`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Nickname input */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/50 block">OTAKU NICKNAME</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. ShinobiKento"
                        className="w-full bg-[#060810] border border-white/5 focus:border-neon-blue text-xs uppercase italic font-bold placeholder-white/20 py-3 px-4 rounded-sm text-white focus:outline-none transition-all"
                      />
                    </div>

                    {/* Comments textarea */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/50 block">CONSPIRACY FEEDBACK</label>
                      <textarea
                        required
                        rows={4}
                        value={formComment}
                        onChange={(e) => setFormComment(e.target.value)}
                        placeholder="GIVE INTEGRAL SCULPT DETAILS..."
                        className="w-full bg-[#060810] border border-white/5 focus:border-[#ff003c] text-xs uppercase italic font-bold placeholder-white/20 py-3 px-4 rounded-sm text-white focus:outline-none transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full h-11 bg-transparent border border-[#ff003c]/60 hover:bg-[#ff003c]/10 text-neon-red font-black text-[10px] tracking-[0.2em] uppercase italic transition-all rounded-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,0,60,0.05)] hover:shadow-[0_0_15px_rgba(255,0,60,0.2)] cursor-pointer"
                    >
                      SUBMIT FEEDBACK RECON
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* SECTION: Sticky Add-to-Cart Panel footer (floats on scroll) */}
        <AnimatePresence>
          {isStickyVisible && (
            <motion.div
              initial={{ y: 90 }}
              animate={{ y: 0 }}
              exit={{ y: 90 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed bottom-0 left-0 right-0 bg-[#070911]/95 backdrop-blur-md border-t border-white/10 py-3 px-4 md:px-8 flex items-center justify-between z-[170] shadow-[0_-10px_25px_rgba(0,0,0,0.7)]"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="hidden sm:block w-12 h-12 rounded-sm overflow-hidden border border-white/5 bg-[#0d0f19]">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-display font-black text-white truncate max-w-[150px] sm:max-w-[220px] uppercase italic">
                    {selectedProduct.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="bg-[#00f2ff]/10 text-neon-blue border border-[#00f2ff]/20 rounded-sm text-[8px] font-mono px-1.5 font-bold">
                      {selectedSize}
                    </span>
                    <span className="bg-[#ff003c]/10 text-neon-red border border-[#ff003c]/20 rounded-sm text-[8px] font-mono px-1.5 font-bold">
                      {selectedColor.split(' ')[0]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-display font-black text-lg italic text-[#00f2ff] whitespace-nowrap">
                  N{(selectedProduct.price * quantity).toLocaleString()}
                </span>
                <button
                  onClick={handleAddToBag}
                  className="bg-[#24d9c7] hover:bg-[#24d9c7]/90 text-black font-black text-[10px] tracking-widest uppercase italic px-5 h-10 rounded-sm flex items-center gap-1.5 shadow-[0_0_15px_rgba(36,217,199,0.35)] transition-all"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  IMPORT FEED
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
  );
}

export function ProductDetails() {
  const selectedProduct = useShopStore((state) => state.selectedProduct);

  return (
    <AnimatePresence>
      {selectedProduct && (
        <ProductDetailsContent product={selectedProduct} key={selectedProduct.id} />
      )}
    </AnimatePresence>
  );
}
