'use server'
import { TAGS } from "@/lib/constants";
import { addToCart, createCart, getCart, removeFromcart, updateCart } from "@/lib/shopify";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Cart } from "@/lib/shopify/types";

export async function addItem(
    prevState: any,
    selectedVariantId: string | undefined
) {
    console.log("addItem fired", selectedVariantId);
    const cartId = (await cookies()).get('cartId')?.value;

    if (!selectedVariantId || !cartId) {
        return "Missing variant or cart ID" ;
    }

    try {
        const cart = await addToCart(cartId, [
            { merchandiseId: selectedVariantId, quantity: 1 }
        ]);
        console.log('Cart after adding item:', cart);
        revalidateTag(TAGS.carts, 'max');
    } catch(error) {
        console.error('Error adding item to cart:', error);
        return "Error adding item to cart";
    }
}

export async function updateItemQuantity(
    prevState: any,
    payload: {
        merchandiseId: string;
        quantity: number;
    }
) {
    const cartId = (await cookies()).get('cartId')?.value;

    if (!cartId) {
        return { message: 'Missing cart ID' };
    }

    const { merchandiseId, quantity } = payload;

    try {
        const cart = await getCart(cartId);
        if (!cart) {
            return { message: 'Error fetching cart' };
        }

        const lineItem = cart.lines.find(
            (line) => line.merchandise.id === merchandiseId
        );

        let updatedCart: Cart | undefined;

        if (lineItem && lineItem.id) {
            if (quantity === 0) {
                updatedCart = await removeFromcart(cartId, [lineItem.id]);
            } else {
                updatedCart = await updateCart(cartId, [
                    {
                        id: lineItem.id,
                        merchandiseId,
                        quantity
                    }
                ]);
            }
        } else if (quantity > 0) {
            updatedCart = await addToCart(cartId, [{ merchandiseId, quantity }]);
        }

        if (updatedCart) {
            revalidateTag(TAGS.carts, 'max');
            return { cart: updatedCart, message: 'Cart updated' };
        }

        return { message: 'Cart updated' };
    } catch (error) {
        console.error(error);
        return { message: 'Error updating item quantity' };
    }
}

export async function removeItem(prevState: any, merchandiseId: string) {
    const cartId = (await cookies()).get('cartId')?.value;

    if (!cartId) {
        return { message: 'Missing cart ID' };
    }

    try {
        const cart = await getCart(cartId);
        if (!cart) {
            return { message: 'Error fetching cart' };
        }

        console.log('Current cart:', cart);

        const lineItem = cart.lines.find(
            (line) => line.merchandise.id === merchandiseId
        );

        console.log('Line item to remove:', lineItem);

        console.log('Before if');
console.log('lineItem:', lineItem);
console.log('lineItem.id:', lineItem?.id);

if (lineItem && lineItem.id) {
console.log('ENTERED IF');

console.log('Removing line item with ID:', lineItem.id);

const updatedCart = await removeFromcart(cartId, [lineItem.id]);

console.log('Returned from removeFromcart');

console.log(updatedCart);

revalidateTag(TAGS.carts, 'max');

return {
    cart: updatedCart,
    message: 'Item removed from cart'
};
}

console.log('FAILED IF');

        return { message: 'Item not found in cart' };
    } catch (error) {
    console.error('removeItem failed:', error);

    if (error instanceof Error) {
        console.error(error.stack);
    }

    throw error;
}
}

export async function createCartAndsetCookies() {
    const cart = await createCart();

    if (!cart.id) {
        throw new Error('Failed to create cart');
    }

    (await cookies()).set('cartId', cart.id);
}

export async function redirectToCheckout() {
    const cartId = (await cookies()).get('cartId')?.value;

    if (!cartId) {
        return 'Missing cart ID';
    }

    const cart = await getCart(cartId);

    if (!cart) {
        return 'Error fetching cart';
    }

    redirect(cart.checkoutUrl);
}