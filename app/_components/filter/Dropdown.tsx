'use client'
import { useEffect, useRef, useState } from "react";
import FilterItemComponent from "./FilterItemComponent";
import { ListItem } from "./FilterList";
import { usePathname, useSearchParams } from "next/navigation";
import { div } from "motion/react-client";
import { ChevronDown } from "lucide-react";

export default function FilterItemDropDown ({ list }: { list: ListItem[] }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [active, setActive] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const ref = useRef<HTMLDivElement>(null);

    useEffect( () => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [pathname, searchParams]);

    useEffect( () => {
        const activeItem = list.find((item: ListItem) => {
            if (('path' in item && pathname === item.path) || ('slug' in item && searchParams.get('sort') === item.slug)) {
                setActive(item.title);
            }
        });
    }, [pathname, searchParams, list]);

    return (
        <div className="relative" ref={ref}>
            <div onClick={() => setIsOpen(!isOpen)}>
                {active}
                <ChevronDown className="h-4"/>
            </div>
            { isOpen && (
                <div 
                    onClick={ () => setIsOpen(false)} 
                    className="absolute top-full left-0 w-full bg-white shadow-lg z-10"
                >
                    <ul>
                        {list.map((item: ListItem, index) => (
                            <FilterItemComponent key={index} item={item} />
                        ))}
                    </ul>
                </div>
            )

            }
        </div>
    )
}