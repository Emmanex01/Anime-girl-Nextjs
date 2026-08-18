import { Product } from "@/app/types";
import Price from "../Price";
import { AddToCart } from "../cart/add-to-cart";
import VariantSelector from "./variant-selector";
import Prose from "./Prose";

export default function ProductDescription({
  product,
}: {
  product: Product;
}) {
  return (
    <div className="space-y-8">
      {/* Product heading */}
      <div className="space-y-4 border-b border-neutral-200 pb-6 dark:border-neutral-800">
        {/* Category / badge */}
        {product.category && (
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400">
              {product.category}
            </span>

            {product.availableForSale && (
              <span className="text-[10px] font-medium uppercase tracking-wider text-green-600">
                In stock
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white md:text-4xl">
          {product.title}
        </h1>

        {/* Price */}
        <div className="flex items-center justify-between gap-4">
          <div className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            <Price
              amount={product.priceRange.maxVariantPrice.amount}
              currencyCode={product.priceRange.maxVariantPrice.currencyCode}
            />
          </div>

          <span className="text-xs text-neutral-500">
            Tax included where applicable
          </span>
        </div>
      </div>

      {/* Short product intro */}
      {product.descriptionHtml && (
        <div className="border-b border-neutral-200 pb-6 dark:border-neutral-800">
          <Prose
            className="text-sm leading-7 text-neutral-600 dark:text-neutral-400"
            html={product.descriptionHtml}
          />
        </div>
      )}

      {/* Variants */}
      {product.options?.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
              Select options
            </h2>

            <span className="text-xs text-neutral-400">
              Choose your variant
            </span>
          </div>

          <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
            <VariantSelector
              options={product.options}
              variants={product.variants}
            />
          </div>
        </div>
      )}

      {/* Add to cart */}
      <div className="border-t border-neutral-200 pt-6 dark:border-neutral-800">
        <AddToCart product={product} />
      </div>

      {/* Trust / shipping information */}
      <div className="grid grid-cols-1 gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-800 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
        <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-900/60">
          <p className="text-xs font-medium text-neutral-900 dark:text-white">
            Secure checkout
          </p>
          <p className="mt-1 text-[11px] leading-5 text-neutral-500">
            Your payment information is protected.
          </p>
        </div>

        <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-900/60">
          <p className="text-xs font-medium text-neutral-900 dark:text-white">
            Fast delivery
          </p>
          <p className="mt-1 text-[11px] leading-5 text-neutral-500">
            We ship your order as quickly as possible.
          </p>
        </div>

        <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-900/60">
          <p className="text-xs font-medium text-neutral-900 dark:text-white">
            Easy returns
          </p>
          <p className="mt-1 text-[11px] leading-5 text-neutral-500">
            Simple returns on eligible products.
          </p>
        </div>
      </div>
    </div>
  );
}
