import {  Product } from '@/app/types';
import { Image, ProductVariant, ShopifyProduct } from '@/lib/shopify/types';

/**
 * Utility helper to extract flat arrays from Shopify Connection lists (edges/nodes)
 */
const flattenConnection = <T>(connection: { edges: Array<{ node: T }> } | undefined): T[] => {
  return connection?.edges?.map((edge) => edge.node) || [];
};

/**
 * Converts a raw Shopify API Product response into the unified app Product model.
 */
export function transformShopifyProduct(shopifyProduct: ShopifyProduct): Product {
  const variants = flattenConnection<ProductVariant>(shopifyProduct.variants);
  const images = flattenConnection<Image>(shopifyProduct.images);
  
  const parsedPrice = parseFloat(shopifyProduct.priceRange?.minVariantPrice?.amount || '0');
  const featuredImageUrl = shopifyProduct.featuredImage?.url || (images[0]?.url || '');
  const primaryCategory = shopifyProduct.tags?.[0] || 'Uncategorized';

  // Determine tag-based UI labels
  let label: Product['label'] = undefined;
  if (shopifyProduct.tags.includes('NEW')) label = 'NEW';
  else if (shopifyProduct.tags.includes('TRENDING')) label = 'TRENDING';
  else if (shopifyProduct.tags.includes('LIMITED')) label = 'LIMITED';
  else if (shopifyProduct.tags.includes('SALE')) label = 'SALE';

  return {
    ...shopifyProduct,
    variants,
    images,

    // Mapped backward-compatibility layers
    name: shopifyProduct.title,
    image: featuredImageUrl,
    price: parsedPrice,
    category: primaryCategory,

    // Metadata defaults (can be powered by Shopify Metafields later)
    rating: 4.8,
    reviewCount: 15,
    label,
    originalPrice: parsedPrice,
    animeSeries: primaryCategory,
    hide: false,
    soldOut: !shopifyProduct.availableForSale,
    enabled: true,

    // Admin Warehouse parameters
    sourceStore: 'Shopify Store',
    sourceUrl: `https://your-shopify-store.myshopify.com/products/${shopifyProduct.handle}`,
    purchasePriceJpy: Math.round(parsedPrice * 0.17),
    productWeight: 450,
    isPreorder: label === 'LIMITED',
    preorderLimit: label === 'LIMITED' ? 10 : undefined,
    preorderCount: label === 'LIMITED' ? 4 : undefined,
  };
}

/**
 * Maps legacy dummy product entries to the new unified schema so local mock items continue functioning.
 */
export function transformLegacyToProduct(p: any): Product {
  const priceStr = String(p.price);
  return {
    id: p.id,
    handle: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    availableForSale: !p.soldOut,
    title: p.name,
    description: p.description || `High-fidelity anime themed ${p.name}.`,
    descriptionHtml: `<p>${p.description || ''}</p>`,
    options: [],
    priceRange: {
      minVariantPrice: { amount: priceStr, currencyCode: 'USD' },
      maxVariantPrice: { amount: priceStr, currencyCode: 'USD' },
    },
    variants: [],
    images: [{ url: p.image, altText: p.name }],
    featuredImage: { url: p.image, altText: p.name },
    seo: { title: p.name, description: p.description || '' },
    tags: p.tags || [],
    updatedAt: new Date().toISOString(),

    // Legacy fallback mapping
    name: p.name,
    image: p.image,
    price: p.price,
    category: p.category,
    rating: p.rating || 4.5,
    reviewCount: p.reviewCount || 10,
    label: p.label,
    originalPrice: p.originalPrice,
    animeSeries: p.category,
    enabled: p.enabled ?? true,
    hide: p.hide ?? false,
    soldOut: p.soldOut ?? false,
    sourceStore: p.sourceStore || 'AmiAmi Akihabara',
    sourceUrl: p.sourceUrl || 'https://www.amiami.com/eng/detail/?gcode=FIGURE-' + p.id,
    purchasePriceJpy: p.purchasePriceJpy || Math.floor(p.price * 0.17),
    productWeight: p.productWeight || 450,
    isPreorder: p.isPreorder ?? (p.label === 'LIMITED'),
    preorderLimit: p.preorderLimit ?? (p.label === 'LIMITED' ? 10 : undefined),
    preorderCount: p.preorderCount ?? (p.label === 'LIMITED' ? 4 : undefined),
  };
}

export function reconstructShopifyProduct(product: Product): ShopifyProduct {
  return {
    ...product,
    variants: {
      edges: product.variants.map(node => ({ node }))
    },
    images: {
      edges: product.images.map(node => ({ node }))
    }
  } as unknown as ShopifyProduct;
}