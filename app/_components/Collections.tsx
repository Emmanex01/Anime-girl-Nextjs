import { getCollections } from "@/lib/shopify";
import FilterList from "./FilterList";

async function CollectionsList() {
  const collections = await getCollections();
  return <FilterList list={collections} title="Collections" />
}

const skeleton = 'mb-3 h-4 w-5/2 bg-gray-300 rounded animate-pulse';
const activeAndTitle = 'bg-neutral-800 dark:bg-neutral-300';
const items = 'bg-neutral-400 dark:bg-neutral-700'

const Collections = () => {
  return <CollectionsList />
}

export default Collections
