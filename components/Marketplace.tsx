
import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { Product, Language } from '../types';
import { Search, Filter } from 'lucide-react';
import { t } from '../translations';

interface MarketplaceProps {
  products: Product[];
  categories: string[];
  onProductSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  language: Language;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ products, categories, onProductSelect, onAddToCart, language }) => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]); // Default 'All'/'Alle'
  const [searchQuery, setSearchQuery] = useState('');

  // Update selection if language changes (since categories prop changes)
  React.useEffect(() => {
    if (!categories.includes(selectedCategory)) {
        setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  const filteredProducts = products.filter(p => {
    // Note: categories[0] is 'Alle' or 'All'
    const matchesCategory = selectedCategory === categories[0] || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header / Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 glitch-text" data-text={t(language, 'market.title')}>
            {t(language, 'market.title')}
          </h1>
          <p className="text-gray-500 text-sm font-mono">> {filteredProducts.length} {t(language, 'market.count')}.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative group">
                <input 
                    type="text" 
                    placeholder={t(language, 'market.search_placeholder')}
                    className="bg-black border border-gray-700 text-terminal-green pl-10 pr-4 py-2 w-full sm:w-64 focus:outline-none focus:border-terminal-green transition-colors font-mono text-sm placeholder-gray-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-600 group-focus-within:text-terminal-green" size={16} />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                 {categories.map(cat => (
                     <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border transition-all ${
                            selectedCategory === cat 
                            ? 'bg-terminal-green text-black border-terminal-green' 
                            : 'bg-transparent text-gray-500 border-gray-800 hover:border-gray-500 hover:text-white'
                        }`}
                     >
                        {cat}
                     </button>
                 ))}
            </div>
        </div>
      </div>

      {/* Grid - Adjusted to be wider (max 3 cols) */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <ProductCard 
                key={product.id} 
                product={product} 
                onClick={onProductSelect} 
                onAddToCart={onAddToCart}
                language={language} 
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-600">
            <Filter size={48} className="mb-4 opacity-50" />
            <p className="font-mono text-lg">{t(language, 'market.no_results')}</p>
            <p className="text-sm">{t(language, 'market.no_results_sub')}</p>
        </div>
      )}
    </div>
  );
};
