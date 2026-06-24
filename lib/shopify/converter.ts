import { ShopifyProduct } from '../shopify/types';
import { Product } from '../../src/types';

/**
 * Convert a Shopify product to your app's Product format
 * Maps Shopify data to match your internal Product interface
 */
export function convertShopifyToAppProduct(shopifyProduct: ShopifyProduct): Product {
  const price = parseInt(shopifyProduct.priceRange.minVariantPrice.amount) || 45000;
  const rating = shopifyProduct.rating ? parseFloat(shopifyProduct.rating) : 4.7;
  const reviewCount = shopifyProduct.reviewCount ? parseInt(shopifyProduct.reviewCount) : Math.floor(Math.random() * 200);
  const image = shopifyProduct.images[0]?.url || '';

  return {
    id: shopifyProduct.id.split('/').pop() || shopifyProduct.handle,
    name: shopifyProduct.title,
    category: shopifyProduct.productType || shopifyProduct.vendor || 'General',
    price: Math.round(price * 100), // Convert to cents for currency
    rating: Math.min(5, Math.max(0, rating)),
    reviewCount: reviewCount,
    image: image,
    label: 'NEW',
    tags: [
      shopifyProduct.productType?.toLowerCase() || '',
      shopifyProduct.vendor?.toLowerCase() || '',
      shopifyProduct.handle.toLowerCase(),
    ].filter(Boolean),
    description: shopifyProduct.description || `High-quality ${shopifyProduct.title}`,
    enabled: true,
    hide: false,
    soldOut: !shopifyProduct.variants.some(v => v.availableForSale),
    sourceStore: 'Shopify',
    sourceUrl: `${process.env.VITE_SHOPIFY_STORE_DOMAIN}/products/${shopifyProduct.handle}`,
  };
}

/**
 * Convert multiple Shopify products to your app's format
 */
export function convertShopifyProducts(shopifyProducts: ShopifyProduct[]): Product[] {
  return shopifyProducts.map(convertShopifyToAppProduct);
}
