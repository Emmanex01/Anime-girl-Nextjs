import Link from "next/link";
import { SearchX, Sparkles } from "lucide-react";
import ProductCardComponent from "@/app/_components/ProductCardComponent";
import { defaultSort, sortOption } from "@/lib/constants";
import { getProducts } from "@/lib/shopify";

type SearchProps = {
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

const SearchPage = async ({ searchParams }: SearchProps) => {
  const params = (await searchParams) ?? {};
  const rawSort = typeof params.sort === "string" ? params.sort : undefined;
  const rawQuery = typeof params.q === "string" ? params.q : "";
  const { sortKey, reverse } = sortOption.find((item) => item.slug === rawSort) || defaultSort;

  let products = [];

  try {
    products = await getProducts({ sortKey, reverse, query: rawQuery.trim() || undefined });
  } catch {
    return (
      <section className="w-full">
        <div className="glass rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-red-300">Search unavailable</p>
          <h1 className="mt-3 text-2xl font-semibold text-white">We couldn’t load search results.</h1>
          <p className="mt-2 text-sm text-slate-300">Please try a different keyword or browse the collection catalog.</p>
        </div>
      </section>
    );
  }

  const hasQuery = rawQuery.trim().length > 0;

  return (
    <section className="w-full space-y-6">
      <header className="glass rounded-3xl border p-5 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Product search
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              {hasQuery ? `Results for “${rawQuery.trim()}”` : "Browse all products"}
            </h1>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200">
            <Sparkles className="h-3.5 w-3.5 text-neon-red" />
            {products.length} {products.length === 1 ? "item" : "items"}
          </div>
        </div>

        {hasQuery ? (
          <p className="mt-4 text-sm text-slate-300">
            Showing results for your search across the storefront catalog.
          </p>
        ) : (
          <p className="mt-4 text-sm text-slate-300">
            Explore the latest drops, trending collectibles, and fan-favorite essentials.
          </p>
        )}
      </header>

      {products.length === 0 ? (
        <div className="glass rounded-3xl border border-dashed border-white/10 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-neon-red/25 bg-neon-red/10 text-neon-red">
            <SearchX className="h-7 w-7" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-white">
            {hasQuery ? "No products matched your search" : "No products found"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-300">
            {hasQuery
              ? `Try a broader term or browse through curated collections to discover something new.`
              : "There are no products available in this view right now."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/search" className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
              Browse all products
            </Link>
            <Link href="/" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/8">
              Back home
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="min-w-0">
              <ProductCardComponent product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SearchPage;
