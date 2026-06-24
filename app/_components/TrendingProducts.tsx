'use client'
import { ProductCard } from './ProductCard';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { useShopStore } from '../store/useShopStore';
import Link from 'next/link';

export function TrendingProducts() {
  const { setCurrentRoute, setCategoryFilter, setSearchFilter, products } = useShopStore();

  const handleViewAll = () => {
    setCategoryFilter('');
    setSearchFilter('');
    setCurrentRoute('products');
  };

  // Only show products that are enabled and not hidden
  const visibleProducts = products.filter(p => p.enabled !== false && p.hide !== true);

  return (
    <section className="py-12 bg-background border-t border-white/5">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-xl md:text-2xl font-display font-black tracking-tighter uppercase italic"
            >
              TRENDING <span className="text-white">NOW</span>
            </motion.h2>
            <motion.span 
              animate={{ scale: [1, 1.2, 1] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-xl"
            >
              🔥
            </motion.span>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1 text-[10px] font-black tracking-[0.2em] text-white/40 hover:text-white hover:text-neon-blue transition-colors uppercase italic cursor-pointer"
          >
            VIEW ALL <ChevronRight className="w-3 h-3 text-neon-blue" />
          </Link>
        </div>

        <div className="relative">
          <div className="flex overflow-x-auto gap-4 pb-8 scrollbar-hide snap-x">
            {visibleProducts.slice(0, 6).map((product) => (
              <div key={product.id} className="snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
