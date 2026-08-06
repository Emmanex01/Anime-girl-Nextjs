'use client';

import { useState, useTransition } from "react";
import { Product } from "@/app/types";
import { useCart } from "./cart-context";
import { ProductVariant } from "@/lib/shopify/types";
import { PlusIcon, ShoppingCart } from "lucide-react";
import { useProduct } from "../product/product-context";
import { addItem } from "./action";
import { useRouter } from "next/navigation";

function SubmitButton({
    availableForSale,
    selectedVariantId,
    isPending,
    onClick,
}: {
    availableForSale: boolean;
    selectedVariantId: string | undefined;
    isPending: boolean;
    onClick: () => void;
}) {
    const buttonClasses = 'relative flex w-full text-[10px] items-center gap-2 hover:bg-zinc-800 cursor-pointer justify-center p-2 tracking-wide text-white';
    const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

    if (!availableForSale) {
        return (
            <button disabled className={`${buttonClasses} ${disabledClasses}`}>
                <ShoppingCart size={16} />
                Out of Stock
            </button>
        );
    }

    if (!selectedVariantId) {
        return (
            <button
                type="button"
                disabled 
                className={`${buttonClasses} ${disabledClasses}`}
            >
                Please Select Options
            </button>
        );
    }

    return (
        <button
            type="button"
            disabled={isPending}
            onClick={onClick}
            className={`${buttonClasses} ${isPending ? disabledClasses : 'hover:opacity-90'}`}
        >
            <ShoppingCart size={16} />
            {isPending ? "Adding..." : "Add to Cart"}
        </button>
    );
}

export function AddToCart({ product }: { product: Product }) {
    const { variants, availableForSale } = product;
    const { addCartItem } = useCart();
    const { state } = useProduct();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter(); // 👈 2. Initialize router

    const variant = variants.find((variant: ProductVariant) => 
        variant.selectedOptions.every(
            (option) => option.value === state[option.name.toLowerCase()]
        )
    );

    const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
    const selectedVariantId = variant?.id || defaultVariantId;
    const finalVariant = variants.find((v) => v.id === selectedVariantId);

    const handleAddToCart = () => {
        if (!selectedVariantId || !finalVariant) return;

        startTransition(async () => {
            // 1. Optimistic update (client cart context)
            addCartItem(finalVariant, product);

            // 2. Run server action
            const result = await addItem(null, selectedVariantId);
            
            if (result) {
                setMessage(result);
            }

            // 3. Refresh Server Components (updates Cart Badge/Header instantly!)
            router.refresh(); 
        });
    };

    return (
        <div>
            <SubmitButton 
                availableForSale={availableForSale} 
                selectedVariantId={selectedVariantId}
                isPending={isPending}
                onClick={handleAddToCart}
            />
        </div>
    );
}