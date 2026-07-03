export const TAGS = {
  collections: "collections",
  products: "products",
  carts: "carts",
};

export const SHOPIFY_GRAPHQL_API_ENDPOINT = "/api/2026-04/graphql.json";

type SortFilterItem = {
  title: string,
  slug: string,
  sortKey: 'BEST_SELLING' | 'CREATED_AT' | 'PRICE' | 'RELEVANCE',
  reverse: boolean
}

export const defaultSort: SortFilterItem = {
  title: 'Tranding',
  slug: 'trending-desc',
  sortKey: 'BEST_SELLING',
  reverse: false
}

export const sortOption: SortFilterItem[] = [
  defaultSort,
  {
    title: 'Tranding',
    slug: 'trending-desc',
    sortKey: 'BEST_SELLING',
    reverse: false
  },
  {
    title: 'Latest arrivals',
    slug: 'latest-desc',
    sortKey: 'CREATED_AT',
    reverse: true
  },
  {
    title: 'Price: Low to high',
    slug: 'price-asc',
    sortKey: 'PRICE',
    reverse: false
  },
  {
    title: 'Price: High to low',
    slug: 'price-desc',
    sortKey: 'PRICE',
    reverse: true
  }
]

export const HIDDEN_PRODUCT_TAG = "nextjs-frontend-hidden";