import Collections from "@/app/_components/Collections";
import FilterList from "@/app/_components/filter/FilterList";
import { ProductProvider } from "@/app/_components/product/product-context";
import { sortOption } from "@/lib/constants";

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProductProvider>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)_220px]">
            <aside className="xl:pt-2">
            <div className="glass rounded-3xl border p-4 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
                <Collections />
            </div>
            </aside>

            <main className="min-w-0">{children}</main>

            <aside className="xl:pt-2">
            <div className="glass rounded-3xl border p-4 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
                <FilterList list={sortOption} title="Sort by" />
            </div>
            </aside>
        </div>
        </div>
    </ProductProvider>
  );
}