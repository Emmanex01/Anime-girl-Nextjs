import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import React, { useState } from 'react'
import { SearchDropdown } from '../SearchDropdown';
import { useRouter, useSearchParams } from 'next/navigation';
import { createUrl } from '@/lib/utils';

const SearchComponent = () => {
 const [showDropdown, setShowDropdown] = useState(false);
 const searchParams = useSearchParams();
 console.log('searchParams', searchParams?.get('q'))

 const router = useRouter();

 const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const val = e.target as HTMLFormElement;
    const search = val.search as HTMLInputElement;
    const newParams = new URLSearchParams(searchParams.toString());

    if (search.value) {
        newParams.set('q', search.value)
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
                value={searchParams?.get('q') || ''}
                key={searchParams?.get('q') || ''}
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
            {showDropdown && searchParams?.get('q')?.trim() && (
                <SearchDropdown
                query={searchParams?.get('q') || ''}
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
