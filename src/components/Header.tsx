import React, { useState } from 'react';
import { ShoppingBag, Search, Shield, X } from 'lucide-react';
import { CartItem, StoreSettings } from '../types';

interface HeaderProps {
  settings: StoreSettings;
  cart: CartItem[];
  onOpenCart: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAdminAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  cart,
  onOpenCart,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenAdminAuth,
}) => {
  const [showAnnouncement, setShowAnnouncement] = useState(settings.announcementActive);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const categories = [
    'All',
    'Haute Couture',
    'Gold Accessories',
    'Timepieces',
    'Fine Jewelry',
    'Mulberry Silks',
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#09090b]/95 backdrop-blur-md border-b border-amber-500/15">
      {/* Top Announcement Bar */}
      {showAnnouncement && settings.announcement && (
        <div className="bg-gradient-to-r from-[#18181b] via-[#27272a] to-[#18181b] border-b border-amber-500/20 px-4 py-2 text-xs text-amber-200/90 flex items-center justify-between">
          <div className="mx-auto text-center font-medium tracking-wider">
            {settings.announcement}
          </div>
          <button
            onClick={() => setShowAnnouncement(false)}
            aria-label="Dismiss announcement"
            className="text-amber-400/60 hover:text-amber-300 transition-colors p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Navigation (3-Zone Contract) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          
          {/* Zone 1: Single Wordmark Element */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory('All');
              }}
              className="group flex items-center gap-3.5"
            >
              <div className="w-9 h-9 rounded-sm bg-gradient-to-br from-amber-200 via-yellow-500 to-amber-700 flex items-center justify-center p-[1px] shadow-lg shadow-amber-500/10">
                <div className="w-full h-full bg-[#09090b] rounded-[1px] flex items-center justify-center">
                  <span className="font-cinzel text-amber-300 font-bold text-sm tracking-tighter">AG</span>
                </div>
              </div>
              <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-[0.25em] gold-text-gradient uppercase whitespace-nowrap">
                {settings.storeName}
              </span>
            </a>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-[0.2em] font-medium text-zinc-400">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`transition-colors whitespace-nowrap py-1 cursor-pointer ${
                  selectedCategory === cat
                    ? 'text-amber-300 font-semibold border-b border-amber-400'
                    : 'hover:text-zinc-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>

          {/* Zone 3: Actions (Search, Admin trigger, Cart Bag) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Search Toggle */}
            <div className="relative">
              {showSearchInput ? (
                <div className="flex items-center bg-[#18181b] border border-amber-500/30 rounded-md px-2.5 py-1">
                  <Search className="w-3.5 h-3.5 text-amber-400/80 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search collection..."
                    autoFocus
                    className="bg-transparent text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none w-32 sm:w-48"
                  />
                  <button
                    onClick={() => {
                      onSearchChange('');
                      setShowSearchInput(false);
                    }}
                    className="text-zinc-500 hover:text-zinc-300 ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSearchInput(true)}
                  aria-label="Search store"
                  className="p-2 text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Discreet Admin Lock Shortcut for store owner */}
            <button
              onClick={onOpenAdminAuth}
              title="Atelier Owner Access"
              className="p-2 text-zinc-500 hover:text-amber-400/80 transition-colors cursor-pointer rounded"
              aria-label="Owner sign-in"
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={onOpenCart}
              aria-label="View shopping bag"
              className="group flex items-center gap-2.5 px-3.5 py-2 rounded-md bg-[#18181b] hover:bg-[#202025] border border-amber-500/25 hover:border-amber-400/60 transition-all cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-[#09090b] text-[10px] font-bold flex items-center justify-center font-mono">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs tracking-wider uppercase font-semibold text-zinc-200">
                Bag
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Category Scroll Bar */}
        <div className="lg:hidden flex items-center gap-5 overflow-x-auto py-2.5 border-t border-zinc-800/60 no-scrollbar text-xs tracking-wider uppercase text-zinc-400">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`whitespace-nowrap px-1 py-0.5 transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'text-amber-300 font-semibold border-b border-amber-400'
                  : 'hover:text-zinc-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
