import { getCollections } from "@/lib/shopify";
import FilterList from "./filter/FilterList";
import { Suspense } from "react";

async function CollectionsList() {
  const collections = await getCollections();
  console.log('Collection start')
  console.log('Collection List:', collections);
  console.log('Collection passed')
  return <FilterList list={collections} title="Collections" />
}

const skeleton = 'mb-3 h-4 w-5/2 bg-gray-300 rounded animate-pulse';
const activeAndTitle = 'bg-neutral-800 dark:bg-neutral-300';
const items = 'bg-neutral-400 dark:bg-neutral-700'

const Collections = () => {
  return (
    <Suspense
      fallback={
        <div className="mb-4">
          <div className={`${skeleton} ${activeAndTitle}`}></div>
        </div>
      }
    >
      <CollectionsList/>
    </Suspense>
  )
}

export default Collections
