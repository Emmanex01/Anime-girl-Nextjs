import { useEffect, useState } from "react";
import { getMenu } from "../shopify";
import { menu } from "../shopify/types";

export function useShopifyMenus() {
  const [shopifyMenus, setShopifyMenus] = useState<menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShopifyMenus = async function () {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log("🔄 Fetching menus from Shopify...");
        const menus = await getMenu("main-menu");

        if (menus.length === 0) {
          console.warn("⚠️ No menus found from Shopify. Check your credentials and store configuration.");
        } else {
          console.log(`✅ Loaded ${menus.length} menus from Shopify`);
        }

        setShopifyMenus(menus)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch Shopify menus';
        console.error("❌ Error fetching Shopify products:", errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    fetchShopifyMenus();
  }, [])

  return {
    shopifyMenus,
    isLoading,
    error
  }
}