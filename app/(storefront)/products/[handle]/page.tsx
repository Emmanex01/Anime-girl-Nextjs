import Gallery from "@/app/_components/product/Gallery";
import { ProductProvider } from "@/app/_components/product/product-context";
import ProductDescription from "@/app/_components/product/product-description";
import ProductPage from "@/app/_components/product/product-page";
import { getProduct, getProducts } from "@/lib/shopify"
import { Image } from "@/lib/shopify/types";
import { Suspense } from "react";


export default async function ProductPageContainer ({
    params
}:{
    params: Promise<{handle: string}>
}) {
    const {handle} = await params;
    console.log("handle", handle);
    // const product = await getProduct(handle);
    const product = await getProduct(handle);
    if (!product) {
        return (
            <div className="mx-auto max-w-2xl px-4">
                <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:bg-black">
                    <h1 className="text-3xl font-bold">Product not found</h1>
                </div>
            </div>
        )
    }
    return (
        <ProductProvider>
            <ProductPage product={product} />
        </ProductProvider>
    )
}