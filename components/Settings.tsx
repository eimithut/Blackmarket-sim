
import React, { useState } from 'react';
import { Language, ViewState } from '../types';
import { t } from '../translations';
import { Shield, Globe, Key, AlertTriangle, Eye, EyeOff, Bell, Clock, Trash2, Cpu, Siren } from 'lucide-react';

interface SettingsProps {
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  onNavigate: (view: ViewState) => void;
}

export const Settings: React.FC<SettingsProps> = ({ language, onToggleLanguage, onNavigate }) => {
  const [currency, setCurrency] = useState<'BTC' | 'XMR'>('BTC');
  const [notifications, setNotifications] = useState(true);
  const [javascript, setJavascript] = useState(false); // Default safe
  const [images, setImages] = useState(true);
  const [logoutTimer, setLogoutTimer] = useState('15m');
  const [wiping, setWiping] = useState(false);

  const pgpKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: ShadowRoute KeyGen v1.0

mQENBF2...[TRUNCATED FOR SECURITY]...
...8d7a12
=X9a2
-----END PGP PUBLIC KEY BLOCK-----`;

  const handleWipe = () => {
      setWiping(true);
      setTimeout(() => {
          // In a real app this would clear local storage
          window.location.reload(); 
      }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn pb-12">
      <div className="border-b border-gray-800 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-white glitch-text" data-text={t(language, 'settings.title')}>
          {t(language, 'settings.title')}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* General Section */}
          <div className="bg-gray-900/30 border border-gray-800 p-6 space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-800 pb-3 mb-4">
                  <Globe className="text-terminal-green" size={20} />
                  <h3 className="text-white font-bold uppercase tracking-wider">{t(language, 'settings.section_general')}</h3>
              </div>

              {/* Language */}
              <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{t(language, 'settings.language')}</span>
                  <div className="flex gap-1">
                    <button 
                        onClick={() => onToggleLanguage('en')}
                        className={`px-3 py-1 text-[10px] font-bold border transition-colors ${
                            language === 'en' 
                            ? 'bg-terminal-green text-black border-terminal-green' 
                            : 'bg-black text-gray-500 border-gray-700 hover:text-white'
                        }`}
                    >
                        EN
                    </button>
                    <button 
                        onClick={() => onToggleLanguage('de')}
                        className={`px-3 py-1 text-[10px] font-bold border transition-colors ${
                            language === 'de' 
                            ? 'bg-terminal-green text-black border-terminal-green' 
                            : 'bg-black text-gray-500 border-gray-700 hover:text-white'
                        }`}
                    >
                        DE
                    </button>
                </div>
              </div>

              {/* Currency */}
              <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{t(language, 'settings.currency')}</span>
                  <div className="flex bg-black border border-gray-700 rounded-sm">
                      <button 
                        onClick={() => setCurrency('BTC')}
                        className={`px-3 py-1 text-[10px] font-mono ${currency === 'BTC' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                          BTC
                      </button>
                      <button 
                        onClick={() => setCurrency('XMR')}
                        className={`px-3 py-1 text-[10px] font-mono ${currency === 'XMR' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                          XMR
                      </button>
                  </div>
              </div>

              {/* Notifications */}
              <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">{t(language, 'settings.notifications')}</span>
                  </div>
                  <button onClick={() => setNotifications(!notifications)} className={`relative w-10 h-5 rounded-full transition-colors ${notifications ? 'bg-terminal-green' : 'bg-gray-700'}`}>
                      <div className={`absolute top-1 left-1 bg-black w-3 h-3 rounded-full transition-transform ${notifications ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </button>
              </div>
          </div>

          {/* Security Section */}
          <div className="bg-gray-900/30 border border-gray-800 p-6 space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-800 pb-3 mb-4">
                  <Shield className="text-terminal-green" size={20} />
                  <h3 className="text-white font-bold uppercase tracking-wider">{t(language, 'settings.section_security')}</h3>
              </div>

               {/* JavaScript */}
               <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">{t(language, 'settings.javascript')}</span>
                    {javascript && <AlertTriangle size={12} className="text-yellow-500 animate-pulse" />}
                  </div>
                  <button onClick={() => setJavascript(!javascript)} className={`relative w-10 h-5 rounded-full transition-colors ${javascript ? 'bg-red-500' : 'bg-terminal-green'}`}>
                      <div className={`absolute top-1 left-1 bg-black w-3 h-3 rounded-full transition-transform ${javascript ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </button>
              </div>

               {/* Images */}
               <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{t(language, 'settings.images')}</span>
                  <button onClick={() => setImages(!images)} className={`relative w-10 h-5 rounded-full transition-colors ${images ? 'bg-terminal-green' : 'bg-gray-700'}`}>
                      <div className={`absolute top-1 left-1 bg-black w-3 h-3 rounded-full transition-transform ${images ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </button>
              </div>

              {/* Auto Logout */}
              <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{t(language, 'settings.autologout')}</span>
                  <select 
                    value={logoutTimer} 
                    onChange={(e) => setLogoutTimer(e.target.value)}
                    className="bg-black border border-gray-700 text-gray-300 text-xs p-1 outline-none focus:border-terminal-green"
                  >
                      <option value="5m">5 min</option>
                      <option value="15m">15 min</option>
                      <option value="30m">30 min</option>
                      <option value="1h">1 hour</option>
                  </select>
              </div>
          </div>
      </div>

      {/* PGP Key Section */}
      <div className="bg-gray-900/40 border border-gray-800 p-6">
          <div className="flex items-center gap-4 mb-4">
            <Key className="text-terminal-green" size={20} />
            <h3 className="text-white font-bold uppercase tracking-wider">{t(language, 'settings.pgp_key')}</h3>
         </div>
         <div className="bg-black border border-gray-700 p-3 relative group">
             <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button className="text-[10px] bg-gray-800 text-terminal-green px-2 py-1 uppercase border border-gray-700">Regenerate</button>
             </div>
             <pre className="text-[10px] text-gray-500 font-mono whitespace-pre-wrap break-all">
                 {pgpKey}
             </pre>
         </div>
      </div>

      {/* Danger Zone */}
      <div className="border border-red-900/50 bg-red-950/10 p-6 flex flex-col items-center text-center space-y-6">
          <div className="flex items-center gap-2 text-red-500">
              <AlertTriangle size={24} />
              <h3 className="font-bold uppercase tracking-wider">{t(language, 'settings.section_danger')}</h3>
          </div>
          <p className="text-xs text-gray-500 max-w-md">
              Advanced actions for emergency situations. Use with extreme caution.
          </p>
          
          <div className="flex gap-4 w-full justify-center">
              <button 
                onClick={handleWipe}
                disabled={wiping}
                className={`bg-red-900/20 hover:bg-red-600 hover:text-white text-red-500 border border-red-800 py-3 px-6 font-bold uppercase tracking-widest transition-all ${wiping ? 'w-full' : 'w-auto'}`}
              >
                  {wiping ? (
                      <span className="flex items-center justify-center gap-2">
                          <Trash2 size={16} className="animate-bounce" />
                          {t(language, 'settings.wipe_confirm')}
                      </span>
                  ) : (
                      t(language, 'settings.wipe_btn')
                  )}
              </button>

              {!wiping && (
                  <button 
                    onClick={() => onNavigate(ViewState.TAKEDOWN)}
                    className="bg-blue-900/20 hover:bg-blue-600 hover:text-white text-blue-500 border border-blue-800 py-3 px-6 font-bold uppercase tracking-widest transition-all flex items-center gap-2"
                  >
                      <Siren size={16} />
                      {t(language, 'settings.raid_btn')}
                  </button>
              )}
          </div>
      </div>

      <div className="pt-4 text-center">
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
