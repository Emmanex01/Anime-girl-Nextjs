export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  label?: 'NEW' | 'TRENDING' | 'LIMITED' | 'SALE';
  originalPrice?: number;
  tags?: string[];
  
  // Inventory & Admin Fields
  description?: string;
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

