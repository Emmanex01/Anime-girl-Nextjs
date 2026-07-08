// components/ProductCard.tsx

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/shopify/types";

// type Product = {
//   id: string;
//   handle: string;
//   title: string;
//   availableForSale: boolean;
//   featuredImage?: {
//     url: string;
//     altText?: string | null;
//     width: number;
//     height: number;
//   };
//   priceRange: {
//     minVariantPrice: {
//       amount: string;
//       currencyCode: string;
//     };
//   };
// };

type Props = {
  product: Product;
};

export default function ProductCardComponent({ product }: Props) {
  const price = Number(
    product.priceRange.minVariantPrice.currencyCode
  ).toLocaleString();

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block overflow-hidden rounded-xl border bg-white transition hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden">
        {product.featuredImage && (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        )}

        {!product.availableForSale && (
          <span className="absolute left-3 top-3 rounded bg-red-600 px-2 py-1 text-xs font-medium text-white">
            Sold Out
          </span>
        )}
      </div>

      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 font-semibold">
          {product.title}
        </h3>

        <p className="font-bold">
          {product.priceRange.minVariantPrice.currencyCode} {price}
        </p>
      </div>
    </Link>
  );
}