export type ProductCategory = 
  | 'All' 
  | 'Clothing' 
  | 'Outerwear' 
  | 'Suits & Blazers' 
  | 'Accessories';

export type NepaliPaymentRail = 
  | 'esewa' 
  | 'khalti' 
  | 'fonepay' 
  | 'connectips' 
  | 'nepal_bank' 
  | 'card';

export interface NepaliBank {
  id: string;
  name: string;
  nepaliName: string;
  code: string;
  logoColor?: string;
}

export interface Product {
  id: string;
  title: string;
  category: 'Clothing' | 'Outerwear' | 'Suits & Blazers' | 'Accessories';
  price: number; // In NPR
  compareAtPrice?: number; // In NPR
  shortDescription: string;
  description: string;
  materials: string[];
  features: string[];
  stock: number;
  isFeatured: boolean;
  image: string;
  sku: string;
  deliveryEstimate: string;
  options?: {
    name: string;
    values: string[];
  }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent?: number;
  discountAmount?: number; // In NPR
  minSpend?: number; // In NPR
  description: string;
  active: boolean;
  usesCount: number;
}

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string; // Kathmandu, Lalitpur, Pokhara, etc.
  postalCode: string;
  province: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  selectedOption?: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: ShippingDetails;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number; // 13% Nepal VAT
  shipping: number;
  total: number;
  paymentRail: NepaliPaymentRail;
  bankName?: string;
  nepaliWalletId?: string;
  status: 'Pending' | 'Processing' | 'Insured Transit' | 'Delivered';
  receiptToken: string;
  panNumber?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  announcement: string;
  announcementActive: boolean;
  currencySymbol: string; // 'Rs.' or 'NPR'
  currencyCode: 'NPR';
  freeShippingThreshold: number; // In NPR, e.g. 15,000
  taxRate: number; // 0.13 for 13% VAT
  adminPin: string; // default "1850"
  supportEmail: string;
  supportPhone: string;
  curationYear: string;
  vatPanNumber: string;
}

export interface PatchLog {
  id: string;
  timestamp: string;
  version: string;
  title: string;
  description: string;
  type: 'security' | 'feature' | 'bugfix' | 'performance';
}
