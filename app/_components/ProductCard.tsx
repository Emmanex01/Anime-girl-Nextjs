import { motion } from 'motion/react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product } from '../types';
import { useShopStore } from '../store/useShopStore';
import { MouseEvent } from 'react';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isSale = product.label === 'SALE';
  const { addToCart, addToWishlist, removeFromWishlist, isWishlisted, setSelectedProduct } = useShopStore();
  const wishlisted = isWishlisted(product.id);

  const handleWishlistClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleCartClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      onClick={() => setSelectedProduct(product)}
      className="group relative flex flex-col bg-[#0f111a] border border-white/5 rounded-sm overflow-hidden min-w-[280px] md:min-w-[300px] select-none cursor-pointer hover:border-white/10 transition-all duration-300"
    >
      <Link href={`/products/${product.id}`}>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-slate-900">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.label && (
              <Badge 
                className={`rounded-sm text-[8px] px-2 py-0.5 border-none font-black italic tracking-widest uppercase ${
                  product.label === 'NEW' ? 'bg-neon-blue text-black' : 
                  product.label === 'LIMITED' ? 'bg-neon-red text-white' :
                  product.label === 'TRENDING' ? 'bg-neon-red text-white' :
                  'bg-neon-red text-white'
                }`}
              >
                {product.label}
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border transition-all z-10 ${
              wishlisted 
                ? 'border-neon-red text-neon-red shadow-[0_0_10px_rgba(255,0,60,0.3)]' 
                : 'border-white/10 text-white/70 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-neon-red text-neon-red' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col items-start gap-1">
          <h3 className="font-display font-medium text-sm leading-snug text-white/90 group-hover:text-white transition-colors uppercase tracking-tight">
            {product.name}
          </h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">
            {product.category}
          </p>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-0.5 text-[10px] text-yellow-400 font-bold">
                <Star className="w-3 h-3 fill-yellow-400" />
                {product.rating}
            </div>
            <span className="text-white/20 text-[10px] uppercase font-bold tracking-widest">({product.reviewCount})</span>
          </div>

          <div className="flex items-center justify-between w-full mt-auto pt-2 border-t border-white/5">
            <div className="flex flex-col">
              {isSale && product.originalPrice ? (
                <span className="text-[10px] line-through text-white/20 font-bold leading-none mb-1 uppercase tracking-tighter italic">N{product.originalPrice.toLocaleString()}</span>
              ) : null}
              <span className={`font-display font-black text-lg italic tracking-tighter ${isSale ? 'text-neon-red' : 'text-white'}`}>
                N{product.price.toLocaleString()}
              </span>
            </div>
            
            <button 
              onClick={handleCartClick}
              className="w-10 h-10 bg-neon-blue rounded-sm flex items-center justify-center text-black hover:bg-neon-blue/80 transition-all shadow-[0_0_15px_rgba(0,242,255,0.3)]"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
