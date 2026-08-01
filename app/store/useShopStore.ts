import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ----------------------------------------------------------------------
// 1. Unified Types: Shopify base extended with legacy compatibility
// ----------------------------------------------------------------------

import { 
  Order, 
  OrderItem, 
  ShippingOption, 
  AdminUser, 
  AdminNotification, 
  OrderStatusHistoryItem, 
  CustomerProfile, 
  CustomerAddress, 
  CustomerNotification 
} from '../types';

import { 
  ShopifyProduct, 
  ProductVariant, 
  Image 
} from '@/lib/shopify/types';

// Assuming your legacy product dummy data array is imported from your mock data file.
// Adjust the import path as necessary for your local file structure.
import { initialProductsData } from '@/app/data'; 

/**
 * Our unified Product type.
 * It is a flattened Shopify Product combined with legacy mapped fields
 * to keep UI files backwards-compatible while integrating Shopify.
 */
export interface Product extends Omit<ShopifyProduct, 'variants' | 'images'> {
  variants: ProductVariant[];
  images: Image[];

  // --- Backwards-Compatibility Mapping Layer ---
  name: string;           // Maps to Shopify `title`
  image: string;          // Maps to Shopify `featuredImage.url`
  price: number;          // Mapped as standard number from `priceRange.minVariantPrice.amount`
  category: string;       // Mapped from first tag or productType

  // --- Legacy UI & Metadata Fields ---
  rating?: number;
  reviewCount?: number;
  label?: 'NEW' | 'TRENDING' | 'LIMITED' | 'SALE';
  originalPrice?: number;
  
  // Inventory & Admin Fields
  animeSeries?: string;
  hide?: boolean;
  soldOut?: boolean;
  enabled?: boolean;
  
  // Admin-Only Fields
  sourceStore?: string;
  sourceUrl?: string;
  purchasePriceJpy?: number;
  productWeight?: number;

  // Pre-order fields
  isPreorder?: boolean;
  preorderLimit?: number;
  preorderCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface NotificationState {
  message: string;
  type: 'success' | 'info';
}

interface ShopState {
  // Products list (Dynamic catalog using our unified hybrid Product type)
  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;

  // Cart State
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;

  // Wishlist State
  wishlist: Product[];
  wishlistCount: number;
  isWishlistOpen: boolean;

  // Navigation & Interactive UI State
  isMobileMenuOpen: boolean;
  notification: NotificationState | null;

  // Dynamic Product Interaction State
  selectedProduct: Product | null;

  // Shipping Management
  shippingOptions: ShippingOption[];
  updateShippingOption: (id: string, updated: Partial<ShippingOption>) => void;

  // Orders Schema & Tracking
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (
    orderId: string, 
    status: Order['status'], 
    updatedBy: string, 
    note?: string
  ) => void;

  // Admin User Auth State
  adminUser: AdminUser | null;
  loginAdmin: (username: string, role: AdminUser['role'], name: string) => boolean;
  logoutAdmin: () => void;

  // System Notifications Log
  adminNotifications: AdminNotification[];
  addAdminNotification: (message: string, type: AdminNotification['type']) => void;
  markNotificationRead: (id: string) => void;

  // Actions
  addToCart: (product: Product, size?: string, color?: string) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;

  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  setWishlistOpen: (open: boolean) => void;

  setMobileMenuOpen: (open: boolean) => void;
  showNotification: (message: string, type: 'success' | 'info') => void;
  clearNotification: () => void;

  setSelectedProduct: (product: Product | null) => void;

  // Customer Auth & Database States
  customers: CustomerProfile[];
  addresses: CustomerAddress[];
  customerNotifications: CustomerNotification[];
  customerWishlists: Record<string, Product[]>;
  currentCustomer: CustomerProfile | null;

  registerCustomer: (profile: Omit<CustomerProfile, 'id' | 'dateCreated'>) => { success: boolean; error: string };
  loginCustomer: (email: string, password: string) => { success: boolean; error: string };
  logoutCustomer: () => void;
  updateCustomerProfile: (updated: Partial<Omit<CustomerProfile, 'id' | 'role' | 'email' | 'dateCreated'>>) => { success: boolean; error: string };
  
