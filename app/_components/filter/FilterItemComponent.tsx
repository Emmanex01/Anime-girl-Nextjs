'use client';

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { SortFilterItem } from "@/lib/constants";
import { createUrl } from "@/lib/utils";
import { ListItem, PathFilterItem as PathFilterItemT } from "./FilterList";

function PathFilterItem({ item }: { item: PathFilterItemT }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = pathname === item.path;
  const newSearchParams = new URLSearchParams(searchParams.toString());
  newSearchParams.delete("q");

  return (
    <li>
      {active ? (
        <span className="flex items-center rounded-xl border border-neon-red/25 bg-neon-red/10 px-3 py-2 text-sm font-medium text-white">
          {item.title}
        </span>
      ) : (
        <Link
          href={createUrl(item.path, newSearchParams)}
          className="flex items-center rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2 text-sm text-slate-300 transition hover:border-white/15 hover:bg-white/5 hover:text-white"
        >
          {item.title}
        </Link>
      )}
    </li>
  );
}

function SortFilterItemComponent({ item }: { item: SortFilterItem }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("sort") === item.slug;
  const q = searchParams.get("q");
  const newSearchParams = new URLSearchParams(searchParams.toString());

  if (q) {
    newSearchParams.set("q", q);
  } else {
    newSearchParams.delete("q");
  }

  if (item.slug) {
    newSearchParams.set("sort", item.slug);
  }

  return (
    <li>
      {active ? (
        <span className="flex items-center rounded-xl border border-neon-red/25 bg-neon-red/10 px-3 py-2 text-sm font-medium text-white">
          {item.title}
        </span>
      ) : (
        <Link
          href={createUrl(pathname, newSearchParams)}
          className="flex items-center rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2 text-sm text-slate-300 transition hover:border-white/15 hover:bg-white/5 hover:text-white"
        >
          {item.title}
        </Link>
      )}
    </li>
  );
}

const FilterItemComponent = ({ item }: { item: ListItem }) => {
  return "path" in item ? <PathFilterItem item={item} /> : <SortFilterItemComponent item={item} />;
};

export default FilterItemComponent;
