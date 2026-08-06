import { CartItem } from "@/lib/shopify/types";
import { Minus, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { updateItemQuantity } from "./action";
import { useRouter } from "next/navigation";


export function SubmitButton ({ 
    type, 
    onClick 
}: {
    type: 'plus' | 'minus'; 
    onClick: () => void
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={type === 'plus' ? 'increase item quantity' : 'decrease item quantity'}
            className="w-5 h-5 rounded-sm hover:bg-white/5 flex items-center justify-center text-white/50 hover:text-white cursor-pointer"
        >
            { type === 'plus' ? ( 
                <Plus className="w-2.5 h-2.5" />
            ) : 
                ( <Minus className="w-2.5 h-2.5" />

            ) }
        </button>
    )
}

export function EditItemQuantityButton({ 
    item, 
    type, 
    optimisticUpdate 
}: { 
    item: CartItem; 
    type: 'plus' | 'minus'; 
    optimisticUpdate: any
}) {
    const [isPending, startTransition] = useTransition();
    const payload = {
        merchandiseId: item.merchandise.id,
        quantity: type === 'plus' ? item.quantity + 1 : item.quantity - 1,
    }
    const router = useRouter()
    const handleEditItemQuantity = () => {
        startTransition(async () => {
            // 1. Optimistic update (client cart context)
            optimisticUpdate(item.merchandise.id, type);

            // 2. Run server action
            await updateItemQuantity(null, payload);;
        });
    }
    return (
        <div>
            <SubmitButton 
                type={type}
                onClick={handleEditItemQuantity}
            />
        </div>
    )
}