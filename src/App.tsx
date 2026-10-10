import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { PayhipCheckoutModal } from './components/PayhipCheckoutModal';
import { OrderReceiptModal } from './components/OrderReceiptModal';
import { Footer } from './components/Footer';
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Product, CartItem, Order, StoreSettings } from './types';
import { storeStorage } from './services/storeStorage';
import marbleBg from './assets/images/aura_gold_marble_bg_1791603517277.jpg';
import brandLogo from './assets/images/aura_gold_brand_crest_1791603528570.jpg';
import { Sparkles, Crown, ShieldCheck, Check } from 'lucide-react';

export default function App() {
  // Store Data
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(storeStorage.getSettings());
  const [cart, setCart] = useState<CartItem[]>([]);

  // Navigation & Filtering
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutConfig, setCheckoutConfig] = useState<{
    isOpen: boolean;
    singleProduct?: { product: Product; selectedOption?: string };
    useCart?: boolean;
  }>({ isOpen: false });
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Admin Access Gate
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);

  // Initialize Data
  useEffect(() => {
    setProducts(storeStorage.getProducts());
    setSettings(storeStorage.getSettings());
  }, [isAdminAuthenticated]);

  // Cart Handlers
  const handleAddToCart = (product: Product, selectedOption?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedOption === selectedOption
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += 1;
        return next;
      }
      return [...prev, { product, quantity: 1, selectedOption }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Instant "Buy Now" Payhip Trigger
  const handleQuickBuy = (product: Product, selectedOption?: string) => {
    setInspectingProduct(null);
    setCheckoutConfig({
      isOpen: true,
      singleProduct: { product, selectedOption },
      useCart: false,
    });
  };

  // Cart Checkout Trigger
  const handleCartCheckout = () => {
    setIsCartOpen(false);
    setCheckoutConfig({
      isOpen: true,
      useCart: true,
    });
  };

  // Order Placement Success
  const handleOrderSuccess = (order: Order) => {
    setCheckoutConfig({ isOpen: false });
    // Clear cart if checkout was from cart
    if (checkoutConfig.useCart) {
      setCart([]);
    }
    setConfirmedOrder(order);
    // Refresh products stock
    setProducts(storeStorage.getProducts());
  };

  // Filter Products
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // If in Admin Mode, render the full admin dashboard
  if (isAdminAuthenticated) {
    return (
      <AdminDashboard
        onExitAdmin={() => {
          setIsAdminAuthenticated(false);
          setProducts(storeStorage.getProducts());
          setSettings(storeStorage.getSettings());
        }}
        onViewOrderReceipt={(order) => setConfirmedOrder(order)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Header */}
      <Header
        settings={settings}
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAdminAuth={() => setIsAdminAuthModalOpen(true)}
      />

      {/* Hero Showcase (only on All and no search) */}
      {selectedCategory === 'All' && !searchQuery && (
        <HeroBanner
          onExploreCollection={() => {
            const el = document.getElementById('catalog-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onQuickBuyFeatured={() => {
            const signature = products.find((p) => p.isFeatured) || products[0];
            if (signature) setInspectingProduct(signature);
          }}
        />
      )}

      {/* Main Store Catalog Section */}
      <main id="catalog-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Category & Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{selectedCategory} Collection</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white tracking-wide">
              {selectedCategory === 'All'
                ? 'Haute Couture & Accessories'
                : selectedCategory}
            </h2>
          </div>

          <div className="text-xs text-zinc-400 font-mono">
            Showing <strong className="text-amber-300">{filteredProducts.length}</strong> authenticated pieces
            {searchQuery && (
              <span> for "<span className="text-white">{searchQuery}</span>"</span>
            )}
          </div>
        </div>

        {/* 3-Column Luxury Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-[#111116] rounded-2xl border border-zinc-800 p-8">
            <div className="w-16 h-16 rounded-full bg-[#181822] text-amber-400 mx-auto flex items-center justify-center border border-amber-500/20">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="font-cinzel text-xl text-zinc-200">No Matching Pieces in Atelier</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              We couldn't find pieces matching "{searchQuery}". Try selecting another category or clear your search filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-[#09090b] text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickBuy={(p) => handleQuickBuy(p)}
                onInspect={(p) => setInspectingProduct(p)}
                onAddToCart={(p) => handleAddToCart(p)}
              />
            ))}
          </div>
        )}

        {/* User Theme Feature Section: Dark Marble & Flowing Gold Aesthetic */}
        <section className="relative mt-16 rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl shadow-black">
          {/* Marble Background Texture */}
          <div className="absolute inset-0 z-0">
            <img 
              src={marbleBg} 
              alt="AURA GOLD Silk & Marble Texture" 
              className="w-full h-full object-cover object-center filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/90" />
          </div>

          <div className="relative z-10 p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
            
            <div className="max-w-xl space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-amber-300 font-semibold">
                <Crown className="w-4 h-4 text-amber-400 fill-current" />
                <span>The Sovereign Philosophy</span>
              </div>

              <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                Crafted for Discretion, Gilded with <span className="gold-text-gradient">Pure Distinction</span>
              </h2>

              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-light">
                Every AURA GOLD garment begins with hand-woven obsidian silks, bespoke tailoring, and genuine 
                gold-embellished accents. Hand-delivered via armored courier across Nepal with official VAT tax compliance.
              </p>

              {/* User's Verified Slogan */}
              <div className="pt-2 flex items-center gap-3">
                <div className="text-xs uppercase tracking-[0.25em] text-amber-200 font-mono font-medium">
                  SAME VIBE · BETTER TOGETHER
                </div>
              </div>
            </div>

            {/* Circular Crest Badge */}
            <div className="shrink-0 flex flex-col items-center">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-amber-400 shadow-2xl shadow-amber-500/25 p-0.5 bg-gradient-to-br from-amber-200 via-amber-500 to-yellow-700">
                <img 
                  src={brandLogo} 
                  alt="AURA GOLD Official Circular Crest" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="font-cinzel text-xs text-amber-300 font-bold uppercase tracking-widest mt-3">
                Atelier Geneva & Nepal
              </span>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer
        onOpenAdminAuth={() => setIsAdminAuthModalOpen(true)}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* PDP Modal */}
      <ProductDetailModal
        product={inspectingProduct}
        onClose={() => setInspectingProduct(null)}
        onQuickBuy={(prod, opt) => handleQuickBuy(prod, opt)}
        onAddToCart={(prod, opt) => handleAddToCart(prod, opt)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCartCheckout}
      />

      {/* Payhip Multi-Rail Checkout Modal */}
      <PayhipCheckoutModal
        isOpen={checkoutConfig.isOpen}
        onClose={() => setCheckoutConfig({ isOpen: false })}
        singleProduct={checkoutConfig.singleProduct}
        cartItems={checkoutConfig.useCart ? cart : undefined}
        onSuccess={handleOrderSuccess}
      />

      {/* Order Confirmation & VAT Receipt Modal */}
      <OrderReceiptModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
      />

      {/* Admin Access Modal (PIN Gate) */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onAuthenticated={() => {
          setIsAdminAuthModalOpen(false);
          setIsAdminAuthenticated(true);
        }}
        correctPin={settings.adminPin}
      />

    </div>
  );
}
