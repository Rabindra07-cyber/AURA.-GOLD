# AURA GOLD — Luxury Fashion & Gold Accessories Atelier

A bespoke, high-graphics digital boutique and e-commerce experience named **AURA GOLD**, featuring an ultra-luxurious dark obsidian and metallic gold visual identity. Built with a customer-facing storefront, interactive multi-rail payment gateway, and a secure, role-gated admin portal enabling complete catalog management, real-time order fulfillment, and self-service maintenance diagnostics.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following key decisions have been confirmed and incorporated into this architecture based on your responses:

- **Confirmed Product Line**: High-end designer fashion and gold-embellished accessories (couture apparel, tailored silk outerwear, gold-mesh evening clutches, 24K bullion-inlaid accessories, and heirloom jewelry accents).
- **Confirmed Payment Gateway Experience**: Multi-rail gateway simulation featuring instant Credit/Debit card processing with CVV security, Apple/Google Pay biometric tokens, and instant Gold/Crypto vault settlement with real-time receipt generation.
- **Confirmed Admin & Maintenance Suite**: Real-time order fulfillment status pipeline, customer receipt tracker, live product catalog CRUD (add, edit, remove, toggle availability), and self-service system health diagnostics & update patcher.
- **Confirmed Customer/Admin Boundary**: Strict role separation. Customers are restricted to shopping, viewing product details, and executing orders. The admin portal is protected by a secure master PIN code (`1850` default, customizable) with auto-lock and zero administrative leaks on the storefront.

---

## 1. Overview & Core Concept

- **What It Does**: AURA GOLD delivers a high-fidelity digital flagship store for discerning luxury clientele. Customers can browse curated seasonal couture and gold accessories with rich imagery, filter by luxury collection, inspect high-resolution product details, configure sizing/finishes, add items to a slide-over cart, and complete frictionless checkout across multiple payment rails.
- **Target Audience / Persona**: High-net-worth clients, luxury fashion connoisseurs, collectors of fine gold accessories, and store owners seeking autonomous inventory and operational governance.
- **Key Value**: Provides an opulent visual experience with obsidian black surfaces and luminous gold craftsmanship, paired with full merchant control to update products, fulfill orders, review receipts, and self-heal system settings without touching code.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Storefront Discovery**: Customers land on a cinematic hero showcase highlighting the AURA GOLD signature campaign. They browse filtered collections (Couture Apparel, Gold Accessories, Heirloom Footwear, Bespoke Pieces) in an expansive 3-column editorial grid.
2. **Product Detail View (PDP Modal)**: Selecting an item opens a contiguous product inspection panel featuring high-resolution photography, craftsmanship provenance, precious metal specifications, size/finish selectors, and quick-add actions.
3. **Cart Drawer & Multi-Rail Gateway**: A sleek slide-over drawer calculates subtotals, gold-standard complimentary insured shipping, and estimated taxes. Clicking checkout initiates the multi-rail payment modal:
   - *Rail 1: Credit / Debit Card* (Card number formatting, expiry, CVV, and 3D Secure simulation).
   - *Rail 2: Instant Biometric Pay* (Apple Pay / Google Pay simulated one-tap auth).
   - *Rail 3: Vault Settlement / Crypto* (Direct transaction token simulation).
4. **Order Confirmation & Client Receipt**: Instant generation of an official AURA GOLD authenticated purchase receipt with order tracking number, printable invoice summary, and order timeline.
5. **Secure Admin Portal (`/admin` access)**: Discreet master access toggle leading to an authenticated PIN challenge. Once verified, the merchant accesses:
   - *Catalog Manager*: Add new garments/accessories with image URL/asset pickers, edit prices, descriptions, and stock levels, or delete items.
   - *Order Fulfillment & Receipt Tracker*: View every incoming customer transaction, update order states (Pending $\to$ Processing $\to$ Insured Transit $\to$ Delivered), and inspect customer receipts.
   - *Self-Service Diagnostics & Maintenance*: System health monitor, database backup/restore JSON exporter, banner/announcement customizer, and one-click bug-fix patcher.

### Visual Identity & Theme

