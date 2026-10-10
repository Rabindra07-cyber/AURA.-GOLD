import React, { useState } from 'react';
import { X, ShieldCheck, Truck, Check, Sparkles, Zap, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { formatNPR } from '../utils/format';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onQuickBuy: (product: Product, selectedOption?: string) => void;
  onAddToCart: (product: Product, selectedOption?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onQuickBuy,
  onAddToCart,
}) => {
  if (!product) return null;

  const defaultOption = product.options && product.options.length > 0 && product.options[0].values.length > 0
    ? product.options[0].values[0]
    : undefined;

  const [selectedOption, setSelectedOption] = useState<string | undefined>(defaultOption);
  const [addedNotice, setAddedNotice] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedOption);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-[#111116] w-full max-w-4xl rounded-2xl border border-amber-500/35 shadow-2xl shadow-black overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#18181f]/80 text-zinc-400 hover:text-amber-300 hover:bg-[#202028] transition-colors cursor-pointer border border-zinc-700/50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left Column: Image & Provenance Tag */}
          <div className="md:col-span-6 bg-[#0c0c0e] relative flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-zinc-800">
            <div className="relative w-full aspect-square max-h-[440px] rounded-xl overflow-hidden border border-amber-500/25 bg-[#16161c]">
              <img
                src={product.image}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-3 left-3 bg-[#09090b]/85 backdrop-blur-sm px-2.5 py-1 rounded border border-amber-500/30 text-[10px] tracking-widest uppercase font-mono text-amber-300">
                {product.sku}
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-400">
                <span className="text-amber-400 font-semibold">{product.category}</span>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span>Atelier Certified Garment</span>
              </div>

              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white leading-tight">
                {product.title}
              </h2>

              <div className="flex items-baseline gap-3">
                <span className="font-mono text-2xl font-bold text-amber-300 tabular-nums">
                  {formatNPR(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="font-mono text-sm text-zinc-500 line-through tabular-nums">
                    {formatNPR(product.compareAtPrice)}
                  </span>
                )}
                <span className="text-xs text-zinc-500 uppercase tracking-widest font-mono">
                  NPR (रु.)
                </span>
              </div>

              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-light">
                {product.description}
              </p>

              {/* Options Selector if available */}
              {product.options && product.options.map((opt) => (
                <div key={opt.name} className="space-y-2 pt-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-zinc-300 flex justify-between">
                    <span>Select {opt.name}:</span>
                    <span className="text-amber-300 font-mono text-xs">{selectedOption}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {opt.values.map((val) => (
                      <button
                        key={val}
                        onClick={() => setSelectedOption(val)}
                        className={`px-3 py-2 text-xs rounded-lg border transition-all cursor-pointer font-medium ${
                          selectedOption === val
                            ? 'bg-amber-400/20 border-amber-400 text-amber-200'
                            : 'bg-[#18181f] border-zinc-700/60 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Materials Provenance */}
              <div className="pt-2 border-t border-zinc-800/80">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 block mb-2">
                  Fabric Composition & Embellishment:
                </span>
                <div className="space-y-1.5">
                  {product.materials.map((mat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{mat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logistics Trust in Nepal */}
              <div className="space-y-1.5 pt-2 text-[11px] text-zinc-400 border-t border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{product.deliveryEstimate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Complimentary Insured Delivery Across Nepal</span>
                </div>
              </div>

            </div>

            {/* Actions: Direct Payhip Buy Now & Add To Bag */}
            <div className="space-y-2.5 pt-4">
              <button
                onClick={() => onQuickBuy(product, selectedOption)}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#09090b] font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 gold-glow cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Instant Checkout ({formatNPR(product.price)})</span>
              </button>

              <button
                onClick={handleAdd}
                className="w-full py-3 px-4 rounded-xl bg-[#18181f] hover:bg-[#22222a] border border-amber-500/30 hover:border-amber-400 text-amber-200 font-semibold text-xs uppercase tracking-[0.16em] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {addedNotice ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Added to Shopping Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-amber-300" />
                    <span>Add to Shopping Bag</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
