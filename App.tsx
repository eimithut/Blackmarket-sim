
import React, { useState, useEffect } from 'react';
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

  // Feature: Hold 'c' for 4 seconds to trigger Takedown
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if 'c' is pressed and it's not a repeated event (holding key sends multiple events)
      if (e.key.toLowerCase() === 'c' && !e.repeat) {
        timer = setTimeout(() => {
          setView(ViewState.TAKEDOWN);
        }, 4000);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'c') {
        clearTimeout(timer);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearTimeout(timer);
    };
  }, []);

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
                            <div>{t(language, 'product.rating')}: <span className="text-terminal-green flex items-center gap-1"><Star size={12} fill="currentColor" /> {localizedSelectedProduct.rating}</span></div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Chat or Reviews */}
                 <div className="space-y-6">
                     <ChatNegotiation 
                        product={localizedSelectedProduct}
                        onAddToCart={handleNegotiatedAddToCart}
                        onCancel={() => setView(ViewState.MARKET)}
                        language={language}
                     />
                     
                     {/* Reviews */}
                     <div className="border border-gray-800 bg-gray-900/20 p-6">
                         <h3 className="text-white font-bold mb-4 uppercase text-sm border-b border-gray-800 pb-2">{t(language, 'product.reviews_title')}</h3>
                         <div className="space-y-4">
                             {getReviews(language).map((review, idx) => (
                                 <div key={idx} className="text-sm">
                                     <div className="flex justify-between items-center mb-1">
                                         <span className="text-gray-300 font-bold">{review.user}</span>
                                         <span className="text-xs text-gray-600">{review.date}</span>
                                     </div>
                                     <div className="flex text-terminal-green mb-1">
                                         {[...Array(5)].map((_, i) => (
                                             <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-800"} />
                                         ))}
                                     </div>
                                     <p className="text-gray-500 italic">"{review.comment}"</p>
                                 </div>
                             ))}
                         </div>
                     </div>
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

        {view === ViewState.SETTINGS && (
            <Settings 
                language={language} 
                onToggleLanguage={setLanguage} 
                onNavigate={setView}
            />
        )}
        
        {view === ViewState.PROFILE && (
             <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                 <User size={48} className="mb-4 opacity-50" />
                 <p>PROFILE DATA ENCRYPTED</p>
                 <p className="text-xs">Access Restricted to Owner</p>
             </div>
        )}

        {view === ViewState.PAYMENT && (
             <Payment 
                totalAmount={cart.reduce((a, b) => a + (b.priceBTC * b.quantity), 0)}
                onComplete={handlePaymentComplete}
                onCancel={() => setView(ViewState.CART)}
                language={language}
             />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-xs text-gray-600 mb-2">{t(language, 'app.footer_text')}</p>
            <p className="text-[10px] text-gray-700 font-mono">{t(language, 'app.footer_tor')}</p>
            <p className="text-[10px] text-red-900/50 mt-4">{t(language, 'app.disclaimer')}</p>
        </div>
      </footer>

      {/* Notifications */}
      {showNotification && (
          <div className="fixed bottom-4 right-4 bg-terminal-green text-black px-6 py-3 font-bold shadow-[0_0_20px_rgba(0,255,65,0.4)] animate-slideIn">
              {showNotification}
          </div>
      )}
    </div>
  );
};

export default App;
