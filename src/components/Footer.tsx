import React from 'react';
import { Lock, Crown, ShieldCheck } from 'lucide-react';
import brandLogo from '../assets/images/aura_gold_brand_crest_1791603528570.jpg';

interface FooterProps {
  onOpenAdminAuth: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminAuth, onSelectCategory }) => {
  return (
    <footer className="relative bg-[#070709] border-t border-amber-500/20 text-zinc-400 overflow-hidden">
      
      {/* Decorative Gold Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Brand Centerpiece with User's Official Emblem & Motto */}
        <div className="flex flex-col items-center text-center space-y-4 pb-12 border-b border-zinc-800/80">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-amber-400 shadow-2xl shadow-amber-500/20 p-0.5 bg-gradient-to-br from-amber-200 via-amber-500 to-yellow-700">
            <img 
              src={brandLogo} 
              alt="AURA GOLD Official Crest" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <h3 className="font-cinzel text-2xl sm:text-3xl font-extrabold gold-text-gradient tracking-[0.25em] uppercase">
            AURA GOLD
          </h3>

          <p className="text-xs uppercase tracking-[0.3em] text-amber-300 font-medium">
            HAUTE COUTURE & DESIGNER ACCESSORIES
          </p>

          {/* User's Exact Tagline & Crown Divider from Reference */}
          <div className="pt-2 flex flex-col items-center space-y-2">
            <div className="text-xs tracking-[0.28em] uppercase text-amber-200/90 font-light">
              SAME VIBE · BETTER TOGETHER
            </div>
            <div className="flex items-center gap-3 w-48 justify-center">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-amber-500/60" />
              <Crown className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-amber-500/60" />
            </div>
          </div>
        </div>

        {/* Multi-Column Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12 text-xs">
          
          <div className="space-y-3">
            <h4 className="font-cinzel text-sm text-zinc-100 font-semibold tracking-wider uppercase">
              The Atelier
            </h4>
            <p className="text-zinc-400 leading-relaxed font-light">
              A bespoke fashion atelier crafting limited-run couture garments, silk outerwear, and gold-embellished wardrobe accessories.
            </p>
            <div className="text-[11px] text-zinc-500 font-mono">
              Kathmandu · Paris · Geneva
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-cinzel text-sm text-zinc-100 font-semibold tracking-wider uppercase">
              Collections
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onSelectCategory('Suits & Blazers')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Suits & Tailored Blazers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('Clothing')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Gala Gowns & Evening Dresses
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('Outerwear')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Silk Storm Coats & Outerwear
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('Accessories')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Wardrobe Accessories & Clutches
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-cinzel text-sm text-zinc-100 font-semibold tracking-wider uppercase">
              Client Concierge (Nepal)
            </h4>
            <p className="text-zinc-400">
              Durbarmarg Luxury Arcade, Ward 1<br />
              Kathmandu 44600, Nepal
            </p>
            <p className="font-mono text-zinc-400">
              Hotline: +977 1 4429810<br />
              concierge@auragold.com.np
            </p>
            <div className="text-amber-400 font-mono text-[11px]">
              PAN Registration: 601984210
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-cinzel text-sm text-zinc-100 font-semibold tracking-wider uppercase">
              Payment & Security
            </h4>
            <p className="text-zinc-400 leading-relaxed">
              Integrated with Nepal Clearing House, eSewa, Khalti, Fonepay QR, and top commercial banks for seamless transactions.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>256-Bit SSL Encrypted Vault</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Discreet Admin Access */}
        <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            © {new Date().getFullYear()} AURA GOLD ATELIER. All Rights Reserved.
          </div>

          {/* Discreet Store Owner Portal Entry */}
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-zinc-600">
              Currency: NPR (रु.)
            </span>
            <button
              onClick={onOpenAdminAuth}
              className="flex items-center gap-1.5 text-zinc-600 hover:text-amber-400 transition-colors text-[11px] cursor-pointer group"
              title="Restricted Atelier Admin Login"
            >
              <Lock className="w-3 h-3 group-hover:text-amber-400 transition-colors" />
              <span>Atelier Owner Portal</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
