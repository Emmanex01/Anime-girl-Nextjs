import { collectionFragment } from "../fragment/collection";
import productFragment from "../fragment/product";

export const getCollectionsQuery = /* GraphQL */ `
    query getCollections {
        collections(first: 100, sortKey: TITLE) {
            edges {
                node {
                    ...collection
                }
            }
        }
    }
    ${collectionFragment}
`;

export const getCollectionProductsQuery = /* GraphQL */ `
    query getCollectionProucts(
        $handle: String
        $sortKey: ProductCollectionSortKeys
        $reverse: Boolean
    ) {
        collection(handle: $handle) {
            products(sortKey: $sortKey, reverse: $reverse, first: 100) {
                edges{
                    node {
                        ...product
                    }
                }
            }
        }
    }
        ${productFragment}
`;