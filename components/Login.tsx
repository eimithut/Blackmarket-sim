import React, { useState, useEffect, useRef } from 'react';
import { Language, ViewState } from '../types';
import { t } from '../translations';
import { Lock, AlertTriangle, RefreshCw } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  language: Language;
}

export const Login: React.FC<LoginProps> = ({ onLogin, language }) => {
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaChallenge, setCaptchaChallenge] = useState('');
  const [error, setError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate a random string and draw it on canvas
  const generateCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaChallenge(result);
    drawCaptcha(result);
  };

  const drawCaptcha = (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Noise (lines)
    for (let i = 0; i < 15; i++) {
        ctx.strokeStyle = `rgba(0, 255, 65, ${Math.random() * 0.5})`;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
    }

    // Noise (dots)
    for (let i = 0; i < 50; i++) {
        ctx.fillStyle = `rgba(0, 255, 65, ${Math.random() * 0.8})`;
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }

    // Text
    ctx.font = 'bold 28px Courier New';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw each char with slight rotation
    const charWidth = canvas.width / (text.length + 2);
    let x = charWidth;
    
    for(let i=0; i<text.length; i++) {
        const char = text[i];
        const angle = (Math.random() - 0.5) * 0.4; // +/- rotation
        ctx.save();
        ctx.translate(x, canvas.height/2);
        ctx.rotate(angle);
        ctx.fillStyle = '#00ff41';
        ctx.fillText(char, 0, 0);
        ctx.restore();
        x += charWidth;
    }
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (captchaInput.toUpperCase() === captchaChallenge) {
        onLogin();
    } else {
        setError(true);
        setCaptchaInput('');
        generateCaptcha();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="w-full max-w-md border border-terminal-green bg-black shadow-[0_0_30px_rgba(0,255,65,0.1)] p-8 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-terminal-green animate-pulse"></div>
        
        <div className="text-center mb-8">
            <Lock className="mx-auto text-terminal-green mb-4" size={48} />
            <h1 className="text-2xl font-mono text-white tracking-widest glitch-text" data-text={t(language, 'login.title')}>
                {t(language, 'login.title')}
            </h1>
            <p className="text-xs text-gray-500 mt-2 font-mono">GATEWAY: 7357...onion</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-xs text-terminal-green mb-1 uppercase tracking-wider">{t(language, 'login.username')}</label>
                <input 
                    type="text" 
                    className="w-full bg-gray-900 border border-gray-700 text-white p-3 focus:outline-none focus:border-terminal-green font-mono"
                    required
                />
            </div>
             <div>
                <label className="block text-xs text-terminal-green mb-1 uppercase tracking-wider">{t(language, 'login.password')}</label>
                <input 
                    type="password" 
                    className="w-full bg-gray-900 border border-gray-700 text-white p-3 focus:outline-none focus:border-terminal-green font-mono"
                    required
                />
            </div>

            <div className="border border-gray-800 p-4 bg-gray-900/30">
                <label className="block text-xs text-terminal-green mb-2 uppercase tracking-wider flex justify-between">
                    <span>{t(language, 'login.captcha')}</span>
                    <button type="button" onClick={generateCaptcha} className="text-gray-500 hover:text-white">
                        <RefreshCw size={14} />
                    </button>
                </label>
                <div className="flex gap-4">
                    <canvas 
                        ref={canvasRef} 
                        width="160" 
                        height="50" 
                        className="border border-gray-700 bg-black cursor-pointer"
                        onClick={generateCaptcha}
                        title="Click to refresh"
                    />
                    <input 
                        type="text" 
                        value={captchaInput}
                        onChange={(e) => { setCaptchaInput(e.target.value); setError(false); }}
                        className="w-full bg-gray-900 border border-gray-700 text-white p-2 font-mono text-center text-xl uppercase placeholder-gray-700 focus:outline-none focus:border-terminal-green"
                        maxLength={6}
                        placeholder="XXXXXX"
                    />
                </div>
                {error && (
                    <div className="flex items-center gap-2 text-red-500 text-xs mt-2 font-bold animate-pulse">
                        <AlertTriangle size={12} />
                        {t(language, 'login.error_captcha')}
                    </div>
                )}
            </div>

            <button 
                type="submit"
                className="w-full bg-terminal-green text-black font-bold py-3 hover:bg-white transition-colors uppercase tracking-widest text-sm"
            >
                {t(language, 'login.enter_btn')}
            </button>
        </form>
      </div>
    </div>
  );
};