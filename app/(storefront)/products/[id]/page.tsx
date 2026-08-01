// app/(storefront)/products/[id]/page.tsx

import React from 'react';
import { ProductDetailsContent } from '@/app/_components/ProductDetails';
import { getMenu, getProducts } from '@/lib/shopify';
import { transformShopifyProduct, transformLegacyToProduct } from '@/utils/productAdapter'; // Adjust import paths as needed
import { initialProductsData } from '@/app/data';
 // Adjust path to your mock data file


 /**
 * Adapts a flat Product back into a nested ShopifyProduct if required by third-party APIs.
 */

interface PageProps {
  params: Promise<{ id: string }>;
}

const ProductPage = async ({ params }: PageProps) => {
  // 1. Fetch menu dependency
  const menu = await getMenu("main-menu");
  if (!menu) {
    console.error("Menu not found");
    throw new Error("Menu not found");
  }

  // 2. Resolve parameters (Next.js 15+ Async params)
  const { id } = await params;

  // 3. Fetch products matching query asynchronously (Fix: Added await)
  const product = await getProducts({ query: id });

  // Defensive Fallback: If Shopify has no matching product (e.g., when testing local mock IDs '1'-'5')
    // const fallbackMock = initialProductsData.find((p) => p.id === id);
    // if (fallbackMock) {
    //   product = transformLegacyToProduct(fallbackMock);
    // }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#060810] text-white">
        <div className="text-center space-y-4">
          <p className="text-sm font-mono tracking-widest text-[#ff003c]">SYS_ERROR: 404_NOT_FOUND</p>
          <h2 className="text-xl font-bold uppercase italic">Merchandise record not found in system</h2>
        </div>
      </div>
    );
  }

  return (
    <div>  
      <ProductDetailsContent key={id} product={product[0]} /> 
    </div>
  );
};

export default ProductPage;