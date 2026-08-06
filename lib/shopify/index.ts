import { menu, shopifyMenuOperation, ShopifyProduct, ShopifyProductOperation, Connection, Image, ShopifyCollectionOperation, Collection, ShopifyCollection, ShopifyCollectionProductsOperation, ShopifyAddToCartOperation, Cart, ShopifyCart, ShopifyProductsOperation, ShopifyProductRecommendationsOperation, ShopifyCartOperation, ShopifyCreateCartOperation, ShopifyRemoveFromCartOperation, ShopifyUpdateCartOperation } from "./types";
import { getMenuQuery } from "./queries/menu";
import { getProductRecommendationsQuery, productQuery, productsQuery } from "./queries/products";
import { HIDDEN_PRODUCT_TAG, TAGS } from "../constants";
import { ensureStartWith } from "../utils";
import { isShopifyError } from "../type-guards";
import { getCollectionProductsQuery, getCollectionsQuery } from "./queries/collection";
import { transformShopifyProduct } from "@/utils/productAdapter";
import { Product } from "@/app/types";
import { addToCartMutation, createCartMutation, editCartItemsMutation, removeFromCartMutation } from "./mutations/cart";
import { getCartQuery } from "./queries/cart";


const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartWith(process.env.SHOPIFY_STORE_DOMAIN, "https://")
  : "";
const endpoint = `${domain}/api/2024-01/graphql.json`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
type ExtractVariables<T> = T extends { variables: object }
  ? T['variables']
  : Record<string, unknown>;

  console.log("SHOPIFY_STORE_DOMAIN", process.env.SHOPIFY_STORE_DOMAIN);
  console.log('domain', domain);

export async function shopifyFetch<T>({
    cache = "force-cache",
    header,
    query,
    variables,
    tags,
}: {
    cache?: RequestCache
    header?: HeadersInit
    query: string
    variables?: ExtractVariables<T>
    tags?: string[]
}): Promise<{ status: number; body: T } | never > {
  // Implementation for shopifyFetch
  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": key,
        ...header,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
      cache,
      ...(tags && { next: { tags } }),
    });

    const body = await result.json()

    if (body.errors) {
      throw body.errors[0] || new Error("Unknown error occurred while fetching data from Shopify")
    }

    return { 
      status: result.status, 
      body 
    }

  } catch (error) {

    // checks for shopify error 
    if(isShopifyError(error)) {
      throw {
        cause: error.cause?.toString() || "Unknown error occurred while fetching data from Shopify",
        status: error.status || 500,
        message: error.message || "An error occurred while fetching data from Shopify",
        query,
      }
  }

    // For any other errors, we can throw a generic error
    throw {
      error,
      query,
    }
  }
}

export async function getMenu(handle: string): Promise<menu[]> {
  const res = await shopifyFetch<shopifyMenuOperation>({
    query: getMenuQuery,
    tags: [TAGS.collections],
    variables: {
        handle,
    },
  })
  return (
    res.body?.data?.menu?.items.map((item: { title: string; url: string }) => ({
      title: item.title,
      path: item.url
        .replace(domain, "")
        .replace("/collections", "/search")
        .replace("/pages", ""),
    })) || []
  )
}

// function removeEdgesAndNodes<T>(array: Connection<T>): T[] {
//   return array.edges.map((edge) => edge?.node);
// }

function removeEdgesAndNodes<T>(array?: Connection<T> | null): T[] {
  console.log("removeEdgesAndNodes:", JSON.stringify(array, null, 2));

  if (!array?.edges) {
    throw new Error("Connection has no edges");
  }

  return array.edges.map((edge) => edge.node);
}

function reshapeImages(images: Connection<Image>, productTitle: string) {
  const flattened = removeEdgesAndNodes(images);
  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)?.[1];

    return {
      ...image,
      altText: image.altText || `${productTitle} ${filename},`
    }
  });
}

