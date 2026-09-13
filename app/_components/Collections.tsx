import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { getCollections } from "@/lib/shopify";
import FilterList from "./filter/FilterList";

async function CollectionsList() {
  try {
    const collections = await getCollections();
    return <FilterList list={collections} title="Collections" />;
  } catch {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-200">
        Failed to load collections.
      </div>
    );
  }
}

const Collections = () => {
  return (
    <Suspense
      fallback={
        <div className="space-y-3">
          <div className="mb-3 h-4 w-20 rounded-full bg-white/10" />
          <div className="h-10 rounded-xl bg-white/5" />
          <div className="h-10 rounded-xl bg-white/5" />
          <div className="h-10 rounded-xl bg-white/5" />
        </div>
      }
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Browse</p>
          <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
        </div>
        <CollectionsList />
      </div>
    </Suspense>
  );
};

export default Collections;
