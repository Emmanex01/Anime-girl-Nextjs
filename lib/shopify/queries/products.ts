import productFragment from "../fragment/product";


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
// export const productQuery = `
//   query GetProduct($handle: String!) {
//     productByHandle(handle: $handle) {
//       id
//       title
//       handle
//       description
//       vendor
//       productType
//       rating: metafield(namespace: "custom" key: "rating") {
//         value
//       }
//       reviewCount: metafield(namespace: "custom" key: "review_count") {
//         value
//       }
//       priceRange {
//         minVariantPrice {
//           amount
//           currencyCode
//         }
//         maxVariantPrice {
//           amount
//           currencyCode
//         }
//       }
//       images(first: 10) {
//         edges {
//           node {
//             url
//             altText
//           }
//         }
//       }
//       variants(first: 20) {
//         edges {
//           node {
//             id
//             title
//             availableForSale
//             price {
//               amount
//               currencyCode
//             }
//             selectedOptions {
//               name
//               value
//             }
//           }
//         }
//       }
//     }
//   }
//     ${imageFragment}
//     ${seoFragment}
// `;