function reshapeProduct(product: ShopifyProduct, filterHiddenProducts: boolean = true) {
  if ( !product || (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))) {
    return null;
  }
  const { images, variants, ...rest } = product;
  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants),
  };
}
function reshapeProducts(products: ShopifyProduct[]) { 
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = transformShopifyProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }
  return reshapedProducts;
}

/**
 * Fetch all products from Shopify
 * @param query - Optional search query to filter products
 * @returns Array of ShopifyProduct objects
 */
export async function getProducts({ 
  sortKey, 
  reverse, 
  query 
}: { 
  sortKey?: string; 
  reverse?: boolean; 
  query?: string 
}): Promise<Product[]> {
    console.log({
    query,
    sortKey,
    reverse,
  });
    const res = await shopifyFetch<ShopifyProductsOperation>({
      query: productsQuery,
      tags: [TAGS.products],
      variables: {
        query,
        reverse,
        sortKey,
      },
    });

    return reshapeProducts(removeEdgesAndNodes(res.body.data.products))
}

const reshapeCollection = (collection: ShopifyCollection): Collection | undefined => {
  if (!collection) {
    return undefined;
  }
  return {
    ...collection,
    path: `/search/${collection.handle}`
  };
}

const reshapeCollections = (collections: ShopifyCollection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);
      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }
  return reshapedCollections;
}

export async function getCollections(): Promise<Collection[]> {
  const res = await shopifyFetch<ShopifyCollectionOperation>({
    query: getCollectionsQuery,
    tags: [TAGS.collections],
  });

  const shopifyCollections = removeEdgesAndNodes(res?.body?.data?.collections);
  const collections = [
    {
      handle: "all",
      title: "All Products",
      description: "All products in the store",
      seo: {
        title: "All",
        description: "All products",
      },
      path: "/search",
      updatedAt: new Date().toISOString(),
      },
      // filter out any collections that have the HIDDEN_PRODUCT_TAG in their tags
      ...reshapeCollections(shopifyCollections).filter((collection) => !collection.handle?.startsWith('hidden')),
  ]
  return collections;
}

export async function getCollectionProducts({ collection, sortKey, reverse }: { collection: string; sortKey?: string; reverse?: boolean }): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    tags: [TAGS.products, TAGS.collections],
    variables: {
      handle: collection,
      reverse,
      sortKey: sortKey === 'CREATED AT' ? 'CREATED' : sortKey,
    },
  });

  if (!res.body.data.collection) {
    console.log(`No collection found for \`${collection}\``)
    return [];
  }
  return reshapeProducts(removeEdgesAndNodes(res.body.data.collection.products));
}

function reshapeCart(cart: ShopifyCart): Cart {
  if(!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: "0.0",
      currencyCode: "USD"
    }
  };

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines)
  };
}

export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation,
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartCreate.cart);
}

export async function addToCart ( 
  cartId: string, 
  lines: { merchandiseId: string; quantity: number}[]
) : Promise<Cart> {
  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines
    },
    cache: 'no-cache'
  });

  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const res = await shopifyFetch<ShopifyProductOperation>({
    query: productQuery,
    tags: [TAGS.products],
    variables: {
      handle,
    }
  });

  return transformShopifyProduct(res.body.data.products);
}


export async function getProductRecommendations(productId: string): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    tags: [TAGS.products],
    variables: {
      productId
    }
  });

  return reshapeProducts(res.body.data.productRecommendations);
}

export async function removeFromcart(cartId: string, lineIds: string[]): Promise<Cart> {
  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds
    },
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
  cartId: string, 
  lines: {id: string; merchandiseId: string; quantity: number}[]
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines,
    },
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}


export async function getCart(cartId: string | undefined): Promise<Cart | undefined> {
  if (!cartId) {
    return undefined
  }

  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId },
    tags: [TAGS.carts],
    cache: 'no-store'
  })

  // old carts becomes 'null' when you checkout
  if(!res.body.data.cart) return undefined;

  return reshapeCart(res.body.data.cart);
}