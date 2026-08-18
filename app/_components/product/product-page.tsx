'use client';

import Gallery from './Gallery';
import ProductDescription from './product-description';
import { Image } from '@/lib/shopify/types';
import { Product } from '@/app/types';
import { Suspense } from 'react';

export default function ProductPage({
  product,
}: {
  product: Product;
}) {
  if (!product) {
    return (
      <main className="min-h-screen bg-white px-4 py-20 dark:bg-black">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Product not found
          </h1>
        </div>
      </main>
    );
  }

  const images = product.images?.slice(0, 8).map((image: Image) => ({
    src: image.url,
    altText: image.altText || product.title,
  })) ?? [];

  console.log('images', images);

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      {/* Product workspace */}
      <div className="mx-auto max-w-[1400px] px-4 py-8 md:px-8 lg:py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          
          {/* =========================
              PRODUCT GALLERY
          ========================== */}
          <section className="lg:col-span-7">
            <div className="space-y-4">
              <Suspense
                fallback={
                  <div className="aspect-square w-full animate-pulse bg-neutral-100 dark:bg-neutral-900" />
                }
              >
                <div className="overflow-hidden rounded-xl bg-neutral-50 dark:bg-neutral-950">
                  <Gallery images={images} />
                </div>
              </Suspense>

              {/* Small product meta row */}
              <div className="grid grid-cols-3 gap-3 border-t border-neutral-200 pt-5 dark:border-neutral-800">
                <div className="text-center">
                  <p className="text-xs font-medium text-neutral-900 dark:text-white">
                    Free Shipping
                  </p>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    On eligible orders
                  </p>
                </div>

                <div className="border-x border-neutral-200 text-center dark:border-neutral-800">
                  <p className="text-xs font-medium text-neutral-900 dark:text-white">
                    Secure Payment
                  </p>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    Safe & encrypted
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-xs font-medium text-neutral-900 dark:text-white">
                    Easy Returns
                  </p>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    Hassle-free returns
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* =========================
              PRODUCT INFORMATION
          ========================== */}
          <section className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <ProductDescription product={product} />
            </div>
          </section>
        </div>

        {/* =========================
            RELATED PRODUCTS
        ========================== */}
        <section className="mt-16 border-t border-neutral-200 pt-12 dark:border-neutral-800 lg:mt-24">
          <div className="mb-8">
            <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              You may also like
            </h2>

            <p className="mt-2 text-sm text-neutral-500">
              Explore more products from our collection.
            </p>
          </div>

          {/* RelatedProducts can go here */}
        </section>
      </div>
    </main>
  );
};
