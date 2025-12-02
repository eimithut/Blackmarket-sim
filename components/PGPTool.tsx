
import React, { useState } from 'react';
import { Lock, Unlock, Copy, X, RefreshCw } from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';

interface PGPToolProps {
  onClose: () => void;
  language: Language;
}

export const PGPTool: React.FC<PGPToolProps> = ({ onClose, language }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('');

  const handleEncrypt = () => {
    if (!input.trim()) return;
    
    // Simulating PGP Encryption wrapping
    const b64 = btoa(input);
    // Split into chunks of 64 chars to look like real PGP
    const chunks = b64.match(/.{1,64}/g)?.join('\n') || b64;
    
    const block = `-----BEGIN PGP MESSAGE-----
Version: ShadowRoute Crypto v2.4

${chunks}
-----END PGP MESSAGE-----`;
    
    setOutput(block);
    setStatus(t(language, 'pgp.generated'));
  };

  const handleDecrypt = () => {
    if (!input.trim()) return;
    
    // Check if it looks like our mock PGP
    if (input.includes('BEGIN PGP MESSAGE')) {
        try {
            // Extract content between headers
            const lines = input.split('\n');
            // Filter out headers and empty lines
            const body = lines.filter(l => !l.startsWith('-----') && !l.startsWith('Version:') && l.trim() !== '').join('');
            const decoded = atob(body);
            setOutput(decoded);
            setStatus('DECRYPTED SUCCESSFULLY');
        } catch (e) {
            setOutput('ERROR: INVALID PGP BLOCK OR CORRUPTED DATA');
        }
    } else {
        // Fallback or error
        setOutput('ERROR: NO PGP HEADERS FOUND');
    }
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(output);
      setStatus('COPIED TO CLIPBOARD');
      setTimeout(() => setStatus(''), 2000);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-2xl bg-black border border-terminal-green shadow-[0_0_50px_rgba(0,255,65,0.2)] flex flex-col h-[600px]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/50">
            <div className="flex items-center gap-2 text-terminal-green">
                <Lock size={20} />
                <h2 className="font-bold tracking-wider">{t(language, 'pgp.title')}</h2>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white">
                <X size={24} />
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
            {/* Input Area */}
            <div className="flex-1 flex flex-col">
                <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t(language, 'pgp.input_placeholder')}
                    className="flex-1 bg-gray-900/30 border border-gray-700 text-white p-3 font-mono text-xs focus:outline-none focus:border-terminal-green resize-none"
                />
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <button 
                    onClick={handleEncrypt}
                    className="flex-1 bg-gray-800 hover:bg-terminal-green hover:text-black text-terminal-green border border-terminal-green/50 py-3 flex items-center justify-center gap-2 transition-colors font-bold uppercase text-xs"
                >
                    <Lock size={14} />
                    {t(language, 'pgp.encrypt_btn')}
                </button>
                <button 
                    onClick={handleDecrypt}
                    className="flex-1 bg-gray-800 hover:bg-white hover:text-black text-white border border-gray-600 py-3 flex items-center justify-center gap-2 transition-colors font-bold uppercase text-xs"
                >
                    <Unlock size={14} />
                    {t(language, 'pgp.decrypt_btn')}
                </button>
            </div>

            {/* Output Area */}
            <div className="flex-1 flex flex-col relative">
                <div className="absolute top-0 right-0 p-2 flex gap-2">
                    {status && <span className="text-terminal-green text-xs font-bold animate-pulse">{status}</span>}
                </div>
                <textarea 
                    readOnly
                    value={output}
                    className="flex-1 bg-black border border-gray-700 text-terminal-green p-3 font-mono text-xs focus:outline-none resize-none"
                />
            </div>

             <div className="flex gap-4">
                <button 
                    onClick={copyToClipboard}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-700 py-2 flex items-center justify-center gap-2 transition-colors font-bold uppercase text-xs"
                >
                    <Copy size={14} />
                    {t(language, 'pgp.copy_btn')}
                </button>
                 <button 
                    onClick={() => { setInput(''); setOutput(''); setStatus(''); }}
                    className="w-24 bg-gray-900 hover:bg-red-900/30 text-gray-500 hover:text-red-500 border border-gray-700 py-2 flex items-center justify-center gap-2 transition-colors font-bold uppercase text-xs"
                >
                    <RefreshCw size={14} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
