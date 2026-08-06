export type menu = {
  title: string;
  path: string;
}

export type shopifyMenuOperation = {
  data: {
    menu?: { 
      items: { 
        title: string; 
        url: string;
      }[]; 
    };
  }
  variables: {
    handle: string
  }
}

export type ShopifyPrice = {
  amount: string;
  currencyCode: string;
}

export type ShopifyProductImage = {
  url: string;
  altText?: string;
}

// export type ShopifyProductVariant = {
//   id: string;
//   title: string;
//   availableForSale: boolean;
//   price: ShopifyPrice;
//   selectedOptions?: Array<{
//     name: string;
//     value: string;
//   }>;
//   image?: ShopifyProductImage;
// }

// export type ShopifyProduct = {
//   id: string;
//   title: string;
//   handle: string;
//   description: string;
//   vendor: string;
//   productType: string;
//   priceRange: {
//     minVariantPrice: ShopifyPrice;
//     maxVariantPrice: ShopifyPrice;
//   };
//   images: Array<ShopifyProductImage>;
//   variants: Array<ShopifyProductVariant>;
//   rating?: string;
//   reviewCount?: string;
// }

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
}

export type Money = {
  amount: string;
  currencyCode: string;
}

export type Connection<T> = {
  edges: Array<{
    node: T;
  }>;
}

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  selectedOptions: {
    name: string;
    value: string;
  }[];
}

export type Image = {
  url: string;
  altText?: string;
  width?: number;
  height?: number;
};

export type SEO = {
  title: string;
  description: string;
}

export type ShopifyProduct = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  variants: Connection<ProductVariant>;
  images: Connection<Image>;
  featuredImage: Image;
  seo: SEO;
  tags: string[];
  updatedAt: string;
}

// export type Product = Omit<ShopifyProduct, 'variants' | 'images'> & {
//   variants: ProductVariant[];
//   images: Image[];
// }
export type GetProductsResponse = {
  data: {
    products: {
      edges: Array<{
        node: ShopifyProduct;
      }>;
    };
  };
}

export type ShopifyProductsOperation = {
  data: {
    products: Connection<ShopifyProduct>;
  };
  variables: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
  };
}

export type ShopifyProductOperation = {
  data: {
    products: ShopifyProduct;
  };
  variables: {
    handle: string;
  };
}

export type ShopifyCollection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  updatedAt: string;
}

export type Collection = ShopifyCollection & {
  path: string;
}

export type ShopifyCollectionOperation = {
  data: {
    collections: Connection<ShopifyCollection>;
  };
}

export type ShopifyCollectionProductsOperation = {
  data: {
    collection: {
      products: Connection<ShopifyProduct>
    };
  }
  variables: {
    handle: string;
    reverse?: boolean;
    sortKey?: string;
  }
}

// Cart details

export type CartProduct = {
  id: string;
  handle: string;
  title: string;
  featuredImage: Image;
}

export type CartItem = {
  id: string | undefined;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: CartProduct;
  }
}

export type ShopifyCart = {
  id: string | undefined;
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  }
  lines: Connection<CartItem>;
  totalQuantity: number;
}

export type ShopifyCreateCartOperation = {
  data: { cartCreate: { cart: ShopifyCart } }
}

export type ShopifyRemoveFromCartOperation = {
  data: {
    cartLinesRemove: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lineIds: string[];
  }
}

export type ShopifyUpdateCartOperation = {
  data: {
    cartLinesUpdate: {
      cart: ShopifyCart;
      userErrors: {
        field: any
        message: any
      };
      warnings: {
          code: any
          message: any
      }
    };
  };
  variables: {
    cartId: string
    lines: {
      id: string; 
      merchandiseId: string; 
      quantity: number
    }[]
  }
}

export type Cart = Omit<ShopifyCart, 'lines'> & {
  lines: CartItem[];
};

export type ShopifyAddToCartOperation = {
  data: {
    cartLinesAdd: {
      cart: ShopifyCart;
    }
  };
  variables: {
    cartId: string;
    lines: {
      merchandiseId: string;
      quantity: number;
    }[];
  };
}

export type ShopifyCartOperation = {
  data: {
    cart: ShopifyCart
  };
  variables: {
    cartId: string
  }
}

export type ShopifyProductRecommendationsOperation = {
  data: {
    productRecommendations: ShopifyProduct[];
  };
  variables: {
    productId: string;
  };
}

