import cartFragment from "../fragment/cart";

export const addToCartMutation = /* GrapphQL */ `
    mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
            cart {
                ...cart
            }
        }
    }
    ${cartFragment}
`;

export const createCartMutation = /* GrapphQL */ `
    mutation createCart($lineItems: [CartLineInput!]) {
        cartCreate(input: { lines: $lineItems }) {
            cart {
                ...cart
            }
        }
    }
    ${cartFragment}
`;

export const editCartItemsCartMutation = /* GrapphQL */ `
    mutation editCartItems($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
            cart {
                ...cart
            }
        }
    }
    ${cartFragment}
`;

export const removeFromCartMutation = /* GrapphQL */ `
    mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lines: $lineIds) {
            cart {
                ...cart
            }
        }
    }
    ${cartFragment}
`;