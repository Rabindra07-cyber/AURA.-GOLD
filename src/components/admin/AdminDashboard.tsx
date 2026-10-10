import React, { useState } from 'react';
import { 
  Plus, Edit, Trash2, Eye, ShieldCheck, 
  ArrowLeft, RefreshCw, Download, Upload, Check, AlertTriangle, 
  Tag, Settings, Wrench, Package, ShoppingBag, 
  TrendingUp, Sparkles, X, CheckCircle
} from 'lucide-react';
import { Product, Order, Coupon, StoreSettings, PatchLog } from '../../types';
import { storeStorage, ATELIER_IMAGE_GALLERY } from '../../services/storeStorage';
import { formatNPR } from '../../utils/format';
import brandLogo from '../../assets/images/aura_gold_brand_crest_1791603528570.jpg';

interface AdminDashboardProps {
  onExitAdmin: () => void;
  onViewOrderReceipt: (order: Order) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onExitAdmin,
  onViewOrderReceipt,
}) => {
  // Navigation Tabs
  type AdminTab = 'overview' | 'catalog' | 'orders' | 'coupons' | 'settings' | 'diagnostics';
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Reactive Data
  const [products, setProducts] = useState<Product[]>(storeStorage.getProducts());
  const [orders, setOrders] = useState<Order[]>(storeStorage.getOrders());
  const [coupons, setCoupons] = useState<Coupon[]>(storeStorage.getCoupons());
  const [settings, setSettings] = useState<StoreSettings>(storeStorage.getSettings());
  const [patchLogs, setPatchLogs] = useState<PatchLog[]>(storeStorage.getPatchLogs());

  // Product Add / Edit Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State for Product
  const [prodTitle, setProdTitle] = useState('');
  const [prodCategory, setProdCategory] = useState<'Clothing' | 'Outerwear' | 'Suits & Blazers' | 'Accessories'>('Clothing');
  const [prodPrice, setProdPrice] = useState<number>(150000);
  const [prodComparePrice, setProdComparePrice] = useState<number>(180000);
  const [prodShortDesc, setProdShortDesc] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodStock, setProdStock] = useState<number>(5);
  const [prodImage, setProdImage] = useState<string>('');
  const [prodSku, setProdSku] = useState('');
  const [prodMaterials, setProdMaterials] = useState('');
  const [prodIsFeatured, setProdIsFeatured] = useState(false);

  // Delete Confirmation
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Feedback Notification
  const [notification, setNotification] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Open Product Modal for Add
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdTitle('');
    setProdCategory('Clothing');
    setProdPrice(250000);
    setProdComparePrice(300000);
    setProdShortDesc('');
    setProdDesc('');
    setProdStock(5);
    setProdImage(ATELIER_IMAGE_GALLERY[0].src);
    setProdSku(`AG-CLT-${Math.floor(10 + Math.random() * 90)}`);
    setProdMaterials('Pure Silk Barathea, Gold Thread Accents');
    setProdIsFeatured(false);
    setIsProductModalOpen(true);
  };

  // Open Product Modal for Edit
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdTitle(prod.title);
    setProdCategory(prod.category);
    setProdPrice(prod.price);
    setProdComparePrice(prod.compareAtPrice || 0);
    setProdShortDesc(prod.shortDescription);
    setProdDesc(prod.description);
    setProdStock(prod.stock);
    setProdImage(prod.image);
    setProdSku(prod.sku);
    setProdMaterials(prod.materials.join(', '));
    setProdIsFeatured(prod.isFeatured);
    setIsProductModalOpen(true);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle.trim() || !prodImage) return;

    const materialsArray = prodMaterials
      .split(',')
      .map(m => m.trim())
      .filter(Boolean);

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        title: prodTitle.trim(),
        category: prodCategory,
        price: Number(prodPrice),
        compareAtPrice: prodComparePrice ? Number(prodComparePrice) : undefined,
        shortDescription: prodShortDesc.trim(),
        description: prodDesc.trim(),
        stock: Number(prodStock),
        image: prodImage,
        sku: prodSku.trim(),
        materials: materialsArray.length > 0 ? materialsArray : ['Premium Couture Fabric'],
        isFeatured: prodIsFeatured,
      };
      storeStorage.updateProduct(updated);
      showFeedback(`Updated piece: "${updated.title}"`);
    } else {
      storeStorage.addProduct({
        title: prodTitle.trim(),
        category: prodCategory,
        price: Number(prodPrice),
        compareAtPrice: prodComparePrice ? Number(prodComparePrice) : undefined,
        shortDescription: prodShortDesc.trim(),
        description: prodDesc.trim(),
        stock: Number(prodStock),
        image: prodImage,
        sku: prodSku.trim(),
        materials: materialsArray.length > 0 ? materialsArray : ['Luxury Fabric & Gold Embellishment'],
        features: ['Handcrafted in Atelier', 'Complimentary Bespoke Tailoring'],
        isFeatured: prodIsFeatured,
        deliveryEstimate: '1-3 Business Days Across Nepal',
        options: [{ name: 'Size', values: ['Small', 'Medium', 'Large', 'Custom Fit'] }],
      });
      showFeedback(`Added new piece: "${prodTitle.trim()}"`);
    }

    setProducts(storeStorage.getProducts());
    setIsProductModalOpen(false);
  };

  // Delete Product
  const handleConfirmDelete = () => {
    if (productToDelete) {
      storeStorage.deleteProduct(productToDelete.id);
      setProducts(storeStorage.getProducts());
      showFeedback(`Removed "${productToDelete.title}" from catalog.`);
      setProductToDelete(null);
    }
  };

  // Status Stepper for Orders
  const handleUpdateOrderStatus = (orderId: string, currentStatus: Order['status']) => {
    const statuses: Order['status'][] = ['Pending', 'Processing', 'Insured Transit', 'Delivered'];
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    
    storeStorage.updateOrderStatus(orderId, nextStatus);
    setOrders(storeStorage.getOrders());
    showFeedback(`Order status updated to "${nextStatus}"`);
  };

  // Coupon Creation State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponPercent, setNewCouponPercent] = useState<number>(15);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    storeStorage.addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountPercent: Number(newCouponPercent),
      description: newCouponDesc.trim() || `${newCouponPercent}% Off Privilege`,
      active: true,
    });

    setCoupons(storeStorage.getCoupons());
    setNewCouponCode('');
    setNewCouponDesc('');
    showFeedback(`Created privilege code ${newCouponCode.toUpperCase()}`);
  };

  const handleDeleteCoupon = (id: string) => {
    storeStorage.deleteCoupon(id);
    setCoupons(storeStorage.getCoupons());
    showFeedback('Coupon code removed.');
  };

  // Settings State
  const [tempSettings, setTempSettings] = useState<StoreSettings>(settings);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storeStorage.saveSettings(tempSettings);
    setSettings(tempSettings);
    showFeedback('Store configurations and Nepal tax settings updated.');
  };

  // Self-Repair & Bug Fixer
  const [repairRunning, setRepairRunning] = useState(false);
  const [repairResult, setRepairResult] = useState<string | null>(null);

  const handleRunSelfRepair = () => {
    setRepairRunning(true);
    setTimeout(() => {
      const res = storeStorage.runSelfRepair();
      setProducts(storeStorage.getProducts());
      setCoupons(storeStorage.getCoupons());
      setPatchLogs(storeStorage.getPatchLogs());
      setRepairRunning(false);
      setRepairResult(`Self-Repair Complete: ${res.status}. Fixed ${res.fixedCount} schema anomalies.`);
      showFeedback('Autonomous bug-fix patch executed successfully.');
    }, 1200);
  };

  // JSON Backup & Restore
  const handleExportBackup = () => {
    const jsonStr = storeStorage.exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AURA_GOLD_BACKUP_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showFeedback('Exported full store database to JSON file.');
  };

  const [restoreText, setRestoreText] = useState('');
  const [showRestoreBox, setShowRestoreBox] = useState(false);

  const handleImportBackup = () => {
    if (!restoreText.trim()) return;
    const ok = storeStorage.importBackupJSON(restoreText);
    if (ok) {
      setProducts(storeStorage.getProducts());
      setOrders(storeStorage.getOrders());
      setCoupons(storeStorage.getCoupons());
      setSettings(storeStorage.getSettings());
      setPatchLogs(storeStorage.getPatchLogs());
      setShowRestoreBox(false);
      setRestoreText('');
      showFeedback('Store database restored successfully from JSON.');
    } else {
      alert('Invalid JSON backup file. Please verify format.');
    }
  };

  // Financial Stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const activeStockCount = products.reduce((sum, p) => sum + p.stock, 0);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 pb-16">
      
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-[#101015]/95 backdrop-blur-md border-b border-amber-500/30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-amber-400 p-0.5">
            <img src={brandLogo} alt="AURA GOLD" className="w-full h-full object-cover rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-base font-bold gold-text-gradient uppercase tracking-widest">
                AURA GOLD
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-mono border border-amber-400/30 uppercase">
                Owner Portal
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Private Boutique Management · Currency: NPR (रु.)
            </p>
          </div>
        </div>

        {/* Exit Admin Mode */}
        <button
          onClick={onExitAdmin}
          className="px-3.5 py-2 rounded-lg bg-[#181822] hover:bg-[#20202c] border border-amber-500/30 text-amber-200 hover:text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Customer Storefront</span>
        </button>
      </header>

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161622] border border-amber-400/80 text-amber-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-medium animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-4">
          {[
            { id: 'overview', label: 'Overview & Analytics', icon: TrendingUp },
            { id: 'catalog', label: 'Clothing & Accessories', icon: Package, badge: products.length },
            { id: 'orders', label: 'Order Fulfillment & Receipts', icon: ShoppingBag, badge: orders.length },
            { id: 'coupons', label: 'VIP Privileges & Coupons', icon: Tag },
            { id: 'settings', label: 'Store & Nepal VAT Settings', icon: Settings },
            { id: 'diagnostics', label: 'Bug Fixer & Self-Repair', icon: Wrench },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-400/20 to-yellow-500/10 border border-amber-400 text-amber-300 shadow-md shadow-amber-500/10'
                    : 'bg-[#121218] border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* KPI Cards Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-[#121218] rounded-xl border border-amber-500/20 space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
                  Gross Revenue (NPR)
                </span>
                <div className="font-mono text-2xl font-bold gold-text-gradient tabular-nums">
                  {formatNPR(totalRevenue)}
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span>From {orders.length} verified transactions</span>
                </div>
              </div>

              <div className="p-5 bg-[#121218] rounded-xl border border-zinc-800 space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
                  Active Wardrobe Pieces
                </span>
                <div className="font-mono text-2xl font-bold text-white tabular-nums">
                  {products.length} Products
                </div>
                <div className="text-[11px] text-zinc-400">
                  {activeStockCount} units available in inventory
                </div>
              </div>

              <div className="p-5 bg-[#121218] rounded-xl border border-zinc-800 space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
                  Nepal Tax Invoices (13% VAT)
                </span>
                <div className="font-mono text-2xl font-bold text-amber-300 tabular-nums">
                  {formatNPR(orders.reduce((s, o) => s + o.tax, 0))}
                </div>
                <div className="text-[11px] text-zinc-400 font-mono">
                  PAN: 601984210 compliant
                </div>
              </div>

              <div className="p-5 bg-[#121218] rounded-xl border border-zinc-800 space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
                  Nepali Payment Rails
                </span>
                <div className="font-mono text-sm font-semibold text-emerald-400 mt-1">
                  eSewa · Khalti · Fonepay
                </div>
                <div className="text-[11px] text-zinc-400">
                  All 12 commercial banks active
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Recent Orders Preview */}
              <div className="lg:col-span-8 bg-[#121218] rounded-xl border border-zinc-800 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-cinzel text-base font-bold text-white uppercase tracking-wider">
                    Recent Customer Transactions
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-amber-300 hover:underline uppercase tracking-wider font-semibold cursor-pointer"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="divide-y divide-zinc-800">
                  {orders.slice(0, 4).map((ord) => (
                    <div key={ord.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                      <div>
                        <div className="font-semibold text-zinc-200">{ord.customerName}</div>
                        <div className="text-[11px] text-zinc-500 font-mono">
                          {ord.orderNumber} · {new Date(ord.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-bold text-amber-300 tabular-nums">
                          {formatNPR(ord.total)}
                        </div>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                          {ord.paymentRail} · {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Catalog Shortcuts */}
              <div className="lg:col-span-4 bg-[#121218] rounded-xl border border-zinc-800 p-6 space-y-4">
                <h3 className="font-cinzel text-base font-bold text-white uppercase tracking-wider">
                  Catalog Quick Ingestion
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Add custom clothing designs, tailored evening gowns, silk jackets, or wardrobe accessories in seconds.
                </p>

                <button
                  onClick={handleOpenAddProduct}
                  className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-[#09090b] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 gold-glow cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Ingest New Garment</span>
                </button>

                <div className="pt-2 border-t border-zinc-800 space-y-2 text-xs text-zinc-400">
                  <div className="flex justify-between">
                    <span>Haute Couture Suits</span>
                    <span className="font-mono text-zinc-200">{products.filter(p => p.category === 'Suits & Blazers').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Evening Dresses & Gowns</span>
                    <span className="font-mono text-zinc-200">{products.filter(p => p.category === 'Clothing').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Outerwear & Coats</span>
                    <span className="font-mono text-zinc-200">{products.filter(p => p.category === 'Outerwear').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Designer Accessories</span>
                    <span className="font-mono text-zinc-200">{products.filter(p => p.category === 'Accessories').length}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: CLOTHING & ACCESSORIES CATALOG MANAGER */}
        {activeTab === 'catalog' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121218] p-4 sm:p-6 rounded-xl border border-zinc-800">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-white uppercase tracking-wider">
                  Clothing & Accessories Catalog ({products.length})
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Add, update or remove items easily. Only garments and accessories are offered.
                </p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="px-5 py-3 rounded-lg bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-[#09090b] font-bold text-xs uppercase tracking-wider flex items-center gap-2 gold-glow cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-[#121218] rounded-xl border border-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#181822] text-zinc-400 uppercase font-mono text-[11px] border-b border-zinc-800">
                    <tr>
                      <th className="p-4">Piece Preview</th>
                      <th className="p-4">Title & SKU</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price (NPR)</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Featured</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="p-4">
                          <div className="w-14 h-14 rounded bg-[#0d0d10] overflow-hidden border border-zinc-700">
                            <img 
                              src={prod.image} 
                              alt={prod.title} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="font-semibold text-zinc-100 max-w-xs">{prod.title}</div>
                          <div className="font-mono text-[11px] text-zinc-500 mt-0.5">{prod.sku}</div>
                        </td>

                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded bg-[#181822] text-amber-300 font-mono text-[10px] border border-amber-500/20 uppercase">
                            {prod.category}
                          </span>
                        </td>

                        <td className="p-4 font-mono font-bold text-amber-300 tabular-nums">
                          {formatNPR(prod.price)}
                          {prod.compareAtPrice && (
                            <div className="text-[10px] text-zinc-500 line-through">
                              {formatNPR(prod.compareAtPrice)}
                            </div>
                          )}
                        </td>

                        <td className="p-4">
                          <span className={`font-mono font-semibold ${prod.stock <= 2 ? 'text-rose-400' : 'text-zinc-300'}`}>
                            {prod.stock} in stock
                          </span>
                        </td>

                        <td className="p-4">
                          {prod.isFeatured ? (
                            <span className="text-[10px] text-amber-300 font-semibold flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              <span>Signature</span>
                            </span>
                          ) : (
                            <span className="text-zinc-600">—</span>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="p-2 rounded bg-[#1c1c26] text-amber-300 hover:bg-[#252534] transition-colors cursor-pointer"
                              title="Edit Garment"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setProductToDelete(prod)}
                              className="p-2 rounded bg-[#1c1c26] text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                              title="Remove Piece"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: ORDER FULFILLMENT & RECEIPTS */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="bg-[#121218] p-6 rounded-xl border border-zinc-800">
              <h3 className="font-cinzel text-lg font-bold text-white uppercase tracking-wider">
                Order Fulfillment Pipeline & Invoices
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Real-time transactions paid via eSewa, Khalti, Fonepay, and Nepali Commercial Banks. Click status to advance stage.
              </p>
            </div>

            <div className="space-y-4">
              {orders.map((ord) => (
                <div key={ord.id} className="p-5 bg-[#121218] rounded-xl border border-zinc-800 hover:border-amber-500/30 transition-all space-y-4">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-amber-300">
                          {ord.orderNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20 uppercase">
                          PAID ({ord.paymentRail.toUpperCase()})
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        Client: <strong className="text-zinc-200">{ord.customerName}</strong> ({ord.customerEmail} · {ord.shippingAddress.phone})
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-mono text-base font-bold gold-text-gradient tabular-nums">
                          {formatNPR(ord.total)}
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono">
                          VAT 13%: {formatNPR(ord.tax)}
                        </div>
                      </div>

                      {/* Status Stepper Button */}
                      <button
                        onClick={() => handleUpdateOrderStatus(ord.id, ord.status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer border transition-all ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                            : ord.status === 'Insured Transit'
                            ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                            : 'bg-blue-500/15 border-blue-500/50 text-blue-300'
                        }`}
                        title="Click to advance status"
                      >
                        Status: {ord.status} ↻
                      </button>

                      {/* View Official Invoice */}
                      <button
                        onClick={() => onViewOrderReceipt(ord)}
                        className="px-3 py-1.5 rounded-lg bg-[#1c1c28] hover:bg-[#252536] border border-amber-500/40 text-amber-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Tax Invoice</span>
                      </button>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 p-2 bg-[#171720] rounded-lg border border-zinc-800">
                        <img src={item.image} alt={item.title} className="w-10 h-10 rounded object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-zinc-200 truncate">{item.title}</p>
                          <p className="text-[11px] text-amber-400 font-mono">
                            Qty {item.quantity} · {formatNPR(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-[11px] text-zinc-500 flex items-center justify-between pt-1">
                    <span>Delivery Address: {ord.shippingAddress.address}, {ord.shippingAddress.city}</span>
                    <span className="font-mono text-[10px]">Token: {ord.receiptToken}</span>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 4: COUPONS & VIP PRIVILEGES */}
        {activeTab === 'coupons' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
            
            {/* Create Coupon Form */}
            <div className="lg:col-span-5 bg-[#121218] p-6 rounded-xl border border-zinc-800 space-y-4">
              <h3 className="font-cinzel text-base font-bold text-white uppercase tracking-wider">
                Issue VIP Privilege Code
              </h3>
              
              <form onSubmit={handleAddCoupon} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1">Coupon Code (Uppercase)</label>
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. DASHAIN25"
                    className="w-full bg-[#181822] border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Discount Percentage (%)</label>
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={newCouponPercent}
                    onChange={(e) => setNewCouponPercent(Number(e.target.value))}
                    className="w-full bg-[#181822] border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Description / Benefit Title</label>
                  <input
                    type="text"
                    value={newCouponDesc}
                    onChange={(e) => setNewCouponDesc(e.target.value)}
                    placeholder="e.g. Festival Season 25% Off Storewide"
                    className="w-full bg-[#181822] border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-[#09090b] font-bold uppercase tracking-wider gold-glow cursor-pointer"
                >
                  Create Privilege Code
                </button>
              </form>
            </div>

            {/* Existing Coupons List */}
            <div className="lg:col-span-7 bg-[#121218] p-6 rounded-xl border border-zinc-800 space-y-4">
              <h3 className="font-cinzel text-base font-bold text-white uppercase tracking-wider">
                Active Atelier Privilege Codes ({coupons.length})
              </h3>

              <div className="space-y-3">
                {coupons.map((cpn) => (
                  <div key={cpn.id} className="p-4 bg-[#181824] rounded-lg border border-zinc-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-amber-300">
                          {cpn.code}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 text-[10px] font-mono">
                          {cpn.discountPercent ? `${cpn.discountPercent}% OFF` : `${formatNPR(cpn.discountAmount || 0)} OFF`}
                        </span>
                      </div>
                      <p className="text-zinc-400 mt-1">{cpn.description}</p>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                        Applied {cpn.usesCount} times
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteCoupon(cpn.id)}
                      className="p-2 text-zinc-500 hover:text-rose-400 cursor-pointer"
                      title="Delete code"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: STORE & NEPAL VAT CONFIG */}
        {activeTab === 'settings' && (
          <div className="bg-[#121218] p-6 sm:p-8 rounded-xl border border-zinc-800 space-y-6 animate-fadeIn max-w-3xl">
            <div>
              <h3 className="font-cinzel text-lg font-bold text-white uppercase tracking-wider">
                Store Configurations & Nepal Compliance
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Customize store announcements, VAT tax rates, concierge contacts, and Master Admin PIN.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-1">Store Name</label>
                  <input
                    type="text"
                    value={tempSettings.storeName}
                    onChange={(e) => setTempSettings({ ...tempSettings, storeName: e.target.value })}
                    className="w-full bg-[#181822] border border-zinc-700 rounded-lg px-3 py-2 text-white font-cinzel focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Government VAT / PAN Registration</label>
                  <input
                    type="text"
                    value={tempSettings.vatPanNumber}
                    onChange={(e) => setTempSettings({ ...tempSettings, vatPanNumber: e.target.value })}
                    className="w-full bg-[#181822] border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Nepal VAT Rate (Default 13% = 0.13)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={tempSettings.taxRate}
                    onChange={(e) => setTempSettings({ ...tempSettings, taxRate: Number(e.target.value) })}
                    className="w-full bg-[#181822] border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Owner Master Access PIN</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={tempSettings.adminPin}
                    onChange={(e) => setTempSettings({ ...tempSettings, adminPin: e.target.value })}
                    className="w-full bg-[#181822] border border-amber-500/50 rounded-lg px-3 py-2 text-amber-300 font-mono tracking-widest focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Concierge Hotline (Nepal)</label>
                  <input
                    type="text"
                    value={tempSettings.supportPhone}
                    onChange={(e) => setTempSettings({ ...tempSettings, supportPhone: e.target.value })}
                    className="w-full bg-[#181822] border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Concierge Email</label>
                  <input
                    type="email"
                    value={tempSettings.supportEmail}
                    onChange={(e) => setTempSettings({ ...tempSettings, supportEmail: e.target.value })}
                    className="w-full bg-[#181822] border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Top Announcement Ticker Text</label>
                <textarea
                  rows={2}
                  value={tempSettings.announcement}
                  onChange={(e) => setTempSettings({ ...tempSettings, announcement: e.target.value })}
                  className="w-full bg-[#181822] border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-lg bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-[#09090b] font-bold uppercase tracking-wider gold-glow cursor-pointer"
              >
                Save Settings
              </button>
            </form>
          </div>
        )}

        {/* TAB 6: SYSTEM DIAGNOSTICS & BUG FIXER */}
        {activeTab === 'diagnostics' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Self-Repair & Maintenance Tools */}
              <div className="lg:col-span-6 bg-[#121218] p-6 rounded-xl border border-zinc-800 space-y-6">
                <div>
                  <h3 className="font-cinzel text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-amber-400" />
                    <span>Autonomous Self-Repair & Bug Fixer</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    You can inspect store state, resolve database bugs, normalize NPR currency invariants, and apply updates on your own with zero coding.
                  </p>
                </div>

                {/* Run Self Repair Button */}
                <div className="p-4 bg-[#181824] rounded-lg border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-xs text-zinc-200">System Consistency Scanner</h4>
                      <p className="text-[11px] text-zinc-400">Heals catalog schema, broken links, and price invariants.</p>
                    </div>
                    <button
                      onClick={handleRunSelfRepair}
                      disabled={repairRunning}
                      className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-[#09090b] font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer gold-glow disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${repairRunning ? 'animate-spin' : ''}`} />
                      <span>{repairRunning ? 'Scanning...' : 'Run Self-Repair'}</span>
                    </button>
                  </div>

                  {repairResult && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded text-xs text-emerald-300 flex items-center gap-2">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>{repairResult}</span>
                    </div>
                  )}
                </div>

                {/* Backup & Restore JSON */}
                <div className="p-4 bg-[#181824] rounded-lg border border-zinc-800 space-y-3">
                  <h4 className="font-semibold text-xs text-zinc-200">Database Backup & Portability</h4>
                  <p className="text-[11px] text-zinc-400">
                    Export your complete clothing inventory, orders, customer logs, and settings to a JSON archive.
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={handleExportBackup}
                      className="flex-1 py-2.5 px-3 rounded-lg bg-[#20202c] hover:bg-[#282838] border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Backup JSON</span>
                    </button>

                    <button
                      onClick={() => setShowRestoreBox(!showRestoreBox)}
                      className="flex-1 py-2.5 px-3 rounded-lg bg-[#20202c] hover:bg-[#282838] border border-zinc-700 text-zinc-300 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Restore from JSON</span>
                    </button>
                  </div>

                  {showRestoreBox && (
                    <div className="space-y-2 pt-2 border-t border-zinc-800">
                      <label className="block text-[11px] text-zinc-400">Paste Backup JSON Content:</label>
                      <textarea
                        rows={4}
                        value={restoreText}
                        onChange={(e) => setRestoreText(e.target.value)}
                        placeholder='{"products": [...], "orders": [...]}'
                        className="w-full bg-[#101015] border border-zinc-700 rounded-lg p-2.5 font-mono text-[10px] text-zinc-200 focus:outline-none focus:border-amber-400"
                      />
                      <button
                        onClick={handleImportBackup}
                        className="w-full py-2 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase cursor-pointer"
                      >
                        Restore Store Data
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column: Update Changelog */}
              <div className="lg:col-span-6 bg-[#121218] p-6 rounded-xl border border-zinc-800 space-y-4">
                <h3 className="font-cinzel text-base font-bold text-white uppercase tracking-wider">
                  System Update & Patch History
                </h3>
                <p className="text-xs text-zinc-400">
                  Autonomous diagnostic log tracking applied atelier updates and security patches.
                </p>

                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                  {patchLogs.map((patch) => (
                    <div key={patch.id} className="p-3.5 bg-[#171722] rounded-lg border border-zinc-800 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-amber-300">{patch.title}</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                          {patch.version}
                        </span>
                      </div>
                      <p className="text-zinc-400 text-[11px] leading-relaxed">{patch.description}</p>
                      <div className="text-[10px] text-zinc-500 font-mono pt-1">
                        Applied at {patch.timestamp} · Type: {patch.type.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* PRODUCT ADD / EDIT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-[#111116] w-full max-w-2xl rounded-2xl border border-amber-500/40 p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-cinzel text-lg font-bold text-white uppercase tracking-wider">
                {editingProduct ? 'Edit Clothing / Accessory' : 'Add New Clothing / Accessory'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-zinc-400 hover:text-amber-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-zinc-400 mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={prodTitle}
                    onChange={(e) => setProdTitle(e.target.value)}
                    placeholder="e.g. Royal Gilded Silk Evening Caftan"
                    className="w-full bg-[#181822] border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Category (Clothing & Accessories Only)</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as any)}
                    className="w-full bg-[#181822] border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Clothing">Clothing (Dresses & Couture)</option>
                    <option value="Suits & Blazers">Suits & Blazers</option>
                    <option value="Outerwear">Outerwear & Coats</option>
                    <option value="Accessories">Accessories (Belts, Clutches, Scarves)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">SKU / Item Identifier</label>
                  <input
                    type="text"
                    required
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                    className="w-full bg-[#181822] border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Price in NPR (रु.)</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full bg-[#181822] border border-zinc-700 rounded-lg px-3 py-2 text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Compare At / Original Price (NPR)</label>
                  <input
                    type="number"
                    min={0}
                    value={prodComparePrice}
                    onChange={(e) => setProdComparePrice(Number(e.target.value))}
                    className="w-full bg-[#181822] border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Inventory Stock Units</label>
                  <input
                    type="number"
                    min={0}
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full bg-[#181822] border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Materials (comma separated)</label>
                  <input
                    type="text"
                    value={prodMaterials}
                    onChange={(e) => setProdMaterials(e.target.value)}
                    placeholder="Pure Silk, 24K Gold Wire, Horn Buttons"
                    className="w-full bg-[#181822] border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-zinc-400 mb-1">Select Cover Image from Atelier Gallery or Enter URL</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
                    {ATELIER_IMAGE_GALLERY.map((gal, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setProdImage(gal.src)}
                        className={`aspect-square rounded border overflow-hidden cursor-pointer ${
                          prodImage === gal.src ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-zinc-700'
                        }`}
                        title={gal.name}
                      >
                        <img src={gal.src} alt={gal.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    required
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                    placeholder="Custom Image URL..."
                    className="w-full bg-[#181822] border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono text-[11px] focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-zinc-400 mb-1">Short One-Line Summary</label>
                  <input
                    type="text"
                    value={prodShortDesc}
                    onChange={(e) => setProdShortDesc(e.target.value)}
                    placeholder="Brief description for storefront card"
                    className="w-full bg-[#181822] border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-zinc-400 mb-1">Comprehensive Craftsmanship Details</label>
                  <textarea
                    rows={3}
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    placeholder="Sartorial notes, silhouette cut, lining, atelier provenance..."
                    className="w-full bg-[#181822] border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="featuredCheck"
                    checked={prodIsFeatured}
                    onChange={(e) => setProdIsFeatured(e.target.checked)}
                    className="rounded border-zinc-700 text-amber-500 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="featuredCheck" className="text-zinc-300 cursor-pointer">
                    Highlight as Signature Piece on Storefront
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-[#09090b] font-bold uppercase tracking-wider gold-glow cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Publish to Store'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#15151c] rounded-xl border border-rose-500/40 p-6 max-w-sm w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-cinzel text-base font-bold text-white">Remove Product?</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Are you sure you want to remove <strong className="text-zinc-200">"{productToDelete.title}"</strong> from the AURA GOLD catalog?
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
