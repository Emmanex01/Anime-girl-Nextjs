import { useEffect, useState } from 'react';
import { getProducts } from '../shopify';
import { ShopifyProduct } from '../shopify/types';

/**
 * Hook to fetch products from Shopify and convert them to app format
 * Falls back gracefully if Shopify API is unavailable
 */
export function useShopifyProducts() {
  const [shopifyProducts, setShopifyProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShopifyProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log("🔄 Fetching products from Shopify...");
        const products = await getProducts();
        
        if (products.length === 0) {
          console.warn("⚠️ No products found from Shopify. Check your credentials and store configuration.");
        } else {
          console.log(`✅ Loaded ${products.length} products from Shopify`);
        }
        
        setShopifyProducts(products);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch Shopify products';
        console.error("❌ Error fetching Shopify products:", errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShopifyProducts();
  }, []);

  return {
    shopifyProducts,
    isLoading,
    error,
  };
}
