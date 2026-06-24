import { Tags } from "lucide-react"
import { menu, shopifyMenuOperation, ShopifyProduct, GetProductsResponse, GetProductResponse } from "./types";
import { getMenuQuery } from "./queries/menu";
import { productsQuery, productQuery } from "./queries/products";
import { TAGS } from "../constants";
import { ensureStartWith } from "../utils";
import { isShopifyError } from "../type-guards";


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

/**
 * Fetch all products from Shopify
 * @param query - Optional search query to filter products
 * @returns Array of ShopifyProduct objects
 */
export async function getProducts(query?: string): Promise<ShopifyProduct[]> {
  try {
    const res = await shopifyFetch<GetProductsResponse>({
      query: productsQuery,
      tags: [TAGS.products],
      variables: {
        first: 100,
        ...(query && { query }),
      },
    });

    return (
      res.body?.data?.products?.edges?.map((edge: { node: ShopifyProduct }) => ({
        ...edge.node,
      })) || []
    );
  } catch (error) {
    console.error("❌ Error fetching products from Shopify:", error);
    return [];
  }
}

/**
 * Fetch a single product by handle
 * @param handle - The product handle (slug)
 * @returns ShopifyProduct object or null if not found
 */
export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  try {
    const res = await shopifyFetch<GetProductResponse>({
      query: productQuery,
      tags: [TAGS.products],
      variables: {
        handle,
      },
    });

    return res.body?.data?.productByHandle || null;
  } catch (error) {
    console.error(`❌ Error fetching product ${handle}:`, error);
    return null;
  }
};