  // Addresses
  addAddress: (address: Omit<CustomerAddress, 'id' | 'customerId'>) => void;
  updateAddress: (id: string, updated: Partial<Omit<CustomerAddress, 'id' | 'customerId'>>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Custom customer notifications
  addCustomerNotification: (customerId: string, title: string, message: string, type: CustomerNotification['type']) => void;
  markCustomerNotificationRead: (id: string) => void;

  // Custom client-side router and filters state
  currentRoute: 'home' | 'products' | 'admin' | 'track-order' | 'account';
  setCurrentRoute: (route: 'home' | 'products' | 'admin' | 'track-order' | 'account') => void;
  searchFilter: string;
  setSearchFilter: (query: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
}

// ----------------------------------------------------------------------
// 2. Data Transformation Utilities (Adapter Pattern)
// ----------------------------------------------------------------------

const flattenConnection = <T>(connection: { edges: Array<{ node: T }> } | undefined): T[] => {
  return connection?.edges?.map((edge) => edge.node) || [];
};

/**
 * Transforms legacy static mock products into the unified Product type.
 */
export const transformLegacyToProduct = (p: any): Product => {
  const priceStr = String(p.price || '0');
  const imageUrl = p.image || '';
  return {
    id: p.id,
    handle: p.handle || p.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `prod-${p.id}`,
    availableForSale: !p.soldOut,
    title: p.name || '',
    description: p.description || `High-fidelity anime themed ${p.name || ''}. Features precise coloring and detailing.`,
    descriptionHtml: p.descriptionHtml || `<p>${p.description || ''}</p>`,
    options: p.options || [],
    priceRange: {
      minVariantPrice: { amount: priceStr, currencyCode: 'USD' },
      maxVariantPrice: { amount: priceStr, currencyCode: 'USD' }
    },
    variants: p.variants || [],
    images: p.images || [{ url: imageUrl, altText: p.name }],
    featuredImage: p.featuredImage || { url: imageUrl, altText: p.name },
    seo: p.seo || { title: p.name || '', description: p.description || '' },
    tags: p.tags || [p.category].filter(Boolean),
    updatedAt: p.updatedAt || new Date().toISOString(),

    // Backwards-compatibility values mapped
    name: p.name || '',
    image: imageUrl,
    price: p.price || 0,
    category: p.category || 'Uncategorized',

    // App-specific metadata
    rating: p.rating || 4.5,
    reviewCount: p.reviewCount || 10,
    label: p.label,
    originalPrice: p.originalPrice || p.price || 0,
    animeSeries: p.category,
    enabled: p.enabled ?? true,
    hide: p.hide ?? false,
    soldOut: p.soldOut ?? false,
    sourceStore: p.sourceStore || 'AmiAmi Akihabara',
    sourceUrl: p.sourceUrl || 'https://www.amiami.com/eng/detail/?gcode=FIGURE-' + p.id,
    purchasePriceJpy: p.purchasePriceJpy || Math.floor((p.price || 0) * 0.17),
    productWeight: p.productWeight || 450,
    isPreorder: p.isPreorder ?? (p.label === 'LIMITED'),
    preorderLimit: p.preorderLimit ?? (p.label === 'LIMITED' ? 10 : undefined),
    preorderCount: p.preorderCount ?? (p.label === 'LIMITED' ? 4 : undefined),
  };
};

/**
 * Transforms raw Shopify API Product structures into the unified hybrid Product type.
 * Use this mapping function when writing your fetch queries to populate the store.
 */
export const transformShopifyProduct = (shopifyProduct: ShopifyProduct): Product => {
  const variants = flattenConnection<ProductVariant>(shopifyProduct.variants);
  const images = flattenConnection<Image>(shopifyProduct.images);
  
  const parsedPrice = parseFloat(shopifyProduct.priceRange?.minVariantPrice?.amount || '0');
  const featuredImageUrl = shopifyProduct.featuredImage?.url || (images[0]?.url || '');
  const primaryCategory = shopifyProduct.tags?.[0] || 'Uncategorized';

  let label: Product['label'] = undefined;
  if (shopifyProduct.tags.includes('NEW')) label = 'NEW';
  else if (shopifyProduct.tags.includes('TRENDING')) label = 'TRENDING';
  else if (shopifyProduct.tags.includes('LIMITED')) label = 'LIMITED';
  else if (shopifyProduct.tags.includes('SALE')) label = 'SALE';

  return {
    ...shopifyProduct,
    variants,
    images,

    // Backward-compatibility properties
    name: shopifyProduct.title,
    image: featuredImageUrl,
    price: parsedPrice,
    category: primaryCategory,

    // Metadata & custom app UI values
    rating: 4.8,
    reviewCount: 15,
    label,
    originalPrice: parsedPrice,
    animeSeries: primaryCategory,
    hide: false,
    soldOut: !shopifyProduct.availableForSale,
    enabled: true,

    // Admin & custom parameters
    sourceStore: 'Shopify Store',
    sourceUrl: `https://shopify.com/products/${shopifyProduct.handle}`,
    purchasePriceJpy: Math.round(parsedPrice * 0.17),
    productWeight: 450,
    isPreorder: label === 'LIMITED',
    preorderLimit: label === 'LIMITED' ? 10 : undefined,
    preorderCount: label === 'LIMITED' ? 4 : undefined,
  };
};

// ----------------------------------------------------------------------
// 3. Seed Static Database Mock Data
// ----------------------------------------------------------------------

const getInitialProducts = (): Product[] => {
  return initialProductsData.map((p) => transformLegacyToProduct(p));
};

const initialShippingOptions: ShippingOption[] = [
  { id: 'ship-1', name: 'Economy Shipping', price: 6000, deliveryEstimate: '5-8 weeks' },
  { id: 'ship-2', name: 'Standard Shipping', price: 12000, deliveryEstimate: '2-3 weeks' },
  { id: 'ship-3', name: 'Express Shipping', price: 25000, deliveryEstimate: '3-7 days' }
];

const getInitialOrders = (): Order[] => [
  {
    id: 'OD-9201',
    customerName: 'Keisuke Takahashi',
    customerEmail: 'keisuke@projectd.jp',
    products: [
      {
        id: '1',
        name: 'Gojo Satoru Figure',
        price: 45000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1608889476561-6242afdbf622?q=80&w=1000&auto=format&fit=crop'
      },
      {
        id: '2',
        name: 'Akatsuki Cloud Hoodie',
        price: 28000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop',
        size: 'L',
        color: 'red'
      }
    ],
    amountPaid: 73000,
    shippingMethod: 'Express Shipping',
    status: 'Order Received',
    trackingNumber: 'OTK-EXP-992A',
    dateCreated: '2026-06-12',
    statusHistory: [
      {
        id: 'h-1',
        status: 'Order Received',
        timestamp: '2026-06-12 14:32',
        updatedBy: 'System',
        note: 'Customer completed checkout successfully.'
      }
    ]
  },
  {
    id: 'OD-8812',
    customerName: 'Sakura Haruno',
    customerEmail: 'sakura@konoha.org',
    products: [
      {
        id: '2',
        name: 'Akatsuki Cloud Hoodie',
        price: 28000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop',
        size: 'M',
        color: 'red'
      }
    ],
    amountPaid: 28000,
    shippingMethod: 'Economy Shipping',
    status: 'Awaiting Purchase',
    trackingNumber: '',
    dateCreated: '2026-06-10',
    statusHistory: [
      {
        id: 'h-2',
        status: 'Order Received',
        timestamp: '2026-06-10 09:15',
        updatedBy: 'System',
        note: 'Order placed by client.'
      },
      {
        id: 'h-3',
        status: 'Awaiting Purchase',
        timestamp: '2026-06-10 11:20',
        updatedBy: 'Koji (Staff)',
        note: 'Verified with Tokyo stock; awaiting Japanese buyer action.'
      }
    ]
  },
  {
    id: 'OD-7009',
    customerName: 'Tanjiro Kamado',
    customerEmail: 'tanjiro@slayercorp.org',
    products: [
      {
        id: '6',
        name: 'Roronoa Zoro Katana Set',
        price: 65000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop'
      }
    ],
    amountPaid: 65000,
    shippingMethod: 'Standard Shipping',
    status: 'Purchased in Japan',
    trackingNumber: '',
    dateCreated: '2026-06-08',
    statusHistory: [
      { id: 'h-4', status: 'Order Received', timestamp: '2026-06-08 18:45', updatedBy: 'System' },
      { id: 'h-5', status: 'Awaiting Purchase', timestamp: '2026-06-08 20:01', updatedBy: 'System' },
      { id: 'h-6', status: 'Purchased in Japan', timestamp: '2026-06-09 10:30', updatedBy: 'Ryota (Admin)', note: 'Item secured from Surugaya Akihabara store.' }
    ]
  },
  {
    id: 'OD-6541',
    customerName: 'Lucy Heartfilia',
    customerEmail: 'lucy@fairytail.com',
    products: [
      {
        id: '10',
        name: 'Cyberpunk Neo-Tokyo Bomber',
        price: 48000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop',
        size: 'S'
      }
    ],
    amountPaid: 48000,
    shippingMethod: 'Standard Shipping',
    status: 'Arrived at Japan Facility',
    trackingNumber: 'JP-FAC-8812A',
    dateCreated: '2026-06-05',
    statusHistory: [
      { id: 'h-7', status: 'Order Received', timestamp: '2026-06-05 10:00', updatedBy: 'System' },
      { id: 'h-8', status: 'Purchased in Japan', timestamp: '2026-06-06 14:00', updatedBy: 'Ryota' },
      { id: 'h-9', status: 'Arrived at Japan Facility', timestamp: '2026-06-07 16:30', updatedBy: 'Saito (Warehouse)', note: 'Inspected and added to shipment bin at our Tokyo center.' }
    ]
  },
  {
    id: 'OD-5310',
    customerName: 'Lelouch vi Britannia',
    customerEmail: 'zero@blackknights.org',
    products: [
      {
        id: '9',
        name: 'EVA-01 Test Type Mech Toy',
        price: 78000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1000&auto=format&fit=crop'
      }
    ],
    amountPaid: 78000,
    shippingMethod: 'Express Shipping',
    status: 'Delivered',
    trackingNumber: 'DHL-EX-0023B',
    dateCreated: '2026-06-01',
    statusHistory: [
      { id: 'h-10', status: 'Order Received', timestamp: '2026-06-01 11:15', updatedBy: 'System' },
      { id: 'h-11', status: 'Purchased in Japan', timestamp: '2026-06-02 09:00', updatedBy: 'Admin' },
      { id: 'h-12', status: 'Arrived at Japan Facility', timestamp: '2026-06-03 14:22', updatedBy: 'Warehouse' },
      { id: 'h-13', status: 'Packed for Shipment', timestamp: '2026-06-04 15:30', updatedBy: 'Warehouse' },
      { id: 'h-14', status: 'Shipped', timestamp: '2026-06-05 11:00', updatedBy: 'System', note: 'Dispatched via DHL Air Cargo. Tracking code live.' },
      { id: 'h-15', status: 'Delivered', timestamp: '2026-06-08 16:40', updatedBy: 'System', note: 'Package signed and delivered to destination.' }
    ]
  }
];

const initialNotifications: AdminNotification[] = [
  { id: 'n-1', message: 'New preorder registered: Gojo Satoru Figure', timestamp: '2026-06-12 14:32', type: 'preorder', isRead: false },
  { id: 'n-2', message: 'Item Gojo Satoru Figure reached 70% of preorder slot capacity.', timestamp: '2026-06-11 10:15', type: 'preorder', isRead: false },
  { id: 'n-3', message: 'Order OD-9201 placed by Keisuke Takahashi.', timestamp: '2026-06-12 14:32', type: 'order', isRead: true }
];

const getInitialCustomers = (): CustomerProfile[] => [
  {
    id: 'cust-1',
    email: 'keisuke@projectd.jp',
    name: 'Keisuke Takahashi',
    phone: '+81 90-1234-5678',
    role: 'CUSTOMER',
    password: 'password123',
    dateCreated: '2026-06-01'
  },
  {
    id: 'cust-2',
    email: 'sakura@konoha.org',
    name: 'Sakura Haruno',
    phone: '+81 80-4321-8765',
    role: 'CUSTOMER',
    password: 'password123',
    dateCreated: '2026-06-02'
  },
  {
    id: 'cust-3',
    email: 'lucy@fairytail.com',
    name: 'Lucy Heartfilia',
    phone: '+81 70-5555-4444',
    role: 'CUSTOMER',
    password: 'password123',
    dateCreated: '2026-06-03'
  },
  {
    id: 'cust-admin',
    email: 'admin@okstore.jp',
    name: 'Ryota Supervisor',
    phone: '+81 90-5555-6666',
    role: 'ADMIN',
    password: 'adminpassword',
    dateCreated: '2026-06-01'
  }
];

const getInitialAddresses = (): CustomerAddress[] => [
  {
    id: 'addr-1',
    customerId: 'cust-1',
    fullName: 'Keisuke Takahashi',
    phone: '+81 90-1234-5678',
    country: 'Japan',
    state: 'Gunma',
    city: 'Shibukawa',
    streetAddress: '12-4 Mount Haruna Road',
    isDefault: true
  },
  {
    id: 'addr-2',
    customerId: 'cust-2',
    fullName: 'Sakura Haruno',
    phone: '+81 80-4321-8765',
    country: 'Japan',
    state: 'Tokyo',
    city: 'Minato-ku',
    streetAddress: '3-10 Konoha Street',
    isDefault: true
  }
];

const getInitialCustomerNotifications = (): CustomerNotification[] => [
  {
    id: 'cnotif-1',
    customerId: 'cust-1',
    title: 'Order Status Update',
    message: 'Your order OD-9201 has been received successfully.',
    timestamp: '2026-06-12 14:32',
    isRead: false,
    type: 'order'
  },
  {
    id: 'cnotif-2',
    customerId: 'cust-2',
    title: 'Awaiting Purchase Verification',
    message: 'Your order OD-8812 is verified with Tokyo stock; awaiting Japanese buyer action.',
    timestamp: '2026-06-10 11:20',
    isRead: true,
    type: 'order'
  }
];

const getCartTotals = (cart: CartItem[]) => {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  return { cartCount: count, cartSubtotal: subtotal };
};

// ----------------------------------------------------------------------
// 4. Zustand Store Definition
// ----------------------------------------------------------------------

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      // Dynamic catalog (Using the unified hybrid type)
      products: getInitialProducts(),
      setProducts: (products) => set({ products }),
      addProduct: (newProduct) => {
        const { products } = get();
        set({ products: [newProduct, ...products] });
        get().addAdminNotification(`Added merchandise listing: ${newProduct.name}`, 'inventory');
      },
      updateProduct: (id, updated) => {
        const { products } = get();
        const updatedProducts = products.map((p) => {
          if (p.id === id) {
            const nextProd = { ...p, ...updated };
            
            // Auto Sold Out when limits reach 0 for Preorders
            if (nextProd.isPreorder && nextProd.preorderLimit !== undefined && nextProd.preorderCount !== undefined) {
              const remaining = nextProd.preorderLimit - nextProd.preorderCount;
              if (remaining <= 0) {
                nextProd.soldOut = true;
                nextProd.enabled = false;
              }
            }
            return nextProd;
          }
          return p;
        });
        set({ products: updatedProducts });
      },

      // Cart State
      cart: [],
      cartCount: 0,
      cartSubtotal: 0,
      isCartOpen: false,

      // Wishlist State
      wishlist: [],
      wishlistCount: 0,
      isWishlistOpen: false,

      // Navigation & Interactions
      isMobileMenuOpen: false,
      notification: null,
      selectedProduct: null,
      currentRoute: 'home',
      searchFilter: '',
      categoryFilter: 'all', // Default selection

      // Shipping options
      shippingOptions: initialShippingOptions,
      updateShippingOption: (id, updated) => {
        const { shippingOptions } = get();
        set({
          shippingOptions: shippingOptions.map((opt) =>
            opt.id === id ? { ...opt, ...updated } : opt
          ),
        });
      },

      // Orders state
      orders: getInitialOrders(),
      addOrder: (order) => {
        const { orders } = get();
        set({ orders: [order, ...orders] });
        get().addAdminNotification(`New order ${order.id} placed by ${order.customerName}`, 'order');
      },
      updateOrderStatus: (orderId, status, updatedBy, note) => {
        const { orders } = get();
        const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
        const updatedOrders = orders.map((order) => {
          if (order.id === orderId) {
            const newHistoryItem: OrderStatusHistoryItem = {
              id: 'h-' + Math.random().toString(36).substring(2, 9),
              status,
              timestamp,
              updatedBy,
              note: note || `Order status updated to "${status}" by ${updatedBy}`
            };
            return {
              ...order,
              status,
              statusHistory: [...order.statusHistory, newHistoryItem]
            };
          }
          return order;
        });
        set({ orders: updatedOrders });
        
        // Trigger simulated email notification in dashboard notifications
        const targetOrder = orders.find(o => o.id === orderId);
        if (targetOrder) {
          get().addAdminNotification(
            `🔔 Status Email Log: Update sent to ${targetOrder.customerEmail} regarding order ${orderId} - now: "${status}"`,
            'order'
          );
        }
      },

      // Auth
      adminUser: null,
      loginAdmin: (username, role, name) => {
        const user: AdminUser = { id: 'usr-' + Date.now(), username, role, name };
        set({ adminUser: user });
        return true;
      },
      logoutAdmin: () => set({ adminUser: null }),

      // Customer Auth & Database States
      customers: getInitialCustomers(),
      addresses: getInitialAddresses(),
      customerNotifications: getInitialCustomerNotifications(),
      customerWishlists: {},
      currentCustomer: null,

      registerCustomer: (profile) => {
        const { customers } = get();
        if (customers.some((c) => c.email.toLowerCase() === profile.email.toLowerCase())) {
          return { success: false, error: 'An account with this email already exists.' };
        }
        const newCustomer: CustomerProfile = {
          ...profile,
          id: 'cust-' + Math.random().toString(36).substring(2, 9),
          dateCreated: new Date().toISOString().split('T')[0]
        };
        set({ customers: [...customers, newCustomer] });
        return { success: true, error: '' };
      },

      loginCustomer: (email, password) => {
        const { customers, customerWishlists } = get();
        const customer = customers.find(
          (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
        );
        if (!customer) {
          return { success: false, error: 'Invalid email or password.' };
        }
        const userWishlist = customerWishlists?.[customer.id] || [];
        set({ 
          currentCustomer: customer,
          wishlist: userWishlist,
          wishlistCount: userWishlist.length
        });
        return { success: true, error: '' };
      },

      logoutCustomer: () => {
        set({ 
          currentCustomer: null,
          wishlist: [],
          wishlistCount: 0
        });
      },

      updateCustomerProfile: (updated) => {
        const { currentCustomer, customers } = get();
        if (!currentCustomer) return { success: false, error: 'No customer logged in.' };
        const updatedCustomer = { ...currentCustomer, ...updated };
        const nextCustomers = customers.map((c) =>
          c.id === currentCustomer.id ? updatedCustomer : c
        );
        set({ currentCustomer: updatedCustomer, customers: nextCustomers });
        return { success: true, error: '' };
      },

      addAddress: (address) => {
        const { currentCustomer, addresses } = get();
        if (!currentCustomer) return;
        const newAddress: CustomerAddress = {
          ...address,
          id: 'addr-' + Math.random().toString(36).substring(2, 9),
          customerId: currentCustomer.id
        };
        // If set default, turn off other defaults for this customer
        let newAddressesList = [...addresses];
        if (newAddress.isDefault) {
          newAddressesList = newAddressesList.map((a) =>
            a.customerId === currentCustomer.id ? { ...a, isDefault: false } : a
          );
        }
        newAddressesList.push(newAddress);
        set({ addresses: newAddressesList });
      },

      updateAddress: (id, updated) => {
        const { currentCustomer, addresses } = get();
        if (!currentCustomer) return;
        let newAddressesList = addresses.map((a) => {
          if (a.id === id) {
            return { ...a, ...updated };
          }
          return a;
        });
        const updatedAddr = newAddressesList.find((a) => a.id === id);
        if (updatedAddr?.isDefault) {
          newAddressesList = newAddressesList.map((a) => {
            if (a.customerId === currentCustomer.id && a.id !== id) {
              return { ...a, isDefault: false };
            }
            return a;
          });
        }
        set({ addresses: newAddressesList });
      },

      deleteAddress: (id) => {
        const { addresses } = get();
        set({ addresses: addresses.filter((a) => a.id !== id) });
      },

      setDefaultAddress: (id) => {
        const { currentCustomer, addresses } = get();
        if (!currentCustomer) return;
        const nextAddresses = addresses.map((a) => {
          if (a.customerId === currentCustomer.id) {
            return { ...a, isDefault: a.id === id };
          }
          return a;
        });
        set({ addresses: nextAddresses });
      },

      addCustomerNotification: (customerId, title, message, type) => {
        const { customerNotifications } = get();
        const newNotification: CustomerNotification = {
          id: 'cnotif-' + Math.random().toString(36).substring(2, 9),
          customerId,
          title,
          message,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          isRead: false,
          type
        };
        set({ customerNotifications: [newNotification, ...customerNotifications] });
      },

      markCustomerNotificationRead: (id) => {
        const { customerNotifications } = get();
        set({
          customerNotifications: customerNotifications.map((c) =>
            c.id === id ? { ...c, isRead: true } : c
          )
        });
      },

      // Dashboard Logs / Notifications database
      adminNotifications: initialNotifications,
      addAdminNotification: (message, type) => {
        const { adminNotifications } = get();
        const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
        const newNotif: AdminNotification = {
          id: 'n-' + Math.random().toString(36).substring(2, 9),
          message,
          timestamp,
          type,
          isRead: false
        };
        set({ adminNotifications: [newNotif, ...adminNotifications] });
      },
      markNotificationRead: (id) => {
        const { adminNotifications } = get();
        set({
          adminNotifications: adminNotifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        });
      },

      // Cart Actions
      addToCart: (product, size, color) => {
        const currentProd = get().products.find(p => p.id === product.id) || product;
        if (currentProd.soldOut) {
          get().showNotification(`Sorry, ${product.name} is currently sold out.`, 'info');
          return;
        }

        const { cart } = get();
        const existing = cart.find(
          (item) =>
            item.product.id === product.id &&
            item.size === size &&
            item.color === color
        );
        let nextCart: CartItem[];

        if (existing) {
          nextCart = cart.map((item) =>
            item.product.id === product.id &&
            item.size === size &&
            item.color === color
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
          get().showNotification(`Updated ${product.name} (${size || 'Standard'}) quantity in Cart`, 'info');
        } else {
          nextCart = [...cart, { product: currentProd, quantity: 1, size, color }];
          get().showNotification(`Added ${product.name} (${size || 'Standard'}) to Cart`, 'success');
        }

        const totals = getCartTotals(nextCart);
        set({ cart: nextCart, ...totals });
      },

      removeFromCart: (productId, size, color) => {
        const { cart } = get();
        const target = cart.find(
          (item) =>
            item.product.id === productId &&
            item.size === size &&
            item.color === color
        );
        if (target) {
          get().showNotification(`Removed ${target.product.name} (${size || 'Standard'}) from Cart`, 'info');
        }

        const nextCart = cart.filter(
          (item) =>
            !(
              item.product.id === productId &&
              item.size === size &&
              item.color === color
            )
        );
        const totals = getCartTotals(nextCart);
        set({ cart: nextCart, ...totals });
      },

      updateCartQuantity: (productId, quantity, size, color) => {
        const { cart } = get();
        if (quantity <= 0) {
          get().removeFromCart(productId, size, color);
          return;
        }

        const nextCart = cart.map((item) =>
          item.product.id === productId &&
          item.size === size &&
          item.color === color
            ? { ...item, quantity }
            : item
        );
        const totals = getCartTotals(nextCart);
        set({ cart: nextCart, ...totals });
      },

      clearCart: () => {
        set({ cart: [], cartCount: 0, cartSubtotal: 0 });
        get().showNotification('Cleared your cart', 'info');
      },

      setCartOpen: (open) => set({ isCartOpen: open }),

      // Wishlist Actions
      addToWishlist: (product) => {
        const { wishlist, currentCustomer, customerWishlists } = get();
        if (wishlist.some((p) => p.id === product.id)) return;

        const nextWishlist = [...wishlist, product];
        get().showNotification(`Added ${product.name} to Wishlist`, 'success');
        
        if (currentCustomer) {
          set({
            wishlist: nextWishlist,
            wishlistCount: nextWishlist.length,
            customerWishlists: {
              ...customerWishlists,
              [currentCustomer.id]: nextWishlist
            }
          });
        } else {
          set({ wishlist: nextWishlist, wishlistCount: nextWishlist.length });
        }
      },

      removeFromWishlist: (productId) => {
        const { wishlist, currentCustomer, customerWishlists } = get();
        const target = wishlist.find((p) => p.id === productId);
        if (target) {
          get().showNotification(`Removed ${target.name} from Wishlist`, 'info');
        }

        const nextWishlist = wishlist.filter((p) => p.id !== productId);
        if (currentCustomer) {
          set({
            wishlist: nextWishlist,
            wishlistCount: nextWishlist.length,
            customerWishlists: {
              ...customerWishlists,
              [currentCustomer.id]: nextWishlist
            }
          });
        } else {
          set({ wishlist: nextWishlist, wishlistCount: nextWishlist.length });
        }
      },

      isWishlisted: (productId) => {
        return get().wishlist.some((p) => p.id === productId);
      },

      setWishlistOpen: (open) => set({ isWishlistOpen: open }),

      // Mobile Navigation & Notification Actions
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

      showNotification: (message, type) => {
        set({ notification: { message, type } });
        const currentMsg = message;
        setTimeout(() => {
          const currentNotification = get().notification;
          if (currentNotification && currentNotification.message === currentMsg) {
            get().clearNotification();
          }
        }, 3000);
      },

      clearNotification: () => set({ notification: null }),

      setSelectedProduct: (product) => set({ selectedProduct: product }),

      setCurrentRoute: (route) => {
        set({ currentRoute: route });
        // Sync URL Hash
        if (route === 'home') {
          window.location.hash = '/';
        } else if (route === 'products') {
          window.location.hash = '/products';
        } else if (route === 'admin') {
          window.location.hash = '/admin';
        } else if (route === 'track-order') {
          window.location.hash = '/track-order';
        } else if (route === 'account') {
          window.location.hash = '/account';
        }
      },
      setSearchFilter: (query) => set({ searchFilter: query }),
      setCategoryFilter: (category) => set({ categoryFilter: category }),
    }),
    {
      name: 'otaku-district-zustand-store',
      partialize: (state) => ({
        products: state.products,
        cart: state.cart,
        cartCount: state.cartCount,
        cartSubtotal: state.cartSubtotal,
        wishlist: state.wishlist,
        wishlistCount: state.wishlistCount,
        orders: state.orders,
        shippingOptions: state.shippingOptions,
        adminUser: state.adminUser,
        adminNotifications: state.adminNotifications,
        customers: state.customers,
        addresses: state.addresses,
        customerNotifications: state.customerNotifications,
        customerWishlists: state.customerWishlists,
        currentCustomer: state.currentCustomer,
      }),
    }
  )
);