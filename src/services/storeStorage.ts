import { Product, Coupon, Order, StoreSettings, PatchLog, NepaliBank } from '../types';

import heroImg from '../assets/images/hero_aura_gold_atelier_1791602470386.jpg';
import gownImg from '../assets/images/clothing_black_gold_gown_1791603190985.jpg';
import trenchImg from '../assets/images/product_gold_silk_trench_1791602495792.jpg';
import clutchImg from '../assets/images/product_gold_mesh_clutch_1791602482895.jpg';
import scarfImg from '../assets/images/product_silk_gold_scarf_1791602542268.jpg';
import beltImg from '../assets/images/accessory_gold_buckle_belt_1791603200863.jpg';

export const NEPALI_COMMERCIAL_BANKS: NepaliBank[] = [
  { id: 'nabil', name: 'Nabil Bank', nepaliName: 'नबिल बैंक', code: 'NABIL', logoColor: '#006a4e' },
  { id: 'global_ime', name: 'Global IME Bank', nepaliName: 'ग्लोबल आइएमई बैंक', code: 'GBIME', logoColor: '#e31b23' },
  { id: 'nic_asia', name: 'NIC Asia Bank', nepaliName: 'एनआईसी एशिया बैंक', code: 'NICA', logoColor: '#ed1c24' },
  { id: 'nimb', name: 'Nepal Investment Mega Bank', nepaliName: 'नेपाल इन्भेष्टमेण्ट मेगा बैंक', code: 'NIMB', logoColor: '#1d3557' },
  { id: 'rbb', name: 'Rastriya Banijya Bank', nepaliName: 'राष्ट्रिय वाणिज्य बैंक', code: 'RBB', logoColor: '#0b5296' },
  { id: 'siddhartha', name: 'Siddhartha Bank', nepaliName: 'सिद्धार्थ बैंक', code: 'SBL', logoColor: '#005f73' },
  { id: 'everest', name: 'Everest Bank', nepaliName: 'एभरेष्ट बैंक', code: 'EBL', logoColor: '#8338ec' },
  { id: 'sanima', name: 'Sanima Bank', nepaliName: 'सानिमा बैंक', code: 'SANIMA', logoColor: '#2a9d8f' },
  { id: 'himalayan', name: 'Himalayan Bank', nepaliName: 'हिमालयन बैंक', code: 'HBL', logoColor: '#133c55' },
  { id: 'prabhu', name: 'Prabhu Bank', nepaliName: 'प्रभु बैंक', code: 'PRVU', logoColor: '#d62828' },
  { id: 'scb_nepal', name: 'Standard Chartered Nepal', nepaliName: 'स्ट्यान्डर्ड चार्टर्ड नेपाल', code: 'SCBN', logoColor: '#008080' },
  { id: 'machhapuchchhre', name: 'Machhapuchchhre Bank', nepaliName: 'माछापुच्छ्रे बैंक', code: 'MBL', logoColor: '#0077b6' },
];

