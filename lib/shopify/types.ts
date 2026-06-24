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

export type ShopifyProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyPrice;
  selectedOptions?: Array<{
    name: string;
    value: string;
  }>;
  image?: ShopifyProductImage;
}

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  vendor: string;
  productType: string;
  priceRange: {
    minVariantPrice: ShopifyPrice;
    maxVariantPrice: ShopifyPrice;
  };
  images: Array<ShopifyProductImage>;
  variants: Array<ShopifyProductVariant>;
  rating?: string;
  reviewCount?: string;
}

export type GetProductsResponse = {
  data: {
    products: {
      edges: Array<{
        node: ShopifyProduct;
      }>;
    };
  };
}

export type GetProductResponse = {
  data: {
    productByHandle: ShopifyProduct;
  };
}
