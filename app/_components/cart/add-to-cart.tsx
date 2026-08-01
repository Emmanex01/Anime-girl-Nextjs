import { Product } from "@/app/types";
import { useCart } from "./cart-context";
import { useFormState } from "react-dom";
import { ProductVariant } from "@/lib/shopify/types";
import { PlusIcon } from "lucide-react";
import { addItem } from "./action";
import { useProduct } from "../product/product-context";

function SubmitButton ({
    availableForSale,
    selectedVariantId,
} : {
    availableForSale: boolean;
    selectedVariantId: string | undefined;
}) {
    const buttonClasses = 'relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white';
    const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

    if(!availableForSale) {
        return (
            <button 
                disabled 
                className={`${buttonClasses} ${disabledClasses}`}
            >
                Out of Stock
            </button>
        )
    }

    if(!selectedVariantId) {
        return (
            <button
                aria-label="please select an option"
                disabled 
                className={`${buttonClasses} ${disabledClasses}`}
            >
                <div className="absolute left-0 ml-4">
                    <PlusIcon className="h-5"/>
                </div>
                Add to Cart
            </button>
        )
    }

    return (
            <button
                aria-label="please select an option"
                disabled 
                className={`${buttonClasses} hover:opacity-90`}
            >
                <div className="absolute left-0 ml-4">
                    <PlusIcon className="h-5"/>
                </div>
                Add to Cart
            </button>
    )
}

export function AddToCart({ product } : { product: Product}) {
    const { variants, availableForSale } = product;
    const { addCartItem } = useCart()
    const { state } = useProduct();
    const [ message, formAction ] = useFormState(addItem, null);
    const variant = variants.find((variant: ProductVariant) => 
        variant.selectedOptions.every(
            (option) => option.value === state[option.name.toLowerCase()]
        )
    );
    const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
    const selectedVariantId = variant?.id || defaultVariantId;
    const actionWithVariant = formAction.bind(null, selectedVariantId);
    const finalVariant = variants.find(
        (variant) => variant.id === selectedVariantId
    )!;
    return ( 
        <form action={async () => {
            addCartItem(finalVariant, product),
            await actionWithVariant();
        }}>
            <SubmitButton 
                availableForSale={availableForSale} 
                selectedVariantId={selectedVariantId}
            />
            <p className="sr-only" role="status" aria-label="polite">
                {message}
            </p>
        </form>
    )
}