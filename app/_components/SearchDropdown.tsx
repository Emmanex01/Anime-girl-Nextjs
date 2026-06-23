import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Hash, Tag, ArrowRight, CornerDownLeft } from 'lucide-react';
import { Product } from '../types';
import { useShopStore } from '../store/useShopStore';

interface SearchDropdownProps {
  query: string;
  onSelectResult: () => void;
  onClearQuery: () => void;
}

export function SearchDropdown({ query, onSelectResult, onClearQuery }: SearchDropdownProps) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [isSearching, setIsSearching] = useState(false);
  
  const { setSelectedProduct, setCurrentRoute, setSearchFilter, setCategoryFilter, products } = useShopStore();

  // Debounce effect
  useEffect(() => {
    setIsSearching(true);
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setIsSearching(false);
    }, 300); // 300ms debounce
    return () => clearTimeout(handler);
  }, [query]);

  // Only consider enabled and non-hidden products
  const activeProducts = products.filter(p => p.enabled !== false && p.hide !== true);

  // Filtering products
  const q = debouncedQuery.trim().toLowerCase();
  const filteredProducts = q
    ? activeProducts.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(q);
        const categoryMatch = p.category.toLowerCase().includes(q);
        const tagMatch = p.tags?.some((t) => t.toLowerCase().includes(q)) || false;
        return nameMatch || categoryMatch || tagMatch;
      })
    : [];

  // Match tags/categories separately for quick filters
  const matchingCategories = q
    ? Array.from(
        new Set(
          activeProducts
            .filter((p) => p.category.toLowerCase().includes(q))
            .map((p) => p.category)
        )
      )
    : [];

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    onSelectResult();
    onClearQuery();
  };

  const handleSeeAllResults = () => {
    setSearchFilter(debouncedQuery);
    setCategoryFilter('');
    setCurrentRoute('products');
    onSelectResult();
    onClearQuery();
  };

  const handleCategoryClick = (category: string) => {
    setCategoryFilter(category);
    setSearchFilter('');
    setCurrentRoute('products');
    onSelectResult();
    onClearQuery();
  };

  if (!query) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.99 }}
      transition={{ duration: 0.2 }}
      className="absolute top-12 left-0 right-0 z-50 mt-2 overflow-hidden bg-[#0a0d1a]/95 backdrop-blur-xl border border-white/10 shadow-[0_10px_50px_rgba(0,0,0,0.8)] rounded-sm"
    >
      <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-white/50 tracking-widest uppercase">
          <Search className="w-3.5 h-3.5 text-neon-blue" />
          <span>Searching for: <span className="text-neon-red font-mono lowercase italic">"{query}"</span></span>
        </div>
        {isSearching && (
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
      </div>

      <div className="max-h-[420px] overflow-y-auto scrollbar-thin">
        {filteredProducts.length > 0 ? (
          <div className="p-2 space-y-4">
            {/* Quick Suggestions / Categories */}
            {matchingCategories.length > 0 && (
              <div className="px-3 pt-2">
                <span className="text-[9px] font-black tracking-widest text-[#00f2ff]/60 uppercase block mb-2">MATCHING CATEGORIES • カテゴリ</span>
                <div className="flex flex-wrap gap-1.5">
                  {matchingCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-white/5 border border-white/5 text-[10px] font-bold text-white/80 hover:bg-neon-blue hover:border-neon-blue hover:text-black transition-all cursor-pointer"
                    >
                      <Hash className="w-3 h-3 text-neon-blue group-hover:text-black" />
                      <span>{cat.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Products Listing */}
            <div className="px-1">
              <span className="text-[9px] font-black tracking-widest text-white/40 uppercase block px-2 mb-2">MERCHANDISE • 商品</span>
              <div className="space-y-1">
                {filteredProducts.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="flex items-center gap-4 p-2 rounded-sm hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-sm overflow-hidden bg-slate-900 border border-white/5 flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white group-hover:text-neon-blue transition-colors truncate">
                        {product.name}
                      </p>
                      <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mt-0.5">
                        {product.category}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="font-display font-black text-xs text-white italic">
                        N{product.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* See All Button */}
            {filteredProducts.length > 5 && (
              <div className="p-2 border-t border-white/5">
                <button
                  onClick={handleSeeAllResults}
                  className="w-full h-10 flex items-center justify-center gap-2 rounded-sm bg-neon-blue/10 border border-neon-blue/20 hover:bg-neon-blue hover:text-black hover:border-none text-[10px] font-black tracking-widest uppercase italic text-neon-blue transition-all cursor-pointer"
                >
                  <span>SEE ALL {filteredProducts.length} PRODUCTS</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        ) : (
          !isSearching && (
            <div className="py-12 px-6 text-center">
              <span className="text-3xl block mb-2 opacity-60">📪</span>
              <p className="text-[11px] font-mono tracking-widest text-neon-red uppercase">一致する商品が見つかりません</p>
              <h4 className="text-xs font-bold text-white/80 mt-1">NO PRODUCTS MATCHED YOUR QUERY</h4>
              <p className="text-[10px] text-white/40 mt-2 max-w-sm mx-auto leading-relaxed">
                Check spelling, use active anime series keywords (e.g. "Gojo", "Luffy", "Akatsuki"), or browse our shop collections below.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-1.5 max-w-xs mx-auto">
                {['FIGURE', 'HOODIE', 'STICKER', 'NARUTO', 'ONE PIECE'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setDebouncedQuery(term.toLowerCase());
                      setSearchFilter(term); // Sync filter as well
                    }}
                    className="px-2 py-1 rounded-sm bg-white/5 border border-white/10 hover:border-white/25 text-[9px] text-white/60 hover:text-white transition-all cursor-pointer"
                  >
                    #{term}
                  </button>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      {filteredProducts.length > 0 && (
        <div className="px-4 py-2 bg-black/40 border-t border-white/5 flex items-center justify-between text-[9px] text-white/30 font-mono tracking-wide">
          <span>HINT: TYPE AND SEARCH DYNAMICALLY</span>
          <div className="flex items-center gap-1">
            <span>ENTER TO FILTER LIST</span>
            <CornerDownLeft className="w-2.5 h-2.5" />
          </div>
        </div>
      )}
    </motion.div>
  );
}
