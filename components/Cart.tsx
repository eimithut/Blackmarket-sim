import React from 'react';
import { CartItem, Language } from '../types';
import { Trash2, CreditCard, ArrowRight } from 'lucide-react';
import { t } from '../translations';
import { DigitalAssetPreview } from './DigitalAssetPreview';

interface CartProps {
  items: CartItem[];
  onRemove: (id: string) => void;
  onCheckout: () => void;
  language: Language;
}

export const Cart: React.FC<CartProps> = ({ items, onRemove, onCheckout, language }) => {
  const total = items.reduce((acc, item) => acc + (item.priceBTC * item.quantity), 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-600 font-mono">
        <p className="text-xl mb-2">{t(language, 'cart.empty')}</p>
        <p className="text-sm">{t(language, 'cart.empty_sub')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto font-mono animate-fadeIn">
      <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-2">{t(language, 'cart.title')}</h2>
      
      <div className="space-y-4 mb-8">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between bg-gray-900/50 border border-gray-800 p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-black border border-gray-700 overflow-hidden shrink-0 relative">
                {item.imageUrl ? (
                    <>
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover opacity-60" />
                        <div className="absolute inset-0 bg-terminal-green/10 mix-blend-overlay"></div>
                    </>
                ) : (
                    <DigitalAssetPreview seed={item.imageSeed} className="w-full h-full opacity-60" showLabel={false} />
                )}
              </div>
              <div>
                <h3 className="text-white font-bold">{item.name}</h3>
                <p className="text-xs text-gray-500">{t(language, 'card.seller')}: {item.seller}</p>
                <p className="text-xs text-terminal-green mt-1">{t(language, 'cart.reserved')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-white">{item.priceBTC} BTC</p>
                <p className="text-xs text-gray-600">{t(language, 'cart.quantity')}: {item.quantity}</p>
              </div>
              <button 
                onClick={() => onRemove(item.id)}
                className="text-gray-600 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-black border border-terminal-green/30 p-6">
        <div className="flex justify-between items-center mb-6">
            <span className="text-gray-400">{t(language, 'cart.total_escrow')}</span>
            <span className="text-2xl text-terminal-green font-bold">{total.toFixed(4)} BTC</span>
        </div>
        
        <button 
            onClick={onCheckout}
            className="w-full bg-terminal-green text-black font-bold py-3 hover:bg-white transition-colors flex items-center justify-center gap-2 group"
        >
            <CreditCard size={18} />
            {t(language, 'cart.checkout_btn')}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="text-center text-xs text-gray-600 mt-3">
            {t(language, 'cart.warning')}
        </p>
      </div>
    </div>
  );
};