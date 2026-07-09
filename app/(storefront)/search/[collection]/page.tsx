import { defaultSort, sortOption } from "@/lib/constants";
import { getCollectionProducts } from "@/lib/shopify";

export default async function CategoryPage( { 
    params, 
    searchParams 
}: { 
    params: { collection: string }, 
    searchParams?: { [key: string]: string | string[] | undefined } 
}) {
    const { sort } = searchParams as { [key: string]: string };
    const { sortKey, reverse } = sortOption.find(item => item.slug === sort) || defaultSort;
    const products = await getCollectionProducts({ collection: params.collection, sortKey, reverse });

    return (
        <section>
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product) => (
                        <div key={product.id}>
                            <h3>{product.title}</h3>
                            <p>{product.priceRange.maxVariantPrice.currencyCode}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No products found.</p>
            )}
        </section>
    )
}