'use client'
import React from "react";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useShopStore } from "../store/useShopStore";

// Import our unified hybrid Product type to match our Zustand Store definitions
import { Product } from "../types"; 
import { useCart } from "./cart/cart-context";
import { AddToCart } from "./cart/add-to-cart";

type Props = {
  product: Product;
};

export default function ProductCardComponent({ product }: Props) {
  const router = useRouter();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useShopStore();
  const { addCartItem } = useCart(); // Ensure we are using the correct unique identifier for the product
  
  // Fix: isWishlisted expects unique product.id matching your state schema, not the handle
  const wishlisted = isWishlisted(product.id);
  const price = product.priceRange.maxVariantPrice;

  const category =
    product.description?.match(/Category:\s(.+?)\./)?.[1] ??
    product.tags?.[0] ?? "Uncategorized";

  const image = product.featuredImage ?? product.images?.[0] ?? null;

  const viewProduct = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  // Fix: Use React.MouseEvent to align with React's Synthetic Event engine and prevent TS errors
  const handleWishlistClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents clicks from triggering the main card's <Link> navigation
    if (wishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Fix: Prevents outer <Link> navigation from overriding the cart addition behavior
  const handleCartClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const variant = product.variants?.[0]; // Assuming the first variant is the default selection
    if (!variant) {
      console.error("No variant available for this product.");
      return;
    }
    addCartItem(variant, product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="group relative flex flex-col bg-[#0f111a] border border-white/5 rounded-sm overflow-hidden min-w-50 select-none cursor-pointer hover:border-white/10 transition-all duration-300"
    >
      <Link href={`/products/${product.handle}`} className="block h-full">
        <div className="group overflow-hidden rounded-3xl shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
          {/* Image container */}
          <div className="relative aspect-square overflow-hidden bg-slate-900">
            {image ? (
              <Image
                src={image.url}
                alt={image.altText ?? product.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
            <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-0 transition group-hover:opacity-100 z-10">
              {/* Fix: Heart click handler bound, styled dynamically to reflect wishlist state */}
              <button 
                onClick={handleWishlistClick}
                className="rounded-full bg-black/50 p-2 shadow-lg hover:bg-zinc-100 group/btn transition-colors"
              >
                <Heart 
                  size={18} 
                  className={wishlisted ? "fill-red-500 text-red-500" : "text-white group-hover/btn:text-black"} 
                />
              </button>

              {/* Fix: Eye click handler bound to routing details */}
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  viewProduct(product.id);
                }}
                className="rounded-full bg-black/50 p-2 shadow-lg hover:bg-zinc-100 group/btn transition-colors"
              >
                <Eye size={18} className="text-white group-hover/btn:text-black" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4 p-5">
            <div>
              <p className="text-sm font-medium text-indigo-600">
                {category}
              </p>

              <h3 className="mt-1 line-clamp-2 text-lg font-bold text-white">
                {product.title}
              </h3>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.slice(0, 2).map((tag) => (
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
                <p className="text-[10px] font-bold text-zinc-400">
                  {price.amount} {price.currencyCode}
                </p>
              </div>

              {/* Fix: Evaluates and handles cart click correctly on execution */}
              <div
                onClick={handleCartClick}
                className=" bg-black text-[12px] font-medium text-white transition hover:bg-zinc-800 cursor-pointer"
              >
                <AddToCart product={product} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}