import { ShopifyProduct, ProductVariant, Image } from '@/lib/shopify/types'; // Update paths as appropriate

/**
 * The core application Product. 
 * Combines live Shopify parameters with legacy compatibility layers and warehouse metadata.
 */
export interface Product extends Omit<ShopifyProduct, 'variants' | 'images'> {
  variants: ProductVariant[];
  images: Image[];

  // --- Backward-Compatibility Layer (Prevents UI Breakage) ---
  name: string;           // Maps to Shopify's `title`
  image: string;          // Maps to Shopify's `featuredImage.url`
  price: number;          // Mapped as number from priceRange.minVariantPrice.amount
  category: string;       // Mapped from tags or productType

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

export interface Collection {
  id: string;
  title: string;
  image: string;
  cta: string;
}

export interface CommunityPost {
  id: string;
  username: string;
  image: string;
  likes: number;
  type: 'setup' | 'fashion' | 'gaming' | 'cosplay';
}

export interface AdminUser {
  id: string;
  username: string;
  role: 'Admin' | 'Staff/Fulfillment Manager';
  name: string;
}

export interface OrderStatusHistoryItem {
  id: string;
  status: string;
  timestamp: string;
  updatedBy: string;
  note?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  products: OrderItem[];
  amountPaid: number;
  shippingMethod: string;
  status: 'Order Received' | 'Awaiting Purchase' | 'Purchased in Japan' | 'Arrived at Japan Facility' | 'Packed for Shipment' | 'Shipped' | 'Delivered';
  trackingNumber: string;
  dateCreated: string;
  statusHistory: OrderStatusHistoryItem[];
}

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  deliveryEstimate: string;
}

export interface AdminNotification {
  id: string;
  message: string;
  timestamp: string;
  type: 'order' | 'preorder' | 'inventory';
  isRead: boolean;
}

export type UserRole = 'CUSTOMER' | 'ADMIN' | 'STAFF';

export interface CustomerProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  password?: string; // stored for local simulation
  dateCreated: string;
}

export interface CustomerAddress {
  id: string;
  customerId: string;
  fullName: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  streetAddress: string;
  isDefault: boolean;
}

export interface CustomerNotification {
  id: string;
  customerId: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'order' | 'announcement' | 'system';
}

