import React, { useState } from 'react';
import { ShoppingBag, Eye, Zap, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { formatNPR } from '../utils/format';

interface ProductCardProps {
  product: Product;
  onQuickBuy: (product: Product) => void;
  onInspect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickBuy,
  onInspect,
  onAddToCart,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setIsAddedFeedback(true);
    setTimeout(() => setIsAddedFeedback(false), 1200);
  };

  return (
    <article className="group relative bg-[#121216] rounded-lg border border-amber-500/20 hover:border-amber-400/60 transition-all duration-300 flex flex-col overflow-hidden hover:shadow-xl hover:shadow-amber-500/10">
      
      {/* Product Image Area */}
      <div 
        onClick={() => onInspect(product)}
        className="relative aspect-[4/3] w-full overflow-hidden bg-[#18181f] cursor-pointer"
      >
        {!imageError && product.image ? (
          <img
            src={product.image}
            alt={product.title}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          /* Styled Fallback Container per Zero-Broken-Image Policy */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#18181f] to-[#0d0d10] text-center">
            <Sparkles className="w-8 h-8 text-amber-400/60 mb-2" />
            <span className="font-cinzel text-xs text-amber-200 uppercase tracking-widest">
              AURA GOLD ATELIER
            </span>
            <span className="text-zinc-500 text-[11px] mt-1 font-mono">{product.sku}</span>
          </div>
        )}

        {/* Floating Quick Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isFeatured && (
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-amber-300 bg-[#09090b]/80 backdrop-blur-sm px-2.5 py-1 rounded border border-amber-500/30">
              Signature Piece
            </span>
          )}
          {product.stock <= 3 && product.stock > 0 && (
            <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-200/90 bg-[#18181b]/90 backdrop-blur-sm px-2 py-0.5 rounded border border-amber-500/20">
              Only {product.stock} Left in Nepal
            </span>
          )}
        </div>

        {/* Quick Inspect Button Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInspect(product);
            }}
            className="p-3 rounded-full bg-[#09090b]/90 text-amber-300 hover:text-white border border-amber-500/40 hover:border-amber-300 transition-transform transform hover:scale-110 cursor-pointer shadow-lg"
            title="Inspect Piece Details"
            aria-label="Inspect details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div>
          {/* Category & Status (Zero-Pill Discipline: clean unboxed metadata) */}
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-zinc-400 mb-1.5">
            <span className="text-amber-400/90 font-medium">{product.category}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>{product.stock > 0 ? 'In Kathmandu Vault' : 'Special Order'}</span>
          </div>

          {/* Product Title */}
          <h2
            onClick={() => onInspect(product)}
            className="font-serif-luxury text-base font-semibold text-zinc-100 hover:text-amber-300 transition-colors cursor-pointer line-clamp-1"
          >
            {product.title}
          </h2>

          <p className="text-zinc-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & Primary Payhip CTAs (in NPR) */}
        <div className="pt-2 border-t border-zinc-800/80">
          <div className="flex items-baseline justify-between mb-3.5">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-lg font-bold text-amber-300 tabular-nums">
                {formatNPR(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="font-mono text-xs text-zinc-500 line-through tabular-nums">
                  {formatNPR(product.compareAtPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">
              NPR
            </span>
          </div>

          {/* Payhip-Style Instant Actions with Nepali Payment */}
          <div className="grid grid-cols-12 gap-2">
            {/* Primary "Buy Now" Direct Checkout (Payhip Signature) */}
            <button
              onClick={() => onQuickBuy(product)}
              className="col-span-8 px-3 py-2.5 rounded bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#09090b] font-bold text-xs uppercase tracking-[0.14em] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Buy Now</span>
            </button>

            {/* "Add to Bag" Quick Action */}
            <button
              onClick={handleAdd}
              className={`col-span-4 px-2 py-2.5 rounded border text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center cursor-pointer ${
                isAddedFeedback
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400'
                  : 'bg-[#18181f] text-zinc-300 border-zinc-700/80 hover:border-amber-400/60 hover:text-amber-200'
              }`}
              title="Add to Shopping Bag"
              aria-label="Add to cart"
            >
              {isAddedFeedback ? (
                <span className="text-[10px]">Added</span>
              ) : (
                <ShoppingBag className="w-4 h-4 text-amber-300" />
              )}
            </button>
          </div>
        </div>

      </div>
    </article>
  );
};