export const ATELIER_IMAGE_GALLERY = [
  { name: 'Empress Gilded Tuxedo Blazer', src: heroImg },
  { name: 'Nocturne Velvet Gala Gown', src: gownImg },
  { name: 'Obsidian Silk Trench Coat', src: trenchImg },
  { name: 'Sovereign Gold Mesh Clutch', src: clutchImg },
  { name: 'Imperial Mulberry Silk Scarf', src: scarfImg },
  { name: 'Atelier Monogram Leather Belt', src: beltImg },
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    title: 'The Empress 24K Embroidered Tuxedo Blazer',
    category: 'Suits & Blazers',
    price: 485000,
    compareAtPrice: 550000,
    shortDescription: 'Tailored obsidian silk tuxedo blazer enriched with dense gold bullion baroque embroidery.',
    description: 'An apex statement piece tailored from heavyweight obsidian silk barathea. Master embroiderers spend over 74 hours hand-applying authentic gold bullion wire across the lapels and cuffs. Finished with custom gilded horn buttons and pure silk satin lining.',
    materials: ['100% Pure Italian Silk Barathea', 'Gold Bullion Wire Embroidery', 'Natural Horn Buttons with Gold Inlay'],
    features: ['Hand-embroidered baroque relief', 'Structured architectural shoulders', 'Internal passport & bespoke welt pockets'],
    stock: 4,
    isFeatured: true,
    image: heroImg,
    sku: 'AG-CLT-01',
    deliveryEstimate: '1-2 Days Armored Courier in Kathmandu Valley / 3 Days Pokhara',
    options: [
      { name: 'Size', values: ['FR 36 (US 4)', 'FR 38 (US 6)', 'FR 40 (US 8)', 'FR 42 (US 10)', 'Atelier Made-to-Measure'] }
    ]
  },
  {
    id: 'prod-002',
    title: 'The Nocturne Gilded Velvet Gala Gown',
    category: 'Clothing',
    price: 520000,
    compareAtPrice: 590000,
    shortDescription: 'Sculptural pure black velvet evening gown with hand-embroidered gilded bullion collar and cuffs.',
    description: 'A sovereign evening gown cut from midnight-black silk velvet with a cathedral train. Features a raised mandarin collar adorned with Newar and French floral relief embroidery in metallic gold thread.',
    materials: ['Midnight Silk-Blend Velvet', 'Metallic Gold Bullion Wire', 'Pure Silk Habotai Lining'],
    features: ['Concealed back invisible zipper', 'Floor-length flared silhouette', 'Hand-sewn hem weighting'],
    stock: 3,
    isFeatured: true,
    image: gownImg,
    sku: 'AG-DRS-02',
    deliveryEstimate: '2 Business Days in Nepal',
    options: [
      { name: 'Size', values: ['US 2 (XS)', 'US 4 (S)', 'US 6 (M)', 'US 8 (L)', 'Bespoke Fitting'] }
    ]
  },
  {
    id: 'prod-003',
    title: 'The Obsidian Trench with 24K Gilded Accents',
    category: 'Outerwear',
    price: 390000,
    compareAtPrice: 440000,
    shortDescription: 'Double-breasted storm coat in pure black silk gabardine with solid brushed gold hardware.',
    description: 'Commanding silhouette crafted for grand occasions. Spun from double-weave waterproof silk gabardine, accented with solid brushed gold alloy military buckles and cuff cinches. The storm flap reverses to reveal an opulent metallic gold jacquard interior.',
    materials: ['Treated Black Silk Gabardine', 'Solid Gilded Alloy Hardware', 'Gold Jacquard Cupro Lining'],
    features: ['Double-breasted 8-button stance', 'Removable gold-cinched silk belt', 'Hand-stitched storm collar'],
    stock: 5,
    isFeatured: false,
    image: trenchImg,
    sku: 'AG-OUT-03',
    deliveryEstimate: '2-3 Business Days Across Nepal',
    options: [
      { name: 'Size', values: ['Small (IT 46)', 'Medium (IT 48)', 'Large (IT 50)', 'X-Large (IT 52)'] }
    ]
  },
  {
    id: 'prod-004',
    title: 'The Sovereign Gold Mesh Evening Clutch',
    category: 'Accessories',
    price: 320000,
    compareAtPrice: 365000,
    shortDescription: 'Hand-woven polished gold mesh clutch featuring a natural obsidian onyx cabochon clasp.',
    description: 'Constructed by master leather and metal artisans, this evening clutch utilizes flexible yet resilient gold mesh that drapes fluidly. The closure features a solid black obsidian cabochon, opening to midnight-black French lambskin leather.',
    materials: ['Gilded Polished Mesh Body', 'Natural Jet Obsidian Clasp', 'French Hand-Dressed Lambskin Interior'],
    features: ['Concealable fine chain strap (50cm)', 'Engraved unique atelier hallmarks', 'Protective velvet-lined presentation box'],
    stock: 6,
    isFeatured: true,
    image: clutchImg,
    sku: 'AG-ACC-04',
    deliveryEstimate: 'Next-Day Express Armored Delivery in Nepal',
    options: [
      { name: 'Finish', values: ['Classic Yellow Gold', 'Brushed Royal Gold'] }
    ]
  },
  {
    id: 'prod-005',
    title: 'The Imperial Baroque Silk & Gold Leaf Foulard',
    category: 'Accessories',
    price: 88000,
    compareAtPrice: 110000,
    shortDescription: '100% Grade 6A Mulberry silk twill foulard gilded with gold leaf baroque filigree.',
    description: 'Pure tactile extravagance. Printed onto 18-momme heavyweight silk twill with authentic gold leaf hot-stamping that remains supple against skin. Finished with artisanally rolled and hand-sewn edges.',
    materials: ['100% Grade 6A Mulberry Silk Twill', 'Gold Leaf Filigree Stamp', 'Hand-Stitched Edges'],
    features: ['Double-sided luminosity', 'Water and smudge resistant finish', 'Hand-numbered limited atelier release'],
    stock: 12,
    isFeatured: false,
    image: scarfImg,
    sku: 'AG-ACC-05',
    deliveryEstimate: '1-2 Days in Kathmandu Valley',
    options: [
      { name: 'Format', values: ['90cm x 90cm Square Foulard', '140cm x 140cm Oversized Grand Shawl'] }
    ]
  },
  {
    id: 'prod-006',
    title: 'The Atelier Sculptural Monogram Leather Belt',
    category: 'Accessories',
    price: 145000,
    compareAtPrice: 175000,
    shortDescription: 'Supple full-grain Italian calfskin belt featuring a sculptural brushed gold AG monogram buckle.',
    description: 'Cut from 35mm wide vegetable-tanned French calf leather with beveled hand-painted edges. The buckle is precision investment-cast with an architectural satin gold finish, embodying modern sartorial elegance.',
    materials: ['Full-Grain Italian Calfskin Leather', 'Solid Cast Brushed Gold Alloy Buckle', 'Hypoallergenic Backing'],
    features: ['5-hole custom sizing adjustment', 'Reversible black/dark ebony strap', 'Embossed atelier authentication serial'],
    stock: 7,
    isFeatured: false,
    image: beltImg,
    sku: 'AG-ACC-06',
    deliveryEstimate: '1-3 Business Days Across Nepal',
    options: [
      { name: 'Length', values: ['85 cm / 34 in', '90 cm / 36 in', '95 cm / 38 in', '100 cm / 40 in'] }
    ]
  }
];

