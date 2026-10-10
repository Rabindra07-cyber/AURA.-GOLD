import React, { useState } from 'react';
import { 
  X, Check, ShieldCheck, QrCode, CreditCard, 
  Smartphone, Building2, Tag, Loader2, Sparkles, AlertCircle 
} from 'lucide-react';
import { Product, CartItem, Order, Coupon, NepaliPaymentRail } from '../types';
import { NEPALI_COMMERCIAL_BANKS, storeStorage } from '../services/storeStorage';
import { formatNPR } from '../utils/format';
import brandLogo from '../assets/images/aura_gold_brand_crest_1791603528570.jpg';

interface PayhipCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Can checkout either single piece or cart items
  singleProduct?: { product: Product; selectedOption?: string };
  cartItems?: CartItem[];
  onSuccess: (order: Order) => void;
}

export const PayhipCheckoutModal: React.FC<PayhipCheckoutModalProps> = ({
  isOpen,
  onClose,
  singleProduct,
  cartItems,
  onSuccess,
}) => {
  if (!isOpen) return null;

  // Compile items being checked out
  const itemsToBuy: {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    selectedOption?: string;
    image: string;
  }[] = singleProduct
    ? [
        {
          productId: singleProduct.product.id,
          title: singleProduct.product.title,
          price: singleProduct.product.price,
          quantity: 1,
          selectedOption: singleProduct.selectedOption,
          image: singleProduct.product.image,
        },
      ]
    : (cartItems || []).map((ci) => ({
        productId: ci.product.id,
        title: ci.product.title,
        price: ci.product.price,
        quantity: ci.quantity,
        selectedOption: ci.selectedOption,
        image: ci.product.image,
      }));

  const subtotal = itemsToBuy.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('98');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('Kathmandu');
  const [province, setProvince] = useState('Bagmati Province');

  // Coupon State
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Payment Rail Selection
  const [paymentRail, setPaymentRail] = useState<NepaliPaymentRail>('esewa');
  const [selectedBankId, setSelectedBankId] = useState('nabil');
  
  // Specific Rail Fields
  const [esewaId, setEsewaId] = useState('9851023456');
  const [esewaPin, setEsewaPin] = useState('1234');
  const [khaltiId, setKhaltiId] = useState('9841098765');
  const [khaltiPin, setKhaltiPin] = useState('4321');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('789');

  // Process / Execution State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [errorNotice, setErrorNotice] = useState('');

  // Calculate Discounts & Taxes
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAmount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountAmount) {
      discountAmount = appliedCoupon.discountAmount;
    }
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const vatRate = 0.13; // 13% Nepal VAT
  const vatAmount = Math.round(taxableAmount * vatRate);
  const finalTotal = taxableAmount + vatAmount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const cleanCode = couponCodeInput.trim().toUpperCase();
    if (!cleanCode) return;

    const availableCoupons = storeStorage.getCoupons();
    const found = availableCoupons.find((c) => c.code.toUpperCase() === cleanCode && c.active);

    if (!found) {
      setCouponError('Invalid coupon code. Try code AURAGOLD20 for 20% off.');
      return;
    }

    if (found.minSpend && subtotal < found.minSpend) {
      setCouponError(`This privilege requires a minimum purchase of ${formatNPR(found.minSpend)}`);
      return;
    }

    setAppliedCoupon(found);
    setCouponSuccess(`Privilege Applied: ${found.description}`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput('');
    setCouponSuccess('');
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice('');

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      setErrorNotice('Please fill in your recipient name, email, phone number, and delivery address.');
      return;
    }

    setIsProcessing(true);
    setProcessingStage('Connecting to Nepal Clearing House Gateway...');

    setTimeout(() => {
      if (paymentRail === 'esewa') {
        setProcessingStage('Authenticating eSewa Wallet & Securing MPIN...');
      } else if (paymentRail === 'khalti') {
        setProcessingStage('Verifying Khalti OTP & Instant Token...');
      } else if (paymentRail === 'fonepay') {
        setProcessingStage('Validating Fonepay Interbank Dynamic QR Signature...');
      } else if (paymentRail === 'nepal_bank') {
        const bank = NEPALI_COMMERCIAL_BANKS.find(b => b.id === selectedBankId);
        setProcessingStage(`Debiting ${bank ? bank.name : 'Commercial Bank'} Mobile Banking Account...`);
      } else {
        setProcessingStage('Authorizing SCT / Visa 3D Secure Verification...');
      }
    }, 900);

    setTimeout(() => {
      setProcessingStage('Issuing Government of Nepal VAT Tax Invoice...');
    }, 1800);

    setTimeout(() => {
      const selectedBank = NEPALI_COMMERCIAL_BANKS.find(b => b.id === selectedBankId);
      
      const newOrder = storeStorage.createOrder({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        shippingAddress: {
          fullName: customerName.trim(),
          email: customerEmail.trim(),
          phone: customerPhone.trim(),
          address: shippingAddress.trim(),
          city,
          postalCode: '44600',
          province,
        },
        items: itemsToBuy,
        subtotal,
        discount: discountAmount,
        couponCode: appliedCoupon?.code,
        tax: vatAmount,
        shipping: 0, // Free insured delivery in Nepal
        total: finalTotal,
        paymentRail,
        bankName: paymentRail === 'nepal_bank' ? `${selectedBank?.name} (${selectedBank?.nepaliName})` : undefined,
        nepaliWalletId: paymentRail === 'esewa' ? esewaId : paymentRail === 'khalti' ? khaltiId : undefined,
        status: 'Processing',
      });

      setIsProcessing(false);
      onSuccess(newOrder);
    }, 2600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      
      {/* Payhip Card Container with Dark & Gold Luxury Styling */}
      <div 
        className="relative bg-[#111116] w-full max-w-2xl rounded-2xl border border-amber-500/35 shadow-2xl shadow-black overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#181820] via-[#1e1e28] to-[#181820] border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-amber-400/60 shadow-md">
              <img src={brandLogo} alt="AURA GOLD" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-base font-bold gold-text-gradient tracking-widest uppercase">
                  AURA GOLD
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 font-mono border border-amber-400/25">
                  PAYHIP CHECKOUT
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Official Nepal Payment Gateway · 256-Bit Encrypted
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close checkout"
            className="p-1.5 rounded-full text-zinc-400 hover:text-amber-300 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 z-30 bg-[#09090b]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-amber-400 animate-spin" />
              <Sparkles className="w-5 h-5 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="font-cinzel text-lg text-white font-bold gold-text-gradient">
                Processing Transaction
              </h3>
              <p className="text-xs text-amber-200/90 font-mono tracking-wide">
                {processingStage}
              </p>
              <p className="text-[11px] text-zinc-500">
                Please do not refresh the page
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleProcessPayment} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Order Summary Item Row */}
          <div className="bg-[#171720] rounded-xl p-4 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-2">
              <span className="uppercase tracking-wider font-semibold">Clothing & Accessories Summary</span>
              <span className="font-mono text-amber-300 font-medium">{itemsToBuy.length} {itemsToBuy.length === 1 ? 'Piece' : 'Pieces'}</span>
            </div>

            <div className="space-y-2.5 max-h-36 overflow-y-auto pr-1">
              {itemsToBuy.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-10 h-10 rounded object-cover border border-zinc-700 shrink-0" 
                    />
                    <div className="min-w-0">
                      <div className="font-medium text-zinc-200 truncate">{item.title}</div>
                      <div className="text-[11px] text-zinc-500">
                        Qty: {item.quantity} {item.selectedOption ? `· ${item.selectedOption}` : ''}
                      </div>
                    </div>
                  </div>
                  <div className="font-mono text-zinc-200 font-semibold tabular-nums shrink-0">
                    {formatNPR(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Privilege / Coupon Applicator */}
            <div className="pt-2 border-t border-zinc-800/80">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2 text-xs">
                  <div className="flex items-center gap-2 text-amber-300 font-medium">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{appliedCoupon.code} applied ({appliedCoupon.description})</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-zinc-400 hover:text-rose-400 text-xs font-semibold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      placeholder="Discount / Privilege Code (e.g. AURAGOLD20)"
                      className="w-full bg-[#101015] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400 uppercase font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-[#20202a] hover:bg-[#282836] border border-amber-500/40 text-amber-300 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              )}

              {couponError && (
                <p className="text-[11px] text-rose-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{couponError}</span>
                </p>
              )}
              {couponSuccess && (
                <p className="text-[11px] text-emerald-400 mt-1.5 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>{couponSuccess}</span>
                </p>
              )}
            </div>
          </div>

          {/* Customer & Delivery Form in Nepal */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-amber-300 flex items-center gap-2">
              <span>Recipient & Delivery Coordinates (Nepal)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Prashant Bikram Shah"
                  className="w-full bg-[#15151c] border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Email for Official Receipt & PAN Invoice</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. prashant@himalayan.com.np"
                  className="w-full bg-[#15151c] border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Mobile Number (Nepal)</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 9851023456"
                  className="w-full bg-[#15151c] border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">City / Region</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#15151c] border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="Kathmandu">Kathmandu (काठमाडौं)</option>
                  <option value="Lalitpur">Lalitpur / Patan (ललितपुर)</option>
                  <option value="Bhaktapur">Bhaktapur (भक्तपुर)</option>
                  <option value="Pokhara">Pokhara (पोखरा)</option>
                  <option value="Biratnagar">Biratnagar (विराटनगर)</option>
                  <option value="Chitwan">Chitwan / Bharatpur (चितवन)</option>
                  <option value="Butwal">Butwal (बुटवल)</option>
                  <option value="Dharan">Dharan (धरान)</option>
                  <option value="Nepalgunj">Nepalgunj (नेपालगन्ज)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] text-zinc-400 mb-1">Armored Delivery Address</label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="e.g. Baluwatar Diplomatic Enclave, House 14, Ward 4"
                  className="w-full bg-[#15151c] border border-zinc-700/80 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Integrated Nepali Payment Gateway Selector */}
          <div className="space-y-3 pt-2 border-t border-zinc-800">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-amber-300 flex items-center justify-between">
              <span>Select Payment Gateway</span>
              <span className="text-[10px] text-zinc-400 normal-case font-mono">Currency: NPR (रु.)</span>
            </h4>

            {/* Gateway Rail Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* eSewa */}
              <button
                type="button"
                onClick={() => setPaymentRail('esewa')}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentRail === 'esewa'
                    ? 'bg-[#1b2b1d] border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                    : 'bg-[#15151c] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-400 font-mono">eSewa</span>
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-[10px] text-zinc-400 mt-1">ईसेवा वालेट</span>
              </button>

              {/* Khalti */}
              <button
                type="button"
                onClick={() => setPaymentRail('khalti')}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentRail === 'khalti'
                    ? 'bg-[#29172f] border-purple-500 text-white shadow-md shadow-purple-500/10'
                    : 'bg-[#15151c] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-purple-400 font-mono">Khalti</span>
                  <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <span className="text-[10px] text-zinc-400 mt-1">खल्ती डिजिटल वालेट</span>
              </button>

              {/* Fonepay QR */}
              <button
                type="button"
                onClick={() => setPaymentRail('fonepay')}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentRail === 'fonepay'
                    ? 'bg-[#331818] border-red-500 text-white shadow-md shadow-red-500/10'
                    : 'bg-[#15151c] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-rose-400 font-mono">Fonepay QR</span>
                  <QrCode className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <span className="text-[10px] text-zinc-400 mt-1">स्क्यान एण्ड पे</span>
              </button>

              {/* Nepali Commercial Banks */}
              <button
                type="button"
                onClick={() => setPaymentRail('nepal_bank')}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentRail === 'nepal_bank'
                    ? 'bg-[#182333] border-blue-500 text-white shadow-md shadow-blue-500/10'
                    : 'bg-[#15151c] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-blue-400 font-mono">Nepal Banks</span>
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <span className="text-[10px] text-zinc-400 mt-1">मोबाइल बैंकिङ्ग</span>
              </button>
            </div>

            {/* Gateway Detail Panels */}
            <div className="p-4 bg-[#161620] rounded-xl border border-zinc-800 space-y-3">
              
              {/* ESEWA PANEL */}
              {paymentRail === 'esewa' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-emerald-400 pb-2 border-b border-zinc-800">
                    <span className="font-semibold">eSewa Direct Express Settlement</span>
                    <span className="text-[11px] text-zinc-400">Instant Verification</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">eSewa ID / Mobile No.</label>
                      <input
                        type="text"
                        value={esewaId}
                        onChange={(e) => setEsewaId(e.target.value)}
                        placeholder="98XXXXXXXX"
                        className="w-full bg-[#101015] border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">eSewa MPIN</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={esewaPin}
                        onChange={(e) => setEsewaPin(e.target.value)}
                        placeholder="••••"
                        className="w-full bg-[#101015] border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white font-mono tracking-widest focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    You will be debited <strong className="text-emerald-300 font-mono">{formatNPR(finalTotal)}</strong> directly from your verified eSewa balance.
                  </p>
                </div>
              )}

              {/* KHALTI PANEL */}
              {paymentRail === 'khalti' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-purple-400 pb-2 border-b border-zinc-800">
                    <span className="font-semibold">Khalti Digital Wallet Payment</span>
                    <span className="text-[11px] text-zinc-400">Khalti SDK Direct</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Khalti Registered Mobile</label>
                      <input
                        type="text"
                        value={khaltiId}
                        onChange={(e) => setKhaltiId(e.target.value)}
                        placeholder="98XXXXXXXX"
                        className="w-full bg-[#101015] border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Khalti MPIN / OTP</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={khaltiPin}
                        onChange={(e) => setKhaltiPin(e.target.value)}
                        placeholder="••••"
                        className="w-full bg-[#101015] border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white font-mono tracking-widest focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Seamless checkout with Khalti instant merchant API token.
                  </p>
                </div>
              )}

              {/* FONEPAY QR PANEL */}
              {paymentRail === 'fonepay' && (
                <div className="space-y-3 text-center sm:text-left flex flex-col sm:flex-row items-center gap-4">
                  {/* Dynamic QR Display */}
                  <div className="p-3 bg-white rounded-lg shadow-md shrink-0 flex flex-col items-center">
                    <div className="w-28 h-28 bg-zinc-900 rounded flex flex-col items-center justify-center p-2 text-white relative">
                      <QrCode className="w-20 h-20 text-white" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-[8px] font-bold">
                          FP
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] text-zinc-700 font-bold uppercase tracking-wider mt-1">
                      Fonepay Verified
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="font-bold text-rose-400 flex items-center gap-1.5 justify-center sm:justify-start">
                      <span>Fonepay Interbank Dynamic QR</span>
                    </div>
                    <p className="text-zinc-300">
                      Scan using any Nepali Mobile Banking App (Nabil, Global, NIC Asia, Sanima, eSewa, ConnectIPS, etc.)
                    </p>
                    <div className="p-2 bg-[#101015] rounded border border-zinc-800 text-[11px] text-zinc-400 font-mono mt-1">
                      Merchant: <strong>AURA GOLD ATELIER</strong><br />
                      PAN: <strong>601984210</strong> · Amount: <strong className="text-amber-300">{formatNPR(finalTotal)}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* NEPALI BANKS PANEL */}
              {paymentRail === 'nepal_bank' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-blue-400 pb-2 border-b border-zinc-800">
                    <span className="font-semibold">Nepali Commercial Bank Mobile Banking</span>
                    <span className="text-[11px] text-zinc-400">12 Major Banks</span>
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Select Your Bank</label>
                    <select
                      value={selectedBankId}
                      onChange={(e) => setSelectedBankId(e.target.value)}
                      className="w-full bg-[#101015] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400 cursor-pointer"
                    >
                      {NEPALI_COMMERCIAL_BANKS.map((bank) => (
                        <option key={bank.id} value={bank.id}>
                          {bank.name} ({bank.nepaliName}) — {bank.code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Account / Mobile Number</label>
                      <input
                        type="text"
                        defaultValue="0140100008912"
                        className="w-full bg-[#101015] border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Bank MPIN / Password</label>
                      <input
                        type="password"
                        defaultValue="••••••"
                        className="w-full bg-[#101015] border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white font-mono tracking-widest"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Pricing Breakdown in NPR */}
          <div className="p-4 bg-[#14141c] rounded-xl border border-zinc-800/90 space-y-2 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Gross Atelier Subtotal</span>
              <span className="font-mono text-zinc-200 tabular-nums">{formatNPR(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>VIP Privilege Discount ({appliedCoupon?.code})</span>
                <span className="font-mono tabular-nums">- {formatNPR(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-zinc-400">
              <span>Government of Nepal VAT (13%)</span>
              <span className="font-mono text-zinc-200 tabular-nums">{formatNPR(vatAmount)}</span>
            </div>

            <div className="flex justify-between text-zinc-400">
              <span>Armored Insured Courier (Nepal)</span>
              <span className="text-emerald-400 font-semibold font-mono uppercase text-[11px]">Complimentary / निःशुल्क</span>
            </div>

            <div className="pt-2 border-t border-zinc-800 flex justify-between items-baseline font-bold text-sm">
              <span className="text-white">Total Amount (NPR)</span>
              <div className="text-right">
                <span className="font-mono text-xl gold-text-gradient tabular-nums">
                  {formatNPR(finalTotal)}
                </span>
                <div className="text-[10px] text-zinc-400 font-normal">
                  (Includes all VAT & duties)
                </div>
              </div>
            </div>
          </div>

          {errorNotice && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

          {/* Primary Payhip Checkout Action Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#09090b] font-bold text-xs uppercase tracking-[0.2em] transition-all transform hover:-translate-y-0.5 gold-glow flex items-center justify-center gap-2 cursor-pointer shadow-xl disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Pay {formatNPR(finalTotal)} with {paymentRail.toUpperCase()}</span>
          </button>

          <p className="text-center text-[10px] text-zinc-500 flex items-center justify-center gap-2">
            <span>Official Tax Invoice Provided</span>
            <span aria-hidden="true">·</span>
            <span>VAT PAN 601984210</span>
            <span aria-hidden="true">·</span>
            <span>Kathmandu, Nepal</span>
          </p>

        </form>

      </div>
    </div>
  );
};
