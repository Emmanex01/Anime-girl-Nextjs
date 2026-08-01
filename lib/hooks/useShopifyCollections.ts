import { useEffect, useState } from "react";
import { Collection } from "../shopify/types";

export function useCollectionProducts() {
    const [shopifyCollections, setShopifyCollections] = useState<Collection[]>([]);
    const [collectionLoading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        async function fetchProductCollections () {

            try {
                const response = await fetch('/api/collections');

                if (!response.ok) {
                    throw new Error('Failed to get Collections')
                }

                const collections: Collection[] = await response.json()

                if (collections.length === 0) {
                    console.log('No collections found')
                }

                setShopifyCollections(collections);

            } catch (error) {
                console.error('Collections on production search: ', error);
            } finally {
                setLoading(false)
            }
        }

        fetchProductCollections();
       
    }, [])

    return (
        {
            shopifyCollections,
            collectionLoading
        }
    )
}