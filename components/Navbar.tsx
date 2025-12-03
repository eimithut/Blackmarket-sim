
import React, { useState } from 'react';
import { ShoppingCart, Terminal, User, Settings as SettingsIcon, Menu, X } from 'lucide-react';
import { ViewState, Language } from '../types';
import { t } from '../translations';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  cartCount: number;
  language: Language;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, cartCount, language }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNav = (view: ViewState) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-terminal-dim bg-black/90 backdrop-blur-md text-terminal-green shadow-[0_0_15px_rgba(0,255,65,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center cursor-pointer group shrink-0" onClick={() => handleNav(ViewState.MARKET)}>
            <div className="border border-terminal-green p-1 mr-2 group-hover:bg-terminal-green group-hover:text-black transition-colors duration-300">
              <Terminal size={20} />
            </div>
            <span className="font-bold text-xl tracking-tighter">
              SHADOW<span className="text-white">ROUTE</span>_
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => onNavigate(ViewState.MARKET)}
              className={`hover:text-white transition-colors uppercase text-sm tracking-widest ${currentView === ViewState.MARKET ? 'text-white underline decoration-terminal-green underline-offset-4' : ''}`}
            >
              {t(language, 'nav.market')}
            </button>
            <div className="flex items-center space-x-2 text-xs text-gray-400 border border-gray-800 px-3 py-1 bg-gray-900/50">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>{t(language, 'nav.relay')}</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase">{t(language, 'nav.balance')}</p>
              <p className="font-mono text-white">4.2069 BTC</p>
            </div>
          </div>

          {/* Icons (Visible on Mobile & Desktop) */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <button 
                onClick={() => handleNav(ViewState.SETTINGS)}
                className={`p-2 hover:bg-gray-800 rounded-full transition-colors relative hidden sm:block ${currentView === ViewState.SETTINGS ? 'text-terminal-green' : 'text-gray-400'}`}
                title="Settings"
            >
                <SettingsIcon size={20} />
            </button>
            
            <button 
                onClick={() => handleNav(ViewState.PROFILE)}
                className={`p-2 hover:bg-gray-800 rounded-full transition-colors relative hidden sm:block ${currentView === ViewState.PROFILE ? 'text-terminal-green' : 'text-gray-400'}`}
                title="Profile"
            >
                <User size={20} />
            </button>
            
            <button 
              onClick={() => handleNav(ViewState.CART)}
              className={`p-2 hover:bg-gray-800 rounded-full transition-colors relative ${currentView === ViewState.CART ? 'text-terminal-green' : 'text-gray-400'}`}
              title="Cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-black transform translate-x-1/4 -translate-y-1/4 bg-terminal-green rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black border-b border-gray-800 animate-slideDown absolute w-full left-0 top-16 shadow-2xl z-40">
           <div className="px-4 pt-2 pb-6 space-y-4">
              <button 
                onClick={() => handleNav(ViewState.MARKET)}
                className={`block w-full text-left py-3 border-b border-gray-900 uppercase tracking-widest ${currentView === ViewState.MARKET ? 'text-terminal-green font-bold' : 'text-gray-400'}`}
              >
                {t(language, 'nav.market')}
              </button>
              
              <button 
                onClick={() => handleNav(ViewState.SETTINGS)}
                className={`block w-full text-left py-3 border-b border-gray-900 uppercase tracking-widest ${currentView === ViewState.SETTINGS ? 'text-terminal-green font-bold' : 'text-gray-400'}`}
              >
                 {t(language, 'nav.settings')}
              </button>

              <button 
                onClick={() => handleNav(ViewState.PROFILE)}
                className={`block w-full text-left py-3 border-b border-gray-900 uppercase tracking-widest ${currentView === ViewState.PROFILE ? 'text-terminal-green font-bold' : 'text-gray-400'}`}
              >
                 {t(language, 'nav.profile')}
              </button>

              <div className="pt-2 flex justify-between items-center text-sm">
                 <div className="flex items-center space-x-2 text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span>{t(language, 'nav.relay')}</span>
                 </div>
                 <div className="text-right">
                    <span className="text-gray-600 text-xs mr-2">{t(language, 'nav.balance')}:</span>
                    <span className="font-mono text-white">4.2069 BTC</span>
                 </div>
              </div>
           </div>
        </div>
      )}
    </nav>
  );
};
