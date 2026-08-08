import { getProduct } from "@/lib/shopify"
import Gallery from "./Gallery";
import { Image } from "@/lib/shopify/types";
import { Suspense } from "react";
import ProductDescription from "./product-description";

export default async function ProductPage ({
    params
}:{
    params: {handle: string}
}) {
    const product = await getProduct(params.handle);
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
        <div className="mx-auto max-w-2xl px-4">
            <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:bg-black">
                <div className="h-full w-full basis-full lg:basis-4/6">
                <Suspense 
                    fallback={
                        <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden"/>
                    }
                >
                    <Gallery
                        images={product?.images.slice(0, 5).map((image: Image) => ({
                            src: image.url,
                            altText: image.altText
                        }))} 
                    />
                </Suspense>
                    
                </div>
                <div>
                    <ProductDescription product={product} />
                </div>
            </div>
            {/* <RelatedProducts /> */}
        </div>
    )
}