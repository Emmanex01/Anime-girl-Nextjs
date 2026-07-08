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
  title: string;
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

export type Product = Omit<ShopifyProduct, 'variants' | 'images'> & {
  variants: ProductVariant[];
  images: Image[];
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

export type ShopifyProductOperation = {
  data: {
    products: Connection<ShopifyProduct>;
  };
  variables: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
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
