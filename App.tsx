
import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Marketplace } from './components/Marketplace';
import { ChatNegotiation } from './components/ChatNegotiation';
import { Cart } from './components/Cart';
import { Settings } from './components/Settings';
import { Login } from './components/Login';
import { Payment } from './components/Payment';
import { LoadingScreen } from './components/LoadingScreen';
import { DigitalAssetPreview } from './components/DigitalAssetPreview';
import { Takedown } from './components/Takedown';
import { ViewState, Product, CartItem, Language } from './types';
import { getProducts, getCategories, getReviews } from './constants';
import { t } from './translations';
import { Info, User, Star } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LOGIN);
  const [language, setLanguage] = useState<Language>('en');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  const currentProducts = getProducts(language);
  const currentCategories = getCategories(language);

  // Helper to get localized version of a product (even if it's in the cart)
  const getLocalizedProduct = (p: Product) => {
      return currentProducts.find(cp => cp.id === p.id) || p;
  };

  // Map cart items to current language strings
  const localizedCart = cart.map(item => {
      const localized = getLocalizedProduct(item);
      return { ...item, name: localized.name, description: localized.description, origin: localized.origin, imageUrl: localized.imageUrl };
  });

  const localizedSelectedProduct = selectedProduct ? getLocalizedProduct(selectedProduct) : null;

  const handleNavigate = (newView: ViewState) => {
    setView(newView);
    if (newView === ViewState.MARKET) setSelectedProduct(null);
  };

  const handleProductSelect = (product: Product) => {
    // Ensure we store the ID, but UI will always pull localized version
    setSelectedProduct(product);
    setView(ViewState.DETAILS);
  };

  const addItemToCartState = (product: Product, price: number) => {
    setCart(prev => {
        const existing = prev.find(p => p.id === product.id);
        if (existing) {
            return prev.map(p => p.id === product.id ? {...p, quantity: p.quantity + 1} : p);
        }
        return [...prev, { ...product, priceBTC: price, quantity: 1 }];
    });
    triggerNotification(t(language, 'app.notification_added'));
  };

  const handleNegotiatedAddToCart = (price: number) => {
    if (!localizedSelectedProduct) return;
    addItemToCartState(localizedSelectedProduct, price);
    setView(ViewState.CART);
  };

  const handleFastAddToCart = (product: Product) => {
      const localized = getLocalizedProduct(product);
      // Fast add bypasses negotiation and adds at listed price
      addItemToCartState(localized, localized.priceBTC);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const triggerNotification = (msg: string) => {
      setShowNotification(msg);
      setTimeout(() => setShowNotification(null), 3000);
  };

  const handleCheckout = () => {
      // Instead of alert, go to Payment screen
      setView(ViewState.PAYMENT);
  };
  
  const handlePaymentComplete = () => {
      setCart([]);
      setView(ViewState.MARKET);
      triggerNotification(t(language, 'app.order_success'));
  };

  if (view === ViewState.TAKEDOWN) {
      return <Takedown language={language} />;
  }

  if (view === ViewState.LOGIN) {
      return <Login onLogin={() => setView(ViewState.LOADING)} language={language} />;
  }

  if (view === ViewState.LOADING) {
      return <LoadingScreen onComplete={() => setView(ViewState.MARKET)} language={language} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-mono flex flex-col">
      <Navbar 
        currentView={view} 
        onNavigate={handleNavigate} 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
        language={language}
      />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 relative">
        
        {/* Breadcrumb-ish Header */}
        <div className="mb-6 flex items-center text-xs text-gray-600 uppercase tracking-widest">
            <span className="text-terminal-green">root</span>
            <span className="mx-2">/</span>
            <span>{view.toLowerCase()}</span>
            {localizedSelectedProduct && view === ViewState.DETAILS && (
                <>
                    <span className="mx-2">/</span>
                    <span className="text-gray-400">{localizedSelectedProduct.id}</span>
                </>
            )}
        </div>

        {/* Views */}
        {view === ViewState.MARKET && (
          <Marketplace 
            products={currentProducts}
            categories={currentCategories}
            onProductSelect={handleProductSelect} 
            onAddToCart={handleFastAddToCart}
            language={language}
          />
        )}

        {view === ViewState.DETAILS && localizedSelectedProduct && (
          <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
                <button onClick={() => setView(ViewState.MARKET)} className="text-sm text-terminal-green hover:underline">
                    {t(language, 'product.back')}
                </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Detail Left */}
                <div className="space-y-6">
                    <div className="border border-gray-800 bg-black p-1 relative">
                        <div className="w-full h-96 relative overflow-hidden">
                             {localizedSelectedProduct.imageUrl ? (
                                <>
                                    <img 
                                        src={localizedSelectedProduct.imageUrl} 
                                        alt={localizedSelectedProduct.name}
                                        className="w-full h-full object-cover opacity-80" 
                                    />
                                    <div className="absolute inset-0 bg-terminal-green/5 mix-blend-overlay"></div>
                                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.8)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40"></div>
                                </>
                             ) : (
                                <DigitalAssetPreview seed={localizedSelectedProduct.imageSeed} className="w-full h-full opacity-80" />
                             )}
                        </div>
                        <div className="absolute top-4 left-4 bg-black/90 px-3 py-1 border border-terminal-green/50 text-terminal-green text-xs font-bold z-20">
                            {t(language, 'product.verified')}
                        </div>
                    </div>
                    
                    <div className="border border-gray-800 bg-gray-900/20 p-6">
                        <h1 className="text-2xl text-white font-bold mb-2">{localizedSelectedProduct.name}</h1>
                        <p className="text-gray-400 mb-4">{localizedSelectedProduct.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 border-t border-gray-800 pt-4">
                            <div>{t(language, 'product.origin')}: <span className="text-gray-300">{localizedSelectedProduct.origin}</span></div>
                            <div>{t(language, 'product.stock')}: <span className="text-gray-300">{localizedSelectedProduct.stock}</span></div>
                            <div>{t(language, 'card.seller')}: <span className="text-gray-300">{localizedSelectedProduct.seller}</span></div>
                            <div>{t(language, 'product.rating')}: <span className="text-terminal-green">★★★★★ ({localizedSelectedProduct.rating})</span></div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="border border-gray-800 bg-black p-6">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                             <Star className="text-terminal-green" size={16} />
                             {t(language, 'product.reviews_title')}
                        </h3>
                        <div className="space-y-4">
                            {getReviews(language).map((review, idx) => (
                                <div key={idx} className="border-b border-gray-900 pb-3 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-terminal-green text-xs font-bold">{review.user}</span>
                                        <span className="text-gray-600 text-xs">{review.date}</span>
                                    </div>
                                    <div className="text-yellow-500 text-xs mb-1">
                                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                    </div>
                                    <p className="text-gray-400 text-sm italic">"{review.comment}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Chat/Action Right */}
                <div className="space-y-6">
                    <div className="bg-terminal-dim/5 border border-terminal-dim/20 p-4 mb-4">
                        <div className="flex gap-3">
                            <Info className="text-terminal-green flex-shrink-0" size={20} />
                            <p className="text-sm text-gray-400">
                                {t(language, 'product.negotiation_info')} 
                                <span className="block mt-1 text-white font-bold">{localizedSelectedProduct.priceBTC} BTC</span>
                                <span className="block mt-1">{t(language, 'product.negotiation_note')}</span>
                            </p>
                        </div>
                    </div>

                    <ChatNegotiation 
                        product={localizedSelectedProduct} 
                        onAddToCart={handleNegotiatedAddToCart}
                        onCancel={() => setView(ViewState.MARKET)}
                        language={language}
                    />
                </div>
            </div>
          </div>
        )}

        {view === ViewState.CART && (
            <Cart 
                items={localizedCart} 
                onRemove={handleRemoveFromCart} 
                onCheckout={handleCheckout} 
                language={language}
            />
        )}

        {view === ViewState.PAYMENT && (
            <Payment 
                totalAmount={cart.reduce((a, b) => a + (b.priceBTC * b.quantity), 0)}
                onComplete={handlePaymentComplete}
                onCancel={() => setView(ViewState.CART)}
                language={language}
            />
        )}
        
        {view === ViewState.PROFILE && (
            <div className="max-w-2xl mx-auto border border-gray-800 bg-gray-900/30 p-8 text-center animate-fadeIn">
                <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User size={40} className="text-gray-500" />
                </div>
                <h2 className="text-2xl text-white font-bold mb-2">ANONYMOUS</h2>
                <p className="text-gray-500 font-mono text-sm mb-6">ID: 0x9f8...3a2</p>
                <div className="grid grid-cols-3 gap-4 border-t border-gray-800 pt-6">
                    <div>
                        <div className="text-2xl text-terminal-green font-bold">4</div>
                        <div className="text-xs text-gray-600 uppercase">Orders</div>
                    </div>
                    <div>
                        <div className="text-2xl text-terminal-green font-bold">100%</div>
                        <div className="text-xs text-gray-600 uppercase">Reputation</div>
                    </div>
                    <div>
                        <div className="text-2xl text-terminal-green font-bold">0</div>
                        <div className="text-xs text-gray-600 uppercase">Disputes</div>
                    </div>
                </div>
            </div>
        )}

        {view === ViewState.SETTINGS && (
            <Settings 
                language={language} 
                onToggleLanguage={setLanguage}
                onNavigate={handleNavigate}
            />
        )}

      </main>

      {/* Notification Toast */}
      {showNotification && (
          <div className="fixed bottom-8 right-8 bg-terminal-green text-black px-6 py-4 font-bold shadow-[0_0_20px_rgba(0,255,65,0.4)] animate-bounce border-l-4 border-black z-50">
              {showNotification}
          </div>
      )}

      <footer className="border-t border-gray-900 mt-12 py-6">
          <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-700 font-mono">
              <p>{t(language, 'app.footer_text')}</p>
              <p className="mt-1">{t(language, 'app.footer_tor')}</p>
          </div>
      </footer>
    </div>
  );
};

export default App;
