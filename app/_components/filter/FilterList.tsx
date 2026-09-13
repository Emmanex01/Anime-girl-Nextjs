'use client';

import { SortFilterItem } from "@/lib/constants";
import FilterItemComponent from "./FilterItemComponent";
import FilterItemDropDown from "./Dropdown";

export type PathFilterItem = { title: string; path: string };
export type ListItem = SortFilterItem | PathFilterItem;

function FilterItemList({ list }: { list: ListItem[] }) {
  return (
    <ul className="space-y-2">
      {list.map((item, index) => (
        <FilterItemComponent key={`${item.title}-${index}`} item={item} />
      ))}
    </ul>
  );
}

const FilterList = ({ list, title }: { list: ListItem[]; title?: string }) => {
  return (
    <div>
      {title ? (
        <nav aria-label={title} className="mb-3">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">{title}</h3>
        </nav>
      ) : null}

      <div className="hidden md:block">
        <FilterItemList list={list} />
      </div>

      <div className="md:hidden">
        <FilterItemDropDown list={list} />
      </div>
    </div>
  );
};

export default FilterList;
