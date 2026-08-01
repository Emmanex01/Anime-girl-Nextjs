import imageFragment from "../fragment/image";
import productFragment from "../fragment/product";
import seoFragment from "../fragment/seo";


// GraphQL query to fetch products from Shopify Storefront API
export const productsQuery = `
  query GetProducts($sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
    products(sortKey: $sortKey, reverse: $reverse, query: $query, first: 100) {
      edges {
        node {
          ...product
        }
      }
    }
  }
    ${productFragment}
`;

// Query to fetch a single product by handle
export const productQuery = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      ...product
    }
  }
  ${productFragment}
`;

export const getProductRecommendationsQuery = /* GraphQL */ `
  query getProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...product
    }
  }
  ${productFragment}
`;