- **Aesthetic Direction**: Ultra-luxury Parisian haute couture meets contemporary Swiss bullion craftsmanship. Deep obsidian fields, brushed brass & champagne gold accents, subtle glass reflections, and razor-sharp typographic discipline.
- **Color Palette**:
  - *Dominant Canvas (60%)*: Deep obsidian black (`#09090b` to `#0d0d10`) and warm dark carbon (`#141417`).
  - *Structural Surfaces (30%)*: Elevated jet black cards (`#1a1a20`) with delicate hairline borders (`border-amber-500/20` and `border-zinc-800`).
  - *Accent Budget (10%)*: Radiant metallic gold gradients (`from-amber-200 via-yellow-400 to-amber-600`), polished gold button CTAs, and luminous gold hover glows.
- **Typography & Hierarchy**:
  - *Display / Hero / Wordmark*: `Playfair Display` serif for editorial prestige, balanced headline proportions with `text-wrap: balance`.
  - *Body Prose & Controls*: `Plus Jakarta Sans` for effortless readability and crisp navigation links.
  - *Financial & Order Data*: Monospace tabular numerals (`font-mono tabular-nums`) for prices, order IDs, and card fields.
- **Spatial Composition**:
  - Top Bar adhering to the strict 3-zone contract: `[AURA GOLD wordmark]` — `[Collections, Heritage, Atelier, Client Services]` — `[Bag Counter / Client Signet]`.
  - Generous whitespace, zero pill capsules for static tags (clean `·` separated metadata), and no low-contrast ghost cards.

---

## 3. Key Product Decisions & Trade-Offs

- **Role Separation via Master PIN & Session Isolation**:
  - *Decision*: Customers cannot see admin controls or enter admin mode accidentally. A discreet lock button in the footer or a dedicated URL trigger opens a cryptographic PIN modal. Admin privileges are stored in an active session guard.
  - *Why*: Guarantees that clients only experience a seamless shopping environment, while store owners have instant zero-setup administrative authority.
- **Persistent Local Database with Cloud-Ready Schema & Export/Import**:
  - *Decision*: Store products, inventory counts, orders, customer receipts, and system configurations in reactive local storage initialized with high-end designer default items. Include full JSON Backup & Import in the Admin Maintenance tab.
  - *Why*: Instant, zero-friction local testing without requiring external credentials; any merchant edits and added products persist immediately and can be backed up or restored.
- **Integrated High-Resolution Image Assets**:
  - *Decision*: Leverage `generate_image` in parallel batch for signature hero garments and luxury accessories, with robust stylized SVG/CSS fallback placeholders to prevent broken images.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                               AURA GOLD                                │
├──────────────────────────────────┬─────────────────────────────────────┤
│        CUSTOMER STOREFRONT       │         ADMIN CONTROL SUITE         │
│  ┌────────────────────────────┐  │  ┌────────────────────────────────┐ │
│  │ 3-Zone Navigation Header   │  │  │ Master PIN Access Gate         │ │
│  │ Hero Haute Couture Banner  │  │  │ Catalog Manager (CRUD Products)│ │
│  │ Collection Filter Bar      │  │  │ Order Fulfillment & Receipts   │ │
│  │ 3-Col Luxury Product Grid  │  │  │ System Health & Maintenance    │ │
│  │ Product Detail Modal (PDP) │  │  │ Announcement & Banner Editor   │ │
│  │ Slide-over Cart & Multi-   │  │  │ Backup, Restore & Data Patcher │ │
│  │ Rail Payment Gateway       │  │  └────────────────────────────────┘ │
│  │ Verified Customer Receipt  │  │                                     │
│  └────────────────────────────┘  │                                     │
└──────────────────────────────────┴─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   PERSISTENT STORE & DATA ENGINE                       │
│  • Products State (id, title, category, price, image, stock, specs)    │
│  • Orders & Receipts (orderId, customer, items, total, status, rail)   │
│  • Store Config (announcement, currency, taxRate, maintenanceMode)     │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model Entities

- **Product**: `id`, `name`, `category`, `price`, `description`, `details`, `material`, `inStock`, `featured`, `image`
- **CartItem**: `product`, `quantity`, `selectedSize` / `selectedFinish`
- **OrderReceipt**: `id`, `orderNumber`, `createdAt`, `customerName`, `customerEmail`, `shippingAddress`, `items`, `subtotal`, `tax`, `total`, `paymentMethod`, `paymentStatus`, `fulfillmentStatus` (`Pending`, `Processing`, `Insured Transit`, `Delivered`)
- **SystemSettings**: `storeNotice`, `announcementActive`, `taxRate`, `goldExchangeRate`, `adminPin`
