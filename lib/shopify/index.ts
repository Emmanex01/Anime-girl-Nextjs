import { menu, shopifyMenuOperation, ShopifyProduct, Product, ShopifyProductOperation, Connection, Image, ShopifyCollectionOperation, Collection, ShopifyCollection } from "./types";
import { getMenuQuery } from "./queries/menu";
import { productsQuery } from "./queries/products";
import { HIDDEN_PRODUCT_TAG, TAGS } from "../constants";
import { ensureStartWith } from "../utils";
import { isShopifyError } from "../type-guards";
import { getCollectionsQuery } from "./queries/collection";


const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartWith(process.env.SHOPIFY_STORE_DOMAIN, "https://")
  : "";
const endpoint = `${domain}/api/2024-01/graphql.json`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
type ExtractVariables<T> = T extends { variables: object }
  ? T['variables']
  : Record<string, unknown>;


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
      const reshapedProduct = reshapeProduct(product);

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
    const res = await shopifyFetch<ShopifyProductOperation>({
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
    path: `/collections/${collection.handle}`
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
      handle: " ",
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
