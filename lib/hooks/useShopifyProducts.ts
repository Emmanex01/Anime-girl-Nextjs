import { useEffect, useState } from 'react';
import { Product } from '@/app/types';

/**
 * Hook to fetch products from Shopify and convert them to app format
 * Falls back gracefully if Shopify API is unavailable
 */

const useDebounce = <T>(query: T , delay: number) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);
    return () => clearTimeout(timer);
  }, [query, delay]);

  return debouncedQuery;
}

export function useShopifyProductSearch({query}: { query?: string }) {
  const [shopifyProducts, setShopifyProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 300); // Debounce the query to avoid excessive API calls

  useEffect(() => {
    if (!debouncedQuery) {
      setShopifyProducts([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchShopifyProducts() {
      setIsLoading(true);
      setError(null);

    try {

        const response = await fetch(
            `/api/products/search?query=${debouncedQuery}`,
        );

        if (!response.ok) {
            throw new Error("Search failed");
        }

        const products: Product[] = await response.json();

        setShopifyProducts(products);

        console.log("Products:", products);

        if (products.length === 0) {
          console.log(`No products found for "${debouncedQuery}"`);
        }

        if (!cancelled) {
            setShopifyProducts(products);
        }

    } catch {

        if (!cancelled)
            setError("Failed to fetch Shopify products");

    } finally {

        if (!cancelled)
            setIsLoading(false);
    }
  }

    fetchShopifyProducts();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  return { shopifyProducts, isLoading, error };

}

type ShopifySortKey =
  | "BEST_SELLING"
  | "CREATED"
  | "PRICE"
  | "RELEVANCE";

export function useShopifyProducts({
  search,
  collection = "all",
  sortKey,
  reverse,
}:{
    search: string,
    collection: string
    sortKey: ShopifySortKey,
    reverse: boolean
  }) {
    const [shopifyProducts, setShopifyProducts] = useState<Product[]>([]);
    const [productLoading, setProductLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setProductLoading(true);
      setError(null);


      const params = new URLSearchParams({
        collection,
        search,
        sortKey,
        reverse: String(reverse),
      });

      try {
        let result: Product[];

        if (collection === "all") {
          const response = await fetch(
            `/api/products/search?query=${''}`,
        );

        result = await response.json();
        } else {
          const response = await fetch(
              `/api/products?${params}`
          );

          result = await response.json();
        }

        if (!cancelled) {
          setShopifyProducts(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Failed to fetch products");
        }
      } finally {
        if (!cancelled) {
          setProductLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [search, collection, sortKey, reverse]);

  return ({
    shopifyProducts,
    productLoading,
    error
  })
}
