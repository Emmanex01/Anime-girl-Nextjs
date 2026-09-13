'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import FilterItemComponent from "./FilterItemComponent";
import { ListItem } from "./FilterList";

export default function FilterItemDropDown({ list }: { list: ListItem[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const activeTitle = useMemo(() => {
    const activeMatch = list.find((item) => {
      if ("path" in item) return pathname === item.path;
      return searchParams.get("sort") === item.slug;
    });

    return activeMatch?.title ?? "Choose an option";
  }, [list, pathname, searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-white"
      >
        <span className="truncate">{activeTitle}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-white/10 bg-[#0b0d14] shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
          <ul className="max-h-72 overflow-y-auto p-2">
            {list.map((item, index) => (
              <li key={`${item.title}-${index}`} className="py-1" onClick={() => setIsOpen(false)}>
                <FilterItemComponent item={item} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}