
import React from 'react';
import { Language } from '../types';
import { t } from '../translations';
import { Shield, Scale, Flag } from 'lucide-react';

interface TakedownProps {
  language: Language;
}

export const Takedown: React.FC<TakedownProps> = ({ language }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-white text-black flex items-center justify-center p-8 font-serif">
      <div className="max-w-4xl w-full border-8 border-double border-red-700 p-12 bg-[url('https://www.transparenttextures.com/patterns/cardboard.png')] shadow-2xl">
        
        {/* Header Badges */}
        <div className="flex justify-around items-center mb-12 border-b-2 border-red-700 pb-8">
            <div className="flex flex-col items-center">
                <Shield size={80} className="text-blue-900 mb-2" strokeWidth={1.5} />
                <span className="font-bold text-blue-900 tracking-widest">FBI</span>
            </div>
            <div className="flex flex-col items-center">
                <Scale size={80} className="text-black mb-2" strokeWidth={1.5} />
                <span className="font-bold text-black tracking-widest">DOJ</span>
            </div>
            <div className="flex flex-col items-center">
                <Flag size={80} className="text-blue-600 mb-2" strokeWidth={1.5} />
                <span className="font-bold text-blue-600 tracking-widest">EUROPOL</span>
            </div>
        </div>

        {/* Main Title */}
        <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-6xl font-black text-red-700 uppercase tracking-tighter leading-tight">
                {t(language, 'takedown.title')}
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-blue-900 uppercase">
                {t(language, 'takedown.subtitle')}
            </h2>
        </div>

        {/* Legal Text */}
        <div className="bg-gray-100 p-8 border border-gray-300 shadow-inner">
            <p className="text-lg md:text-xl text-center leading-relaxed font-semibold text-gray-800">
                {t(language, 'takedown.text')}
            </p>
        </div>

        {/* Footer */}
        <div className="mt-12 flex justify-center gap-8 opacity-70 grayscale">
            <div className="text-center">
                 <div className="w-16 h-16 border-4 border-black rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-xs">
                     SEAL
                 </div>
                 <span className="text-xs font-bold">DEPT OF JUSTICE</span>
            </div>
             <div className="text-center">
                 <div className="w-16 h-16 border-4 border-black rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-xs">
                     SEAL
                 </div>
                 <span className="text-xs font-bold">BUNDESKRIMINALAMT</span>
            </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-500">
            OPERATION: SHATTERED SHIELD // CASE #99-24-X
        </div>

      </div>
    </div>
  );
};
