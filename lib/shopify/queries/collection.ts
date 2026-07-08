import { collectionFragment } from "../fragment/collection";

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
`