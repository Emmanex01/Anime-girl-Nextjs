export const TAGS = {
  collections: "collections",
  products: "products",
  carts: "carts",
};

export const SHOPIFY_GRAPHQL_API_ENDPOINT = "/api/2026-04/graphql.json";

export type SortFilterItem = {
  title: string,
  slug: string,
  sortKey: 'BEST_SELLING' | 'CREATED' | 'PRICE' | 'RELEVANCE',
  reverse: boolean
}

export const defaultSort: SortFilterItem = {
  title: 'Trending',
  slug: 'trending-desc',
  sortKey: 'BEST_SELLING',
  reverse: false
}

export const sortOption: SortFilterItem[] = [
  defaultSort,
  {
    title: 'MOST POPULAR • 人気順',
    slug: 'popularity',
    sortKey: 'BEST_SELLING',
    reverse: false
  },
  {
    title: 'Latest arrivals',
    slug: 'latest-desc',
    sortKey: 'CREATED',
    reverse: true
  },
  {
    title: 'PRICE: LOW TO HIGH • 価格の安い順',
    slug: 'price-asc',
    sortKey: 'PRICE',
    reverse: false
  },
  {
    title: 'PRICE: HIGH TO LOW • 価格の高い順',
    slug: 'price-desc',
    sortKey: 'PRICE',
    reverse: true
  }
]

export const HIDDEN_PRODUCT_TAG = "nextjs-frontend-hidden";