import { Product } from "@/app/types";
import Price from "../Price";
import { AddToCart } from "../cart/add-to-cart";
import VariantSelector from "./variant-selector";
import Prose from "./Prose";

export default function ProductDescription({ product}: {product: Product}) {
    return (
        <>
            <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
                <h1>{product.title}</h1>
                <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
                    <Price
                        amount={product.priceRange.maxVariantPrice.amount}
                        currencyCode={product.priceRange.maxVariantPrice.currencyCode}
                    />
                </div>
            </div>
            <VariantSelector options={product.options} variants={product.variants}/>
            {product.descriptionHtml ? (
                <Prose 
                    className="mb-6 text-sm leading-loose dark:text-white/60"
                    html={product.descriptionHtml}
                />
            ) : null}
            <AddToCart product={product}/>
        </>
    )
}