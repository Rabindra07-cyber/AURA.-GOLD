import React from 'react';
import { CheckCircle2, Printer, X, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { Order } from '../types';
import { formatNPR } from '../utils/format';
import brandLogo from '../assets/images/aura_gold_brand_crest_1791603528570.jpg';

interface OrderReceiptModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderReceiptModal: React.FC<OrderReceiptModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-[#111116] w-full max-w-2xl rounded-2xl border border-amber-500/40 shadow-2xl shadow-black overflow-hidden my-6 print:border-none print:shadow-none print:bg-white print:text-black"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#181820] via-[#22222e] to-[#181820] border-b border-amber-500/25 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-400">
              <img src={brandLogo} alt="AURA GOLD" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg font-bold gold-text-gradient uppercase tracking-widest">
                AURA GOLD ATELIER
              </h2>
              <p className="text-[11px] text-zinc-400">
                Official Electronic Tax Invoice (Government of Nepal VAT / PAN: 601984210)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded bg-[#1e1e28] text-amber-300 hover:bg-[#282836] transition-colors cursor-pointer"
              title="Print Tax Invoice"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded text-zinc-400 hover:text-amber-300 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible">
          
          {/* Success Banner */}
          <div className="text-center space-y-2 pb-4 border-b border-zinc-800 print:border-zinc-300">
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-cinzel text-xl font-bold text-white print:text-black">
              Payment Confirmed & Verified
            </h3>
            <p className="text-xs text-zinc-400 print:text-zinc-600">
              Order Reference: <strong className="font-mono text-amber-300 print:text-black">{order.orderNumber}</strong>
            </p>
            <p className="text-[11px] text-zinc-500">
              Electronic token: {order.receiptToken} · Issued at {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Recipient & Payment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#161620] print:bg-zinc-100 p-4 rounded-xl border border-zinc-800 print:border-zinc-300">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 print:text-zinc-500 font-semibold block mb-1">
                Recipient Details
              </span>
              <p className="font-semibold text-zinc-200 print:text-black">{order.customerName}</p>
              <p className="text-zinc-400 print:text-zinc-600 font-mono text-[11px]">{order.customerEmail}</p>
              <p className="text-zinc-400 print:text-zinc-600 font-mono text-[11px]">Phone: {order.shippingAddress.phone}</p>
              <div className="flex items-start gap-1 text-zinc-400 print:text-zinc-600 mt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.province}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 print:text-zinc-500 font-semibold block mb-1">
                Nepali Payment Verification
              </span>
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold uppercase text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>
                  {order.paymentRail === 'esewa' && 'eSewa Direct Wallet'}
                  {order.paymentRail === 'khalti' && 'Khalti Digital Wallet'}
                  {order.paymentRail === 'fonepay' && 'Fonepay Dynamic QR'}
                  {order.paymentRail === 'nepal_bank' && (order.bankName || 'Nepali Commercial Bank')}
                  {order.paymentRail === 'card' && 'SCT / Visa Card'}
                </span>
              </div>
              {order.nepaliWalletId && (
                <p className="text-zinc-400 print:text-zinc-600 font-mono text-[11px] mt-0.5">
                  Wallet ID: {order.nepaliWalletId}
                </p>
              )}
              <p className="text-zinc-400 print:text-zinc-600 text-[11px] mt-1">
                Fulfillment Status: <strong className="text-amber-300 print:text-black uppercase">{order.status}</strong>
              </p>
              <p className="text-zinc-500 text-[10px] mt-1">
                Courier: Armored Insured Vault Transit (Nepal)
              </p>
            </div>
          </div>

          {/* Itemized Invoice Table */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-amber-300 print:text-black">
              Acquisition Breakdown
            </h4>
            <div className="border border-zinc-800 print:border-zinc-300 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#181822] print:bg-zinc-200 text-zinc-400 print:text-zinc-700 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3">Piece Description</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 print:divide-zinc-200">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-zinc-800/30">
                      <td className="p-3">
                        <div className="font-medium text-zinc-200 print:text-black">{item.title}</div>
                        {item.selectedOption && (
                          <div className="text-[10px] text-amber-400/80 print:text-zinc-600 font-mono">
                            {item.selectedOption}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-center font-mono text-zinc-300 print:text-black">
                        {item.quantity}
                      </td>
                      <td className="p-3 text-right font-mono text-zinc-300 print:text-black tabular-nums">
                        {formatNPR(item.price)}
                      </td>
                      <td className="p-3 text-right font-mono font-semibold text-amber-300 print:text-black tabular-nums">
                        {formatNPR(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Calculation */}
          <div className="p-4 bg-[#14141c] print:bg-zinc-100 rounded-xl space-y-2 text-xs border border-zinc-800 print:border-zinc-300">
            <div className="flex justify-between text-zinc-400 print:text-zinc-600">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums text-zinc-200 print:text-black">{formatNPR(order.subtotal)}</span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-400 print:text-emerald-700">
                <span>Privilege Discount ({order.couponCode})</span>
                <span className="font-mono tabular-nums">- {formatNPR(order.discount)}</span>
              </div>
            )}

            <div className="flex justify-between text-zinc-400 print:text-zinc-600">
              <span>Government of Nepal VAT (13%)</span>
              <span className="font-mono tabular-nums text-zinc-200 print:text-black">{formatNPR(order.tax)}</span>
            </div>

            <div className="flex justify-between text-zinc-400 print:text-zinc-600">
              <span>Insured Armored Transit</span>
              <span className="text-emerald-400 print:text-emerald-700 font-mono font-semibold uppercase text-[11px]">Free / निःशुल्क</span>
            </div>

            <div className="pt-2 border-t border-zinc-800 print:border-zinc-300 flex justify-between items-baseline font-bold text-sm">
              <span className="text-white print:text-black">Grand Total Paid (NPR)</span>
              <span className="font-mono text-lg gold-text-gradient print:text-black tabular-nums">
                {formatNPR(order.total)}
              </span>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center text-[11px] text-zinc-500 print:text-zinc-600 pt-2 space-y-1">
            <p>
              AURA GOLD ATELIER · Durbarmarg Luxury Arcade, Kathmandu, Nepal
            </p>
            <p className="font-mono">
              PAN: 601984210 · Concierge Hotline: +977 1 4429810
            </p>
          </div>

          <div className="pt-2 flex gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 rounded-lg bg-[#20202a] hover:bg-[#282836] border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Invoice</span>
            </button>

            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-lg bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#09090b] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