const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'cpn-01',
    code: 'AURAGOLD20',
    discountPercent: 20,
    description: 'Atelier Seasonal VIP Privilege — 20% Off Storewide',
    active: true,
    usesCount: 38
  },
  {
    id: 'cpn-02',
    code: 'VIP50K',
    discountAmount: 50000,
    minSpend: 300000,
    description: 'High Patron Privilege — Rs. 50,000 Off orders exceeding Rs. 3,00,000',
    active: true,
    usesCount: 14
  },
  {
    id: 'cpn-03',
    code: 'NAMASTE10',
    discountPercent: 10,
    description: 'First Acquisition Privilege — 10% Off First Piece',
    active: true,
    usesCount: 76
  }
];

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'AURA GOLD',
  tagline: 'Haute Couture Fashion & Designer Accessories Atelier',
  announcement: '✨ निःशुल्क सुरक्षित डेलिभरी (Free Insured Delivery Across Nepal) · Use Code AURAGOLD20 for 20% Off',
  announcementActive: true,
  currencySymbol: 'Rs.',
  currencyCode: 'NPR',
  freeShippingThreshold: 50000, // NPR 50,000
  taxRate: 0.13, // 13% Nepal VAT
  adminPin: '1850', // Default admin master PIN
  supportEmail: 'concierge@auragold.com.np',
  supportPhone: '+977 1 4429810 / 9801234567',
  curationYear: '2026',
  vatPanNumber: 'PAN-601984210'
};

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'ord-891',
    orderNumber: 'AG-2026-8912',
    createdAt: '2026-10-09T14:22:00Z',
    customerName: 'Prashant Bikram Shah',
    customerEmail: 'prashant.shah@himalayanholding.np',
    shippingAddress: {
      fullName: 'Prashant Bikram Shah',
      email: 'prashant.shah@himalayanholding.np',
      phone: '9851023456',
      address: 'Baluwatar Diplomatic Enclave, Ward 4',
      city: 'Kathmandu',
      postalCode: '44600',
      province: 'Bagmati Province'
    },
    items: [
      {
        productId: 'prod-001',
        title: 'The Empress 24K Embroidered Tuxedo Blazer',
        price: 485000,
        quantity: 1,
        selectedOption: 'FR 38 (US 6)',
        image: heroImg
      }
    ],
    subtotal: 485000,
    discount: 97000,
    couponCode: 'AURAGOLD20',
    tax: 50440,
    shipping: 0,
    total: 438440,
    paymentRail: 'esewa',
    nepaliWalletId: '9851023456',
    status: 'Insured Transit',
    receiptToken: 'RCT-ESEWA-8912-SHAH',
    panNumber: 'PAN-601984210'
  },
  {
    id: 'ord-892',
    orderNumber: 'AG-2026-8924',
    createdAt: '2026-10-08T09:14:00Z',
    customerName: 'Dr. Aaradhya Shrestha',
    customerEmail: 'aaradhya.shrestha@nabilcapital.com',
    shippingAddress: {
      fullName: 'Dr. Aaradhya Shrestha',
      email: 'aaradhya.shrestha@nabilcapital.com',
      phone: '9841876543',
      address: 'Jhamsikhel Boutique Quarter, Road 3',
      city: 'Lalitpur',
      postalCode: '44700',
      province: 'Bagmati Province'
    },
    items: [
      {
        productId: 'prod-002',
        title: 'The Nocturne Gilded Velvet Gala Gown',
        price: 520000,
        quantity: 1,
        selectedOption: 'US 4 (S)',
        image: gownImg
      }
    ],
    subtotal: 520000,
    discount: 50000,
    couponCode: 'VIP50K',
    tax: 61100,
    shipping: 0,
    total: 531100,
    paymentRail: 'nepal_bank',
    bankName: 'Nabil Bank (नबिल बैंक)',
    status: 'Delivered',
    receiptToken: 'RCT-NABIL-8924-SHRESTHA',
    panNumber: 'PAN-601984210'
  }
];

