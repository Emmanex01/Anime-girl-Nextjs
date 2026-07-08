'use client'
import Link from 'next/link';
import { ListItem, PathFilterItem as PathFilterItemT } from './FilterList'
import { createUrl } from '@/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';
import { SortFilterItem } from '@/lib/constants';

function PathFilterItem({ item }: { item: PathFilterItemT }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const active = pathname === item.path;
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const DynamicTag = active ? 'p' : Link;

    newSearchParams.delete('q');

    return (
        <li>
            <DynamicTag
                href={createUrl(item.path, newSearchParams)}
                className={`block px-4 py-2 text-sm ${active ? 'font-bold' : ''}`}
            >
                {item.title}
            </DynamicTag>
        </li>
    )
}

function SortFilterItemComponent({ item }: { item: SortFilterItem }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const active = searchParams.get('sort') === item.slug;
    const q = searchParams.get('q') || '';

    const href = createUrl(
        pathname, 
        new URLSearchParams({ 
            sort: item.slug, 
            q })
    );
    }

const FilterItemComponent = ({item}: { item: ListItem}) => {
  return 'path' in item ? (
        <PathFilterItem item={item} /> 
    ) : ( 
        <SortFilterItemComponent item={item} /> 
    );
}

export default FilterItemComponent
