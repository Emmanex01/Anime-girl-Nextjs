'use client';
import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  SlidersHorizontal, ArrowUpDown, CornerUpLeft, Search, 
  Trash2, Sliders, ChevronDown, Check, AppWindow 
} from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useShopStore } from '../store/useShopStore';
import Link from 'next/link';

export function ProductsPage() {
  const { 
    currentRoute, 
    setCurrentRoute, 
    searchFilter, 
    setSearchFilter, 
    categoryFilter, 
    setCategoryFilter,
    products
  } = useShopStore();

  const [activeSort, setActiveSort] = useState<'popularity' | 'price-asc' | 'price-desc' | 'rating'>('popularity');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Load only visible & enabled products for public view
  const activeProducts = useMemo(() => {
    return products.filter((p) => p.enabled !== false && p.hide !== true);
  }, [products]);

  // Get distinct categories
  const categories = useMemo(() => {
    return ['ALL', ...Array.from(new Set(activeProducts.map((p) => p.category)))];
  }, [activeProducts]);

  // Filter and sort items
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...activeProducts];

    // Filter by category
    if (categoryFilter && categoryFilter !== 'ALL') {
      result = result.filter((p) => p.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    // Filter by search/tag/label query
    if (searchFilter) {
      const q = searchFilter.trim().toLowerCase();
      
      // Check if it matches tags exactly, category exactly, or name
      result = result.filter((p) => {
        // Tag search matches
        const tagMatch = p.tags?.some((t) => t.toLowerCase() === q || t.toLowerCase().includes(q)) || false;
        // Category matches
        const catMatch = p.category.toLowerCase().includes(q);
        // Label matches (NEW, LIMITED, TRENDING, SALE)
        const labelMatch = p.label?.toLowerCase() === q;
        // Name matches
        const nameMatch = p.name.toLowerCase().includes(q);
        
        return tagMatch || catMatch || labelMatch || nameMatch;
      });
    }

    // Apply Sorting
    if (activeSort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (activeSort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // Popularity (default, sorting by review count or id)
      result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [activeProducts, categoryFilter, searchFilter, activeSort]);

  const handleClearFilters = () => {
    setSearchFilter('');
    setCategoryFilter('');
    setActiveSort('popularity');
  };

  const sortOptions = [
    { value: 'popularity', label: 'MOST POPULAR • 人気順' },
    { value: 'price-asc', label: 'PRICE: LOW TO HIGH • 価格の安い順' },
    { value: 'price-desc', label: 'PRICE: HIGH TO LOW • 価格の高い順' },
    { value: 'rating', label: 'TOP RATED • 評価順' },
  ];

  const currentSortLabel = sortOptions.find(opt => opt.value === activeSort)?.label || '';

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background text-white selection:bg-neon-red/30 relative">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 relative z-10">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-white/50 hover:text-white hover:text-neon-blue transition-colors uppercase italic cursor-pointer"
          >
            <CornerUpLeft className="w-4 h-4 text-neon-blue" />
            <span>RETURN TO GATEWAY</span>
          </Link>
          
          <div className="text-[10px] font-mono text-white/30 tracking-widest uppercase">
            PATH: <span className="text-white/40">HOME</span> / <span className="text-neon-blue">PRODUCTS</span>
          </div>
        </div>

        {/* Header Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end border-b border-white/5 pb-12 mb-12">
          <div>
            <span className="text-xs font-black tracking-[0.4em] text-neon-blue uppercase block mb-3">
              MERCHANDISE CATALOG • カタログ
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter uppercase italic leading-none">
              ALL <span className="text-neon-red">PRODUCTS</span>
            </h1>
            <p className="text-white/40 text-xs md:text-sm mt-4 max-w-xl leading-relaxed">
              Premium curated street fashion, high-fidelity collectors' figures, and exclusive limited runs directly imported from Tokyo's Shibuya and Akihabara districts.
            </p>
          </div>

          {/* Quick Stats & Controls Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4">
            {/* Search Input Filter */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter current view..."
                className="w-full h-11 pl-10 pr-4 bg-white/5 border border-white/10 rounded-sm text-xs text-white placeholder-white/30 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all"
              />
              {searchFilter && (
                <button 
                  onClick={() => setSearchFilter('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-neon-red uppercase tracking-widest hover:underline"
                >
                  CLEAR
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                onBlur={() => setTimeout(() => setShowSortDropdown(false), 200)}
                className="w-full sm:w-64 h-11 px-4 bg-[#0a0d1a] border border-white/10 rounded-sm text-left text-[10px] font-black tracking-widest uppercase items-center justify-between flex text-white hover:border-white/30 hover:bg-white/[0.02] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-3.5 h-3.5 text-neon-blue" />
                  <span className="truncate">{currentSortLabel}</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Options */}
              {showSortDropdown && (
                <div className="absolute top-12 right-0 left-0 z-40 mt-1 bg-[#0d101d] border border-white/10 rounded-sm shadow-xl p-1 overflow-hidden">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setActiveSort(opt.value as any);
                        setShowSortDropdown(false);
                      }}
                      className="w-full px-3 py-2.5 rounded-sm text-left text-[9px] font-black tracking-widest uppercase flex items-center justify-between transition-colors hover:bg-white/5 text-white hover:text-neon-blue cursor-pointer"
                    >
                      <span>{opt.label}</span>
                      {activeSort === opt.value && <Check className="w-3.5 h-3.5 text-neon-blue" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Sidebar Category Filter Drawer/Block */}
          <div className="lg:col-span-3 space-y-8">
            <div className="p-6 border border-white/5 bg-[#070912]/80 backdrop-blur-md rounded-sm">
              <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase italic text-white">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-neon-red" />
                  <span>FILTER ENGINE</span>
                </div>
                {(categoryFilter || searchFilter) && (
                  <button 
                    onClick={handleClearFilters}
                    className="flex items-center gap-1.5 text-[8px] font-black text-neon-red uppercase tracking-widest hover:underline cursor-pointer"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                    <span>RESET</span>
                  </button>
                )}
              </div>

              {/* Category Links */}
              <div className="space-y-1">
                <span className="text-[9px] font-black tracking-widest text-white/30 uppercase block mb-3">ANIME UNIVERSE • 作品から探す</span>
                {categories.map((cat) => {
                  const isSelected = (!categoryFilter && cat === 'ALL') || (categoryFilter === cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategoryFilter(cat === 'ALL' ? '' : cat);
                      }}
                      className={`w-full text-left py-2 px-3 rounded-sm transition-all text-[10px] font-black tracking-widest uppercase flex items-center justify-between cursor-pointer group ${
                        isSelected 
                          ? 'bg-neon-blue/10 border-l-2 border-neon-blue text-neon-blue'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="truncate group-hover:translate-x-0.5 transition-transform">{cat}</span>
                    </button>
                  );
                })}
              </div>

              {/* Shortcut Tags Filter */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <span className="text-[9px] font-black tracking-widest text-white/30 uppercase block mb-3">POPULAR TAGS • 人気タグ</span>
                <div className="flex flex-wrap gap-1.5">
                  {['figure', 'apparel', 'streetwear', 'limited', 'replica', 'NEW', 'SALE'].map((tag) => {
                    const isSelected = searchFilter.toLowerCase() === tag.toLowerCase();
                    return (
                      <button
                        key={tag}
                        onClick={() => {
                          setSearchFilter(isSelected ? '' : tag);
                        }}
                        className={`text-[9px] font-bold px-2.5 py-1 rounded-sm border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-neon-red/10 border-neon-red text-neon-red shadow-[0_0_10px_rgba(255,0,60,0.2)]'
                            : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:text-white hover:border-white/10'
                        }`}
                      >
                        #{tag.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Product Grid Column */}
          <div className="lg:col-span-9">
            
            {/* Filtering Status Indicator */}
            {(categoryFilter || searchFilter) && (
              <div className="flex items-center justify-between mb-8 p-4 bg-white/[0.02] border border-white/5 rounded-sm">
                <div className="flex flex-wrap items-center gap-2 text-xs text-white/50">
                  <span>Showing results for:</span>
                  {categoryFilter && (
                    <span className="px-2.5 py-0.5 rounded-sm bg-neon-blue/10 text-neon-blue text-[10px] uppercase font-bold tracking-widest border border-neon-blue/20">
                      Universe: {categoryFilter}
                    </span>
                  )}
                  {searchFilter && (
                    <span className="px-2.5 py-0.5 rounded-sm bg-neon-red/10 text-neon-red text-[10px] uppercase font-bold tracking-widest border border-neon-red/20">
                      Search: "{searchFilter}"
                    </span>
                  )}
                </div>
                <button
                  onClick={handleClearFilters}
                  className="text-[10px] font-black text-neon-red uppercase tracking-widest underline hover:no-underline cursor-pointer"
                >
                  Clear Active View Filter
                </button>
              </div>
            )}

            {filteredAndSortedProducts.length > 0 ? (
              <div className="space-y-12">
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  AVAILABLE LISTINGS ({filteredAndSortedProducts.length})
                </div>
                
                {/* Product Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredAndSortedProducts.map((p, index) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                    >
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-24 px-8 border border-white/5 bg-[#070912]/50 rounded-sm text-center flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 bg-neon-red/10 rounded-full flex items-center justify-center text-neon-red text-2xl mb-6 shadow-[0_0_20px_rgba(255,0,60,0.1)]">
                  ⚠
                </div>
                <p className="text-xs font-mono tracking-widest text-neon-red uppercase">該当する商品がありません</p>
                <h3 className="text-lg md:text-xl font-display font-black tracking-tight text-white uppercase mt-2 mb-3">
                  NO PRODUCTS MATCH YOUR OPTIONS
                </h3>
                <p className="text-white/40 text-xs max-w-md mb-8 leading-relaxed">
                  We couldn't locate any products matching the current criteria. Try expanding your parameters or reset all filters to browse the entire collection.
                </p>
                
                <button
                  onClick={handleClearFilters}
                  className="px-6 h-12 bg-white text-black font-black text-[10px] tracking-[0.2em] relative group cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span className="absolute inset-x-[-2px] top-0 bottom-0 border-x-2 border-neon-blue group-hover:border-neon-red transition-all" />
                  <span>RESET SEARCH CRITERIA</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>

      </div>

      {/* Grid Elements Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.03]">
        <div className="absolute top-[30%] left-[-20%] w-[60%] h-[60%] bg-neon-red blur-[200px] rounded-full" />
        <div className="absolute bottom-[20%] right-[-20%] w-[60%] h-[60%] bg-neon-blue blur-[200px] rounded-full" />
      </div>
    </div>
  );
}
