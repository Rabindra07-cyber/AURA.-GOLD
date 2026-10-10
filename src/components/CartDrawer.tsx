import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';
import { formatNPR } from '../utils/format';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#111116] border-l border-amber-500/25 text-white flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="font-cinzel text-lg font-bold tracking-wider gold-text-gradient uppercase">
                Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close bag"
              className="p-1.5 rounded text-zinc-400 hover:text-amber-300 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-zinc-400 py-16">
                <div className="w-16 h-16 rounded-full bg-[#18181f] border border-amber-500/20 flex items-center justify-center">
                  <ShoppingBag className="w-7 h-7 text-amber-400/50" />
                </div>
                <div>
                  <p className="font-serif-luxury text-lg text-zinc-300">Your bag is empty</p>
                  <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                    Explore our curated collection of haute couture clothing and bespoke accessories.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-[#09090b] text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedOption || 'default'}`}
                  className="flex gap-4 p-3.5 bg-[#16161d] rounded-lg border border-zinc-800 hover:border-amber-500/30 transition-colors"
                >
                  <div className="w-20 h-20 rounded bg-[#0d0d10] overflow-hidden shrink-0 border border-zinc-800">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif-luxury text-sm font-semibold text-zinc-100 line-clamp-1">
                        {item.product.title}
                      </h4>
                      {item.selectedOption && (
                        <p className="text-[11px] text-amber-400/80 font-mono mt-0.5">
                          {item.selectedOption}
                        </p>
                      )}
                      <p className="font-mono text-xs font-bold text-amber-300 mt-1 tabular-nums">
                        {formatNPR(item.product.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/80">
                      <div className="flex items-center border border-zinc-700 rounded bg-[#09090b]">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-zinc-400 hover:text-amber-300 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-mono font-medium text-zinc-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-zinc-400 hover:text-amber-300 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-zinc-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                        title="Remove piece"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-zinc-800 bg-[#14141a] space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-zinc-200 font-semibold tabular-nums">
                    {formatNPR(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Insured Delivery (Nepal)</span>
                  <span className="text-amber-400 font-mono uppercase text-[11px]">
                    FREE / निःशुल्क
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-zinc-800 font-bold text-white">
                  <span>Estimated Total</span>
                  <span className="font-mono text-amber-300 tabular-nums">
                    {formatNPR(subtotal)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onCheckout();
                }}
                className="w-full py-3.5 px-4 rounded-md bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#09090b] font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 gold-glow cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400/80" />
                <span>eSewa · Khalti · Fonepay QR · Nepali Banks</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
