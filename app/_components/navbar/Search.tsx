import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import React, { useState } from 'react'
import { SearchDropdown } from '../SearchDropdown';
import { useRouter, useSearchParams } from 'next/navigation';
import { createUrl } from '@/lib/utils';
import { useShopifyProductSearch } from '@/lib/hooks/useShopifyProducts';

const SearchComponent = () => {
 const [showDropdown, setShowDropdown] = useState(false);
 const searchParams = useSearchParams();
 const [query, setQuery] = useState('');
 console.log('searchParams', searchParams?.get('q'))
 const { shopifyProducts, isLoading} = useShopifyProductSearch({query}); // Fetch products based on query
    console.log('shopifyProducts', shopifyProducts);
 const router = useRouter();

 const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const val = e.target as HTMLFormElement;
    // const search = val.search as HTMLInputElement;
    // const newParams = new URLSearchParams(searchParams.toString());
    const newParams = new URLSearchParams(searchParams);

    if (query?.trim()) {
        newParams.set('q', query.trim());
    } else {
        newParams.delete('q')
    }

    router.push(createUrl("/search", newParams));
 }


  return (
    <form 
        className="hidden lg:flex flex-1 max-w-2xl mx-12 relative z-50"
        onSubmit={onSubmit}
    >
        <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input 
                value={query}
                name="search"
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // short delay for click capture
                placeholder="Search anime merch, figures, apparel..." 
                className="pl-12 bg-white/5 border-white/10 focus-visible:ring-neon-red/50 focus-visible:border-neon-red transition-all rounded-sm h-11 text-sm italic"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Search 
                onClick={() => {
                    console.log('Search clicked');
                }}
                className="w-4 h-4 text-white/40 cursor-pointer hover:text-white transition-colors" 
            />
            </div>

            {/* Floating Live Search Dropdown */}
            <AnimatePresence>
            {showDropdown && query?.trim() && (
                <SearchDropdown
                query={query}
                products={shopifyProducts}
                isSearching={isLoading}
                onSelectResult={() => {
                    setShowDropdown(false);
                }}
                onClearQuery={() => console.log('Clear query')} // Implement clear query logic if needed
                />
            )}
            </AnimatePresence>
        </div>
        </form>
  )
}

export default SearchComponent
