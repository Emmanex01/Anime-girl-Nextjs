// components/ProductCard.tsx
'use client'
import { Heart, Eye, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/shopify/types";
import { motion } from "motion/react";

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

export default function ProductCard({ product }: Props) {
  const price = product.priceRange.minVariantPrice;

  const category =
    product.description.match(/Category:\s(.+?)\./)?.[1] ??
    product.tags?.[0];

  const image = product.featuredImage ?? product.images?.[0] ?? null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="group relative flex flex-col bg-[#0f111a] border border-white/5 rounded-sm overflow-hidden min-w-[200px] select-none cursor-pointer hover:border-white/10 transition-all duration-300"
    >
    <Link href={`/products/${product.id}`}>
      <div className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-slate-900">
          {image ? (
              <Image
                src={image.url}
                alt={image.altText ?? product.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-zinc-200">
                No Image
              </div>
            )}

          {/* Availability */}
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-md ${
              product.availableForSale
                ? "bg-emerald-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {product.availableForSale ? "In Stock" : "Sold Out"}
          </span>

          {/* Actions */}
          <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-0 transition group-hover:opacity-100">
            <button className="rounded-full bg-white p-2 shadow-lg hover:bg-zinc-100">
              <Heart size={18} />
            </button>

            <button className="rounded-full bg-white p-2 shadow-lg hover:bg-zinc-100">
              <Eye size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 p-5">
          <div>
            <p className="text-sm font-medium text-indigo-600">
              {category}
            </p>

            <h3 className="mt-1 line-clamp-2 text-lg font-bold text-zinc-900">
              {product.title}
            </h3>

            <p className="mt-2 line-clamp-2 text-sm text-zinc-500">
              {product.description.replace(/Category:.*/, "")}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Bottom */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-zinc-900">
                {price.currencyCode} {price.title}
              </p>
            </div>

            <Link
              href={`/products/${product.handle}`}
              className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              <ShoppingBag size={16} />
              View
            </Link>
          </div>
        </div>
      </div>
  </Link>
  </motion.div>
  );
}