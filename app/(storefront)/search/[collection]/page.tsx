import ProductCardComponent from "@/app/_components/ProductCardComponent";
import { defaultSort, sortOption } from "@/lib/constants";
import { getCollectionProducts } from "@/lib/shopify";

export default async function CategoryPage( { 
    params, 
    searchParams 
}: { 
    params: { collection: string }, 
    searchParams?: { [key: string]: string | string[] | undefined } 
}) {
    const { sort } = await searchParams as { [key: string]: string };
    const { collection } = await params as { collection: string };
    const { sortKey, reverse } = sortOption.find(item => item.slug === sort) || defaultSort;
    const products = await getCollectionProducts({ collection, sortKey, reverse });
    console.log('Category products', products);

    return (
        <section>
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                    {products.map((product) => (
                        <div key={product.id}>
                            <ProductCardComponent product={product} />
                        </div>
                    ))}
                </div>
            ) : (
                <p>No products found.</p>
            )}
        </section>
    )
}