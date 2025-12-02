
import React, { useState, useEffect, useMemo } from 'react';
import { Language } from '../types';
import { t } from '../translations';
import { Clock, Copy, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

interface PaymentProps {
  totalAmount: number;
  onComplete: () => void;
  onCancel: () => void;
  language: Language;
}

export const Payment: React.FC<PaymentProps> = ({ totalAmount, onComplete, onCancel, language }) => {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [status, setStatus] = useState<'awaiting' | 'confirming' | 'confirmed'>('awaiting');
  
  // Deterministic random wallet address
  const walletAddress = useMemo(() => {
      const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
      let addr = 'bc1q';
      for(let i=0; i<38; i++) addr += chars.charAt(Math.floor(Math.random() * chars.length));
      return addr;
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const simulatePayment = () => {
    if (status !== 'awaiting') return;
    setStatus('confirming');
    
    // Simulate network delay
    setTimeout(() => {
        setStatus('confirmed');
        // Final success delay
        setTimeout(() => {
            onComplete();
        }, 2000);
    }, 3000);
  };

  // Generate a simple QR grid purely with CSS
  const qrGrid = useMemo(() => {
      const size = 21;
      const cells = [];
      for(let i=0; i<size*size; i++) {
          // Fake QR pattern
          const isDark = Math.random() > 0.5;
          // Add corner finders
          const x = i % size;
          const y = Math.floor(i / size);
          const isCorner = (x < 7 && y < 7) || (x > size-8 && y < 7) || (x < 7 && y > size-8);
          
          cells.push(isCorner ? true : isDark);
      }
      return cells;
  }, []);

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <div className="border border-terminal-green bg-black p-8 relative overflow-hidden shadow-[0_0_50px_rgba(0,255,65,0.15)]">
        {/* Animated Background Scanline */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,65,0.05)_50%)] bg-[length:100%_4px] pointer-events-none"></div>

        <div className="text-center mb-8 border-b border-gray-800 pb-6">
            <h2 className="text-2xl font-bold text-white glitch-text mb-2" data-text={t(language, 'payment.title')}>
                {t(language, 'payment.title')}
            </h2>
            <p className="text-sm text-gray-500 font-mono">
                {t(language, 'payment.instruction')}
            </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-8">
            {/* Fake QR Code */}
            <div className="bg-white p-4 rounded-sm w-48 h-48 flex-shrink-0 relative">
                <div className="grid grid-cols-[repeat(21,1fr)] w-full h-full border-4 border-black">
                     {qrGrid.map((filled, idx) => (
                         <div key={idx} className={filled ? 'bg-black' : 'bg-white'}></div>
                     ))}
                </div>
                {/* Corner finders override for visuals */}
                <div className="absolute top-4 left-4 w-10 h-10 border-[6px] border-black bg-transparent">
                     <div className="absolute inset-2 bg-black"></div>
                </div>
                 <div className="absolute top-4 right-4 w-10 h-10 border-[6px] border-black bg-transparent">
                     <div className="absolute inset-2 bg-black"></div>
                </div>
                 <div className="absolute bottom-4 left-4 w-10 h-10 border-[6px] border-black bg-transparent">
                     <div className="absolute inset-2 bg-black"></div>
                </div>
            </div>

            <div className="flex-grow space-y-6 w-full">
                <div>
                    <label className="text-xs text-terminal-green uppercase tracking-wider mb-1 block">
                        {t(language, 'payment.wallet_label')}
                    </label>
                    <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 p-3 font-mono text-sm break-all group relative">
                        <span className="text-gray-300">{walletAddress}</span>
                        <Copy size={14} className="text-gray-500 cursor-pointer hover:text-white absolute right-2 top-3" />
                    </div>
                </div>

                <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">
                        {t(language, 'cart.total_escrow')}
                    </label>
                    <div className="text-3xl text-white font-bold font-mono">
                        {totalAmount.toFixed(5)} <span className="text-terminal-green text-sm">BTC</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Status & Timer */}
        <div className="bg-gray-900/50 border border-gray-800 p-4 mb-6 flex justify-between items-center">
             <div className="flex items-center gap-3">
                {status === 'awaiting' && <Loader2 className="text-gray-500 animate-spin" size={20} />}
                {status === 'confirming' && <Loader2 className="text-yellow-500 animate-spin" size={20} />}
                {status === 'confirmed' && <CheckCircle2 className="text-terminal-green" size={20} />}
                
                <span className={`font-mono text-sm font-bold ${
                    status === 'confirmed' ? 'text-terminal-green' : 
                    status === 'confirming' ? 'text-yellow-500' : 'text-gray-400'
                }`}>
                    {status === 'awaiting' ? t(language, 'payment.status_awaiting') : 
                     status === 'confirming' ? t(language, 'payment.status_confirming') : 
                     t(language, 'payment.status_confirmed')}
                </span>
             </div>

             <div className="text-right">
                 <div className="text-[10px] text-gray-500 uppercase">{t(language, 'payment.timer')}</div>
                 <div className={`font-mono text-lg font-bold flex items-center justify-end gap-2 ${timeLeft < 120 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                     <Clock size={14} />
                     {formatTime(timeLeft)}
                 </div>
             </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col gap-3">
            {status === 'awaiting' && (
                <button 
                    onClick={simulatePayment}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 py-3 text-xs uppercase tracking-widest transition-colors font-mono"
                >
                    {t(language, 'payment.simulate_btn')}
                </button>
            )}
            
            <button 
                onClick={onCancel}
                disabled={status !== 'awaiting'}
                className={`w-full text-red-500 hover:text-red-400 py-2 text-xs uppercase tracking-widest transition-colors ${status !== 'awaiting' ? 'opacity-0 cursor-default' : 'opacity-100'}`}
            >
                {t(language, 'payment.cancel_btn')}
            </button>
        </div>
      </div>
      
      <div className="mt-4 text-center">
          <p className="text-xs text-gray-600 flex items-center justify-center gap-2">
              <AlertTriangle size={12} />
              Do not close window during transaction.
          </p>
      </div>
    </div>
  );
};
