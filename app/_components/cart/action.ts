import { TAGS } from "@/lib/constants";
import { addToCart, createCart, getCart, removeFromcart, updateCart } from "@/lib/shopify";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function addItem(
    prevState: any,
    selectedVariantId: string | undefined
) {
    let cartId = (await cookies()).get('cardId')?.value;

    if(!cartId || !selectedVariantId) {
        return 'Error adding Item to Cart'
    }

    try {
        await addToCart(cartId, [
           { merchandiseId: selectedVariantId, quantity: 1 }
        ]);
        revalidateTag(TAGS.carts, 'max');
    } catch (error) {
        return 'Error add item to cart'
    }
}

export async function updateItemQuantity(
    prevState: any,
    payload: {
        merchandiseId: string;
        quantity: number;
    }
) {
    let cartId = (await cookies()).get('cardId')?.value;

    if(!cartId ) {
        return 'Missing cart ID'
    }

    const { merchandiseId, quantity} = payload;

    try {
        const cart = await getCart(cartId);
        if(!cart) {
            return " Error fetching cart"
        }

        const lineItem = cart.lines.find(
            (line) => line.merchandise.id === merchandiseId
        );

        if (lineItem && lineItem.id) {
            if (quantity === 0) {
                await removeFromcart(cartId, [lineItem.id]);
            } else {
                await updateCart(cartId, [
                    {
                        id: lineItem.id,
                        merchandiseId,
                        quantity
                    }
                ])
            }
        } else if ( quantity > 0) {
            // if the item doesn't exist in the cart and quantity > 0, add it
            await addToCart(cartId, [{merchandiseId, quantity}])
        }
    } catch (error) {
        console.error(error);
        return "Error updating item quantity"
    }
}

export async function removeItem(prevState: any, merchandiseId: string) {
    let cartId = (await cookies()).get('cartId')?.value;

    if (!cartId) {
        return 'Missing cart ID'
    }

    try {
        const cart = await getCart(cartId);
        if(!cart) {
            return " Error fetching cart"
        }

        const lineItem = cart.lines.find(
            (line) => line.merchandise.id === merchandiseId
        );

        if (lineItem && lineItem.id) {
            await removeFromcart(cartId, [lineItem.id]);
            revalidateTag(TAGS.carts, 'max')
        } else {
            return "Item not found in cart"
        }
    } catch (error) {
        return "Error removing item from cart"
    }
}

export async function createCartAndsetCookies() {
    let cart = await createCart();
    (await cookies()).set('cartId', cart.id!);
}

export async function redirectToCheckout() {
    let cartId = (await cookies()).get('cartId')?.value;

    if (!cartId) {
        return 'Missing cart ID'
    }

    let cart = await getCart(cartId);

    if (!cart) {
        return "Error fetching cart"
    }

    redirect(cart.checkoutUrl)
}