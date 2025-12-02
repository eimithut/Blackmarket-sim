
import React from 'react';
import { ShieldCheck, AlertTriangle, ShoppingCart } from 'lucide-react';
import { Product, Language } from '../types';
import { t } from '../translations';
import { DigitalAssetPreview } from './DigitalAssetPreview';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  language: Language;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onAddToCart, language }) => {
  return (
    <div 
      onClick={() => onClick(product)}
      className="group relative border border-gray-800 bg-gray-900/40 hover:border-terminal-green/50 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
    >
      {/* Visual Preview */}
      <div className="relative h-56 shrink-0 border-b border-gray-800 bg-black">
        {product.imageUrl ? (
            <div className="w-full h-full relative overflow-hidden">
                <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 group-hover:scale-105 transform"
                />
                {/* Cyberpunk Overlay for Images */}
                <div className="absolute inset-0 bg-terminal-green/10 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.8)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40"></div>
            </div>
        ) : (
            <DigitalAssetPreview seed={product.imageSeed} className="w-full h-full opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
        
        {/* Trust Badge */}
        <div className="absolute top-2 right-2 flex items-center space-x-1 bg-black/80 px-2 py-1 border border-gray-700 text-xs text-white z-10">
          {product.trustLevel > 90 ? <ShieldCheck size={12} className="text-terminal-green" /> : <AlertTriangle size={12} className="text-yellow-500" />}
          <span>{product.trustLevel}% {t(language, 'card.trust')}</span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs text-terminal-green border border-terminal-green/30 px-1.5 py-0.5 uppercase tracking-wider">
            {product.category}
          </span>
          <span className="text-xs text-gray-500 font-mono">{t(language, 'card.id')}: {product.id.toUpperCase()}</span>
        </div>

        <h3 className="text-xl font-bold text-gray-200 mb-2 group-hover:text-terminal-green transition-colors">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-400 mb-6 font-mono leading-relaxed">
          {product.description}
        </p>

        <div className="mt-auto flex items-end justify-between border-t border-gray-800 pt-4">
          <div className="flex flex-col">
             <span className="text-xs text-gray-600 uppercase">{t(language, 'card.seller')}</span>
             <span className="text-sm text-gray-300 hover:underline">{product.seller}</span>
          </div>
          
          <div className="flex items-end gap-3">
              <div className="text-right">
                 <span className="block text-2xl font-mono text-white">{product.priceBTC} <span className="text-sm text-terminal-green">BTC</span></span>
              </div>
              <button 
                  onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                  }}
                  className="bg-gray-800 hover:bg-terminal-green hover:text-black text-terminal-green border border-terminal-green/50 p-2 transition-colors"
                  title={t(language, 'card.add_fast')}
              >
                  <ShoppingCart size={20} />
              </button>
          </div>
        </div>
      </div>
      
      {/* Hover effect scanline */}
      <div className="absolute inset-0 pointer-events-none bg-terminal-green/5 opacity-0 group-hover:opacity-100 transition-opacity z-20"></div>
    </div>
  );
};
