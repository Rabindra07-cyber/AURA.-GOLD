import React, { useState } from 'react';
import { Lock, X, ShieldAlert, ArrowRight, KeyRound } from 'lucide-react';
import brandLogo from '../../assets/images/aura_gold_brand_crest_1791603528570.jpg';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
  correctPin: string;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
  correctPin,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [attempts, setAttempts] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === correctPin.trim()) {
      setErrorMsg('');
      setPinInput('');
      onAuthenticated();
    } else {
      setAttempts(a => a + 1);
      setErrorMsg('Unauthorized access code. Incorrect Master PIN.');
      setPinInput('');
    }
  };

  const handleQuickKey = (digit: string) => {
    if (pinInput.length < 6) {
      setPinInput(prev => prev + digit);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="relative bg-[#111116] w-full max-w-sm rounded-2xl border border-amber-500/40 shadow-2xl shadow-black overflow-hidden p-6 sm:p-8 text-center space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close owner auth"
          className="absolute top-4 right-4 p-1.5 rounded text-zinc-500 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Crest */}
        <div className="w-16 h-16 rounded-full mx-auto overflow-hidden border border-amber-400 p-0.5 shadow-lg shadow-amber-500/20">
          <img src={brandLogo} alt="AURA GOLD" className="w-full h-full object-cover rounded-full" />
        </div>

        <div>
          <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs uppercase tracking-widest font-semibold mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Atelier Owner Gate</span>
          </div>
          <h3 className="font-cinzel text-xl font-bold text-white tracking-wider">
            Admin Verification
          </h3>
          <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
            Restricted to AURA GOLD boutique owners. Enter your 4-digit Master PIN.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              maxLength={6}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="••••"
              autoFocus
              className="w-full bg-[#181822] border border-amber-500/40 rounded-xl px-4 py-3 text-center text-2xl tracking-[0.4em] font-mono text-amber-300 focus:outline-none focus:border-amber-400"
            />
            <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300 flex items-center justify-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Digit Pad */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((btn) => (
              <button
                key={btn}
                type="button"
                onClick={() => {
                  if (btn === 'C') setPinInput('');
                  else if (btn === '⌫') setPinInput(p => p.slice(0, -1));
                  else handleQuickKey(btn);
                }}
                className="py-2.5 bg-[#181822] hover:bg-[#222230] border border-zinc-800 hover:border-amber-500/30 text-zinc-200 hover:text-amber-300 rounded-lg text-sm font-mono font-medium transition-colors cursor-pointer"
              >
                {btn}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#09090b] font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 gold-glow cursor-pointer mt-2"
          >
            <span>Enter Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[10px] text-zinc-500 font-mono">
            Default Master PIN: <span className="text-amber-400 font-bold">1850</span> (Changeable in settings)
          </p>
        </form>

      </div>
    </div>
  );
};