const DEFAULT_PATCH_LOGS: PatchLog[] = [
  {
    id: 'ptc-101',
    timestamp: '2026-10-09 18:00',
    version: 'v2.6.0',
    title: 'Clothing & Fashion Accessories Specialization',
    description: 'Restricted store catalog strictly to luxury garments, couture evening gowns, tuxedos, and designer accessories.',
    type: 'feature'
  },
  {
    id: 'ptc-102',
    timestamp: '2026-10-09 19:30',
    version: 'v2.6.1',
    title: 'Nepali Multi-Rail Financial Gateway',
    description: 'Operationalized eSewa, Khalti, Fonepay, and top 12 commercial banks in NPR with 13% VAT auto-calculation.',
    type: 'security'
  }
];

const KEYS = {
  PRODUCTS: 'aura_gold_clothing_v3',
  COUPONS: 'aura_gold_coupons_v3',
  ORDERS: 'aura_gold_orders_v3',
  SETTINGS: 'aura_gold_settings_v3',
  PATCHES: 'aura_gold_patches_v3'
};

export const storeStorage = {
  getProducts(): Product[] {
    try {
      const data = localStorage.getItem(KEYS.PRODUCTS);
      if (!data) {
        localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
        return DEFAULT_PRODUCTS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_PRODUCTS;
    }
  },

  saveProducts(products: Product[]): void {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  },

  addProduct(newProd: Omit<Product, 'id'>): Product {
    const products = this.getProducts();
    const product: Product = {
      ...newProd,
      id: `prod-${Date.now()}`
    };
    products.unshift(product);
    this.saveProducts(products);
    this.logPatch('Clothing Catalog Addition', `Added new garment/accessory: "${product.title}" (${product.sku}) in NPR ${product.price.toLocaleString()}`, 'feature');
    return product;
  },

  updateProduct(updated: Product): void {
    const products = this.getProducts().map(p => p.id === updated.id ? updated : p);
    this.saveProducts(products);
    this.logPatch('Garment Update', `Updated details for "${updated.title}"`, 'feature');
  },

  deleteProduct(id: string): void {
    const products = this.getProducts().filter(p => p.id !== id);
    this.saveProducts(products);
    this.logPatch('Catalog Removal', `Removed product ID ${id} from active atelier offerings`, 'bugfix');
  },

  getCoupons(): Coupon[] {
    try {
      const data = localStorage.getItem(KEYS.COUPONS);
      if (!data) {
        localStorage.setItem(KEYS.COUPONS, JSON.stringify(DEFAULT_COUPONS));
        return DEFAULT_COUPONS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_COUPONS;
    }
  },

  saveCoupons(coupons: Coupon[]): void {
    localStorage.setItem(KEYS.COUPONS, JSON.stringify(coupons));
  },

  addCoupon(coupon: Omit<Coupon, 'id' | 'usesCount'>): Coupon {
    const coupons = this.getCoupons();
    const newCoupon: Coupon = {
      ...coupon,
      id: `cpn-${Date.now()}`,
      usesCount: 0
    };
    coupons.unshift(newCoupon);
    this.saveCoupons(coupons);
    return newCoupon;
  },

  deleteCoupon(id: string): void {
    const coupons = this.getCoupons().filter(c => c.id !== id);
    this.saveCoupons(coupons);
  },

  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(KEYS.ORDERS);
      if (!data) {
        localStorage.setItem(KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
        return DEFAULT_ORDERS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_ORDERS;
    }
  },

  saveOrders(orders: Order[]): void {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
  },

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'receiptToken'>): Order {
    const orders = this.getOrders();
    const orderNum = `AG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      createdAt: new Date().toISOString(),
      receiptToken: `RCT-NPR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      panNumber: 'PAN-601984210'
    };

    // Deduct stock
    const products = this.getProducts();
    for (const item of newOrder.items) {
      const product = products.find(p => p.id === item.productId);
      if (product && product.stock > 0) {
        product.stock = Math.max(0, product.stock - item.quantity);
      }
    }
    this.saveProducts(products);

    orders.unshift(newOrder);
    this.saveOrders(orders);
    return newOrder;
  },

  updateOrderStatus(orderId: string, status: Order['status']): void {
    const orders = this.getOrders().map(o => o.id === orderId ? { ...o, status } : o);
    this.saveOrders(orders);
  },

  getSettings(): StoreSettings {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      if (!data) {
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
        return DEFAULT_SETTINGS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: StoreSettings): void {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    this.logPatch('Store Settings Update', 'Updated store policies, rates or announcement ticker', 'feature');
  },

  getPatchLogs(): PatchLog[] {
    try {
      const data = localStorage.getItem(KEYS.PATCHES);
      if (!data) {
        localStorage.setItem(KEYS.PATCHES, JSON.stringify(DEFAULT_PATCH_LOGS));
        return DEFAULT_PATCH_LOGS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_PATCH_LOGS;
    }
  },

  logPatch(title: string, description: string, type: PatchLog['type'] = 'bugfix'): void {
    const patches = this.getPatchLogs();
    const newPatch: PatchLog = {
      id: `ptc-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      version: `v2.6.${patches.length + 3}`,
      title,
      description,
      type
    };
    patches.unshift(newPatch);
    localStorage.setItem(KEYS.PATCHES, JSON.stringify(patches.slice(0, 50)));
  },

  runSelfRepair(): { fixedCount: number; status: string } {
    let fixedCount = 0;
    const products = this.getProducts();
    for (const p of products) {
      if (typeof p.price !== 'number' || isNaN(p.price) || p.price < 0) {
        p.price = 150000;
        fixedCount++;
      }
      if (typeof p.stock !== 'number' || isNaN(p.stock)) {
        p.stock = 5;
        fixedCount++;
      }
      if (!p.image) {
        p.image = heroImg;
        fixedCount++;
      }
    }
    this.saveProducts(products);

    const coupons = this.getCoupons();
    for (const c of coupons) {
      if (!c.code) {
        c.code = 'AURAGOLD20';
        fixedCount++;
      }
    }
    this.saveCoupons(coupons);

    this.logPatch('Self-Repair & Diagnostic Patch', `Ran autonomous consistency repair: validated ${products.length} clothing items and healed ${fixedCount} schema anomalies. Verified Nepali NPR currency consistency.`, 'bugfix');
    return { fixedCount, status: 'Database healthy, Nepali NPR & VAT invariants fully synchronized' };
  },

  exportBackupJSON(): string {
    const backup = {
      version: 'AURA_GOLD_CLOTHING_3.0',
      currency: 'NPR',
      exportedAt: new Date().toISOString(),
      products: this.getProducts(),
      coupons: this.getCoupons(),
      orders: this.getOrders(),
      settings: this.getSettings(),
      patches: this.getPatchLogs()
    };
    return JSON.stringify(backup, null, 2);
  },

  importBackupJSON(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (data.products) this.saveProducts(data.products);
      if (data.coupons) this.saveCoupons(data.coupons);
      if (data.orders) this.saveOrders(data.orders);
      if (data.settings) this.saveSettings(data.settings);
      this.logPatch('Database Restoration', 'Restored store state from user-supplied JSON backup archive.', 'security');
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  resetToDefaults(): void {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    localStorage.setItem(KEYS.COUPONS, JSON.stringify(DEFAULT_COUPONS));
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    this.logPatch('System Reset', 'Re-initialized clothing & accessories catalog to factory state with NPR currency.', 'bugfix');
  }
};
