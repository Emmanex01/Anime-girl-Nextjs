import { SearchX, Sparkles } from "lucide-react";
import ProductCardComponent from "@/app/_components/ProductCardComponent";
import { defaultSort, sortOption } from "@/lib/constants";
import { getCollectionProducts } from "@/lib/shopify";

type SearchPageProps = {
  params: Promise<{
    collection: string;
  }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export default async function SearchPage({
  params,
  searchParams,
}: SearchPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const rawSort = typeof resolvedSearchParams?.sort === "string" ? resolvedSearchParams.sort : undefined;
  const { collection } = resolvedParams;
  const { sortKey, reverse } = sortOption.find((item) => item.slug === rawSort) || defaultSort;

  let products: Awaited<ReturnType<typeof getCollectionProducts>> = [];

  try {
    products = await getCollectionProducts({ collection, sortKey, reverse });
  } catch {
    products = [];
  }

  const collectionLabel = collection
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

  return (
    <section className="w-full space-y-6">
      <header className="glass rounded-3xl border p-5 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Collection
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              {collectionLabel}
            </h1>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200">
            <Sparkles className="h-3.5 w-3.5 text-neon-blue" />
            {products.length} {products.length === 1 ? "item" : "items"}
          </div>
        </div>
      </header>

      {products.length === 0 ? (
        <div className="glass rounded-3xl border border-dashed border-white/10 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-neon-red/25 bg-neon-red/10 text-neon-red">
            <SearchX className="h-7 w-7" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-white">No items in this collection</h2>
          <p className="mt-2 text-sm text-slate-300">The collection is empty right now, or the catalog is temporarily unavailable.</p>
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
}