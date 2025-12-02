import React from 'react';
import { Language, ViewState } from '../types';
import { t } from '../translations';
import { ToggleLeft, ToggleRight, Shield, Globe } from 'lucide-react';

interface SettingsProps {
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  onNavigate: (view: ViewState) => void;
}

export const Settings: React.FC<SettingsProps> = ({ language, onToggleLanguage, onNavigate }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      <div className="border-b border-gray-800 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-white glitch-text" data-text={t(language, 'settings.title')}>
          {t(language, 'settings.title')}
        </h2>
      </div>

      {/* Language Section */}
      <div className="bg-gray-900/40 border border-gray-800 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Globe className="text-terminal-green" size={24} />
          <div>
            <h3 className="text-white font-bold">{t(language, 'settings.language')}</h3>
            <p className="text-sm text-gray-500 font-mono">
              {language === 'de' ? 'Aktuell: DEUTSCH' : 'Current: ENGLISH'}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
            <button 
                onClick={() => onToggleLanguage('en')}
                className={`px-4 py-2 text-xs font-bold border transition-colors ${
                    language === 'en' 
                    ? 'bg-terminal-green text-black border-terminal-green' 
                    : 'bg-black text-gray-500 border-gray-700 hover:text-white'
                }`}
            >
                ENGLISH
            </button>
            <button 
                onClick={() => onToggleLanguage('de')}
                className={`px-4 py-2 text-xs font-bold border transition-colors ${
                    language === 'de' 
                    ? 'bg-terminal-green text-black border-terminal-green' 
                    : 'bg-black text-gray-500 border-gray-700 hover:text-white'
                }`}
            >
                DEUTSCH
            </button>
        </div>
      </div>

      {/* Mock Account Section */}
      <div className="bg-gray-900/40 border border-gray-800 p-6">
         <div className="flex items-center gap-4 mb-4">
            <Shield className="text-terminal-green" size={24} />
            <h3 className="text-white font-bold">{t(language, 'settings.account')}</h3>
         </div>
         <div className="space-y-3 font-mono text-sm">
             <div className="flex justify-between border-b border-gray-800 pb-2">
                 <span className="text-gray-500">PGP Key ID</span>
                 <span className="text-terminal-green">0x9F82...3A21</span>
             </div>
             <div className="flex justify-between border-b border-gray-800 pb-2">
                 <span className="text-gray-500">2FA Status</span>
                 <span className="text-terminal-green">ENABLED (YubiKey)</span>
             </div>
             <div className="flex justify-between">
                 <span className="text-gray-500">Escrow Timeout</span>
                 <span className="text-white">24h</span>
             </div>
         </div>
      </div>

      <div className="pt-8 text-center">
          <button 
            onClick={() => onNavigate(ViewState.MARKET)}
            className="text-sm text-gray-500 hover:text-white hover:underline"
          >
              {t(language, 'product.back')}
          </button>
      </div>
    </div>
  );
};