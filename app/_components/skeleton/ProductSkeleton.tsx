'use client';

import { motion } from 'motion/react';

const ProductCardSkeleton = ({ delay = 0 }: { delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="group"
    >
      <div className="overflow-hidden rounded-sm border border-white/5 bg-[#070912]/80 backdrop-blur-md">
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-white/[0.03]">
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/[0.04] via-white/[0.08] to-white/[0.04]" />

          {/* Floating badges */}
          <div className="absolute top-4 left-4 h-6 w-20 rounded-full bg-white/10 animate-pulse" />
          <div className="absolute top-4 right-4 h-6 w-10 rounded-full bg-white/10 animate-pulse" />
        </div>

        {/* Content */}
        <div className="space-y-4 p-5">
          {/* Category */}
          <div className="h-3 w-24 rounded bg-white/10 animate-pulse" />

          {/* Product title */}
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-white/10 animate-pulse" />
            <div className="h-4 w-3/4 rounded bg-white/10 animate-pulse" />
          </div>

          {/* Price */}
          <div className="h-6 w-28 rounded bg-white/10 animate-pulse" />

          {/* CTA */}
          <div className="pt-2">
            <div className="h-11 w-full rounded-sm border border-white/10 bg-white/[0.03] animate-pulse" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function ProductGridSkeleton({
  count = 9,
}: {
  count?: number;
}) {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="h-3 w-44 rounded bg-white/10 animate-pulse" />

        <div className="flex gap-2">
          <div className="h-8 w-8 rounded-full bg-white/10 animate-pulse" />
          <div className="h-8 w-8 rounded-full bg-white/10 animate-pulse" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: count }).map((_, index) => (
          <ProductCardSkeleton
            key={index}
            delay={index * 0.04}
          />
        ))}
      </div>
    </div>
  );
}