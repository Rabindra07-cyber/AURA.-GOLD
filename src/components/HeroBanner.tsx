import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, Truck, Lock } from 'lucide-react';
import heroImg from '../assets/images/hero_aura_gold_atelier_1791602470386.jpg';

interface HeroBannerProps {
  onExploreCollection: () => void;
  onQuickBuyFeatured: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreCollection,
  onQuickBuyFeatured,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#09090b] border-b border-amber-500/15">
      {/* Editorial Split Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Campaign Typography */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Haute Couture & Designer Accessories</span>
            </div>

            <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15]" style={{ textWrap: 'balance' }}>
              Bespoke Clothing with <span className="gold-text-gradient">24K Gilded Accents</span>
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl font-light">
              Mastercrafted designer fashion, luxury silk gowns, tailored tuxedos, and opulent wardrobe accessories. 
              Each bespoke silhouette embodies Parisian elegance and Newar bullion craftsmanship.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreCollection}
                className="px-6 py-3.5 rounded-md bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#09090b] font-semibold text-xs uppercase tracking-[0.18em] transition-all transform hover:-translate-y-0.5 gold-glow flex items-center gap-2 cursor-pointer"
              >
                <span>Browse Clothing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onQuickBuyFeatured}
                className="px-5 py-3.5 rounded-md bg-[#18181b] hover:bg-[#202025] border border-amber-500/30 hover:border-amber-400 text-amber-200 text-xs uppercase tracking-[0.18em] font-medium transition-all cursor-pointer"
              >
                Inspect Tuxedo Blazer
              </button>
            </div>

            {/* Quiet Curator Note */}
            <div className="pt-2 text-xs text-zinc-500 flex items-center gap-3">
              <span>Haute Couture Apparel</span>
              <span aria-hidden="true">·</span>
              <span>Exclusive Accessories</span>
              <span aria-hidden="true">·</span>
              <span>Free Delivery in Nepal</span>
            </div>
          </div>

          {/* Right Column: High-Graphics Photography Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-lg overflow-hidden border border-amber-500/25 bg-[#121215] shadow-2xl shadow-black/80 group">
              <div className="aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden">
                <img
                  src={heroImg}
                  alt="AURA GOLD Haute Couture 24K Embroidered Blazer Campaign"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Scrim Overlay with Information Capsule */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-amber-400/90 font-mono">
                      SIGNATURE GARMENT N° 01
                    </span>
                    <h3 className="font-serif-luxury text-lg text-white font-medium">
                      The Empress 24K Tuxedo Blazer
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-amber-300 font-semibold text-lg tabular-nums">
                      Rs. 4,85,000
                    </span>
                    <div className="text-[10px] text-zinc-400 tracking-wider uppercase">
                      Insured Nepal Escort
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle decorative gold light flare */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          </div>

        </div>

        {/* 4-Column Trust Proof Strip (Adjacency Rule) */}
        <div className="mt-12 pt-8 border-t border-zinc-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#18181b] border border-amber-500/20 text-amber-400">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-zinc-200">Nepal Delivery</div>
              <div className="text-zinc-500 text-[11px]">Free delivery across Nepal</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#18181b] border border-amber-500/20 text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-zinc-200">100% Authentic Fabrics</div>
              <div className="text-zinc-500 text-[11px]">Pure Italian silk & French velvet</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#18181b] border border-amber-500/20 text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-zinc-200">eSewa, Khalti & Banks</div>
              <div className="text-zinc-500 text-[11px]">Seamless Nepali payment gateway</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#18181b] border border-amber-500/20 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-zinc-200">Bespoke Tailoring</div>
              <div className="text-zinc-500 text-[11px]">Complimentary custom fitting</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
