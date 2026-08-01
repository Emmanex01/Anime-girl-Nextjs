'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { Search, CornerDownLeft } from 'lucide-react';
import { Product } from '@/lib/shopify/types';

interface SearchDropdownProps {
  query: string;
  products: Product[];
  isSearching: boolean;
  onSelectResult: () => void;
  onClearQuery: () => void;
  onProductClick?: (product: Product) => void;
}

export function SearchDropdown({
  query,
  products,
  isSearching,
  onSelectResult,
  onClearQuery,
  onProductClick,
}: SearchDropdownProps) {
  if (!query.trim()) return null;

  const handleProductClick = (product: Product) => {
    onProductClick?.(product);
    onSelectResult();
    onClearQuery();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.99 }}
      transition={{ duration: 0.2 }}
      className="absolute top-12 left-0 right-0 z-50 mt-2 overflow-hidden rounded-sm border border-white/10 bg-[#0a0d1a]/95 shadow-[0_10px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] p-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50">
          <Search className="h-3.5 w-3.5 text-neon-blue" />
          <span>
            Searching for:{' '}
            <span className="font-mono italic lowercase text-neon-red">
              "{query}"
            </span>
          </span>
        </div>

        {isSearching && (
          <div className="flex gap-1">
            <span
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-neon-blue"
              style={{ animationDelay: '0ms' }}
            />
            <span
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-neon-blue"
              style={{ animationDelay: '150ms' }}
            />
            <span
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-neon-blue"
              style={{ animationDelay: '300ms' }}
            />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="max-h-[420px] overflow-y-auto scrollbar-thin">
        {!isSearching && products.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <span className="mb-2 block text-3xl opacity-60">📪</span>

            <p className="text-[11px] font-mono uppercase tracking-widest text-neon-red">
              No products found
            </p>

            <h4 className="mt-1 text-xs font-bold text-white/80">
              NO PRODUCTS MATCHED YOUR QUERY
            </h4>

            <p className="mx-auto mt-2 max-w-sm text-[10px] leading-relaxed text-white/40">
              Try another keyword or browse our collections.
            </p>
          </div>
        ) : (
          <div className="p-2">
            <span className="mb-2 block px-2 text-[9px] font-black uppercase tracking-widest text-white/40">
              MERCHANDISE • 商品
            </span>

            <div className="space-y-1">
              {products.slice(0, 5).map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleProductClick(product)}
                  className="group flex w-full cursor-pointer items-center gap-4 rounded-sm p-2 text-left transition-colors hover:bg-white/5"
                >
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-sm border border-white/5 bg-slate-900">
                    <Image
                      src={product.featuredImage?.url ?? '/placeholder.png'}
                      alt={product.title}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-white transition-colors group-hover:text-neon-blue">
                      {product.title}
                    </p>

                    <p className="mt-0.5 text-[10px] font-black uppercase tracking-widest text-white/40">
                      {product.title || 'PRODUCT'}
                    </p>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <span className="font-display text-xs font-black italic text-white">
                      ₦
                      {Number(
                        product.priceRange.minVariantPrice.currencyCode
                      ).toLocaleString()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {products.length > 0 && (
        <div className="flex items-center justify-between border-t border-white/5 bg-black/40 px-4 py-2 font-mono text-[9px] tracking-wide text-white/30">
          <span>KEEP TYPING TO REFINE RESULTS</span>

          <div className="flex items-center gap-1">
            <span>PRESS ENTER FOR FULL SEARCH</span>
            <CornerDownLeft className="h-2.5 w-2.5" />
          </div>
        </div>
      )}
    </motion.div>
  );
}