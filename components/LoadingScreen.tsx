

import React, { useEffect, useState, useRef } from 'react';
import { Language } from '../types';
import { t } from '../translations';
import { Terminal, ShieldCheck, Wifi, Cpu, Lock } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
  language: Language;
}

type LoadingStep = {
    key: string;
    delay: number;
    pct: number;
};

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, language }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'success'>('loading');
  const scrollRef = useRef<HTMLDivElement>(null);

  const SEQUENCE: LoadingStep[] = [
      { key: 'loading.mem', delay: 400, pct: 3 },
      { key: 'loading.bios', delay: 800, pct: 7 },
      { key: 'loading.net', delay: 300, pct: 12 },
      { key: 'loading.tor1', delay: 1200, pct: 25 },
      { key: 'loading.tor2', delay: 1500, pct: 45 },
      { key: 'loading.tor3', delay: 1800, pct: 68 },
      { key: 'loading.handshake', delay: 800, pct: 75 },
      { key: 'loading.keys', delay: 600, pct: 88 },
      { key: 'loading.ledger', delay: 1200, pct: 94 },
      { key: 'loading.assets', delay: 1000, pct: 98 },
      { key: 'loading.done', delay: 500, pct: 100 },
  ];

  useEffect(() => {
    let currentStep = 0;
    
    const executeStep = () => {
        if (currentStep >= SEQUENCE.length) {
            // Loading finished, trigger success phase
            setTimeout(() => setPhase('success'), 500);
            return;
        }

        const step = SEQUENCE[currentStep];
        // Translate the key dynamically
        const translatedMsg = t(language, step.key as any);
        
        setLogs(prev => [...prev, `> ${translatedMsg}`]);
        setProgress(step.pct);
        
        currentStep++;
        
        // Schedule next step based on the CURRENT step's delay (simulating that this step takes time)
        setTimeout(executeStep, step.delay);
    };

    // Start sequence
    setTimeout(executeStep, 500);

    // Cleanup not strictly necessary for this logic but good practice
    return () => {};
  }, [language]);

  // Auto-scroll logs
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Handle success phase timer
  useEffect(() => {
      if (phase === 'success') {
          const timer = setTimeout(() => {
              onComplete();
          }, 3500); // Extended wait for animation
          return () => clearTimeout(timer);
      }
  }, [phase, onComplete]);

  if (phase === 'success') {
      return (
          <div className="animate-tv-on overflow-hidden relative">
               {/* Background flash */}
               <div className="absolute inset-0 bg-terminal-green/5 animate-pulse pointer-events-none"></div>
               
               <div className="z-10 text-center space-y-4">
                   <div className="inline-block border-4 border-terminal-green p-8 bg-black shadow-[0_0_50px_rgba(0,255,65,0.4)]">
                       <h1 className="text-4xl md:text-6xl font-black text-terminal-green font-mono tracking-widest glitch-text" data-text={t(language, 'loading.access_granted')}>
                           {t(language, 'loading.access_granted')}
                       </h1>
                   </div>
                   <div className="flex items-center justify-center gap-2 text-white font-mono text-sm mt-4">
                       <ShieldCheck size={16} className="text-terminal-green" />
                       <span>IDENTITY_VERIFIED::0x9f8...3a2</span>
                   </div>
               </div>
               
               {/* Scanlines inside the animated container */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-8 font-mono relative overflow-hidden">
        {/* Dark Matrix background effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%] pointer-events-none"></div>

        <div className="w-full max-w-lg z-10">
            <div className="flex items-center gap-4 mb-8 text-terminal-green">
                <Terminal size={32} className="animate-pulse" />
                <h1 className="text-2xl font-bold tracking-widest">SHADOW<span className="text-white">ROUTE</span>_ CONNECT</h1>
            </div>

            <div className="bg-black border border-gray-800 p-6 shadow-[0_0_30px_rgba(0,255,65,0.05)] h-80 flex flex-col relative">
                <div className="absolute top-2 right-2 flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500 animate-ping delay-75"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-ping delay-150"></div>
                </div>

                <div className="flex-1 space-y-1 overflow-y-auto scrollbar-hide font-mono text-xs" ref={scrollRef}>
                    {logs.map((log, i) => (
                        <div key={i} className="text-gray-400 break-words">
                            <span className="text-terminal-dim mr-2">[{new Date().toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'})}]</span>
                            <span className={i === logs.length - 1 ? 'text-white' : 'text-gray-500'}>{log}</span>
                        </div>
                    ))}
                    <div className="animate-pulse text-terminal-green">_</div>
                </div>

                {/* Technical Stats Overlay */}
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-800 text-[10px] uppercase text-gray-600 font-bold">
                    <div className="flex justify-between">
                        <span>Mem:</span>
                        <span className="text-gray-400">{(progress * 12.4).toFixed(1)} MB</span>
                    </div>
                    <div className="flex justify-between">
                        <span>CPU:</span>
                        <span className="text-gray-400">{(Math.random() * 30 + 10).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Nodes:</span>
                        <span className="text-gray-400">{progress > 50 ? '3/3' : progress > 25 ? '1/3' : '0/3'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Ping:</span>
                        <span className="text-gray-400">{Math.floor(Math.random() * 200 + 50)}ms</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                    <div className="flex justify-between text-xs text-terminal-green mb-1 uppercase tracking-wider font-bold">
                        <span>System Initialization</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-900 h-1.5 overflow-hidden">
                        <div 
                            className="bg-terminal-green h-full transition-all duration-300 ease-out shadow-[0_0_15px_rgba(0,255,65,0.8)] relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-4 gap-2 text-center">
                <div className={`text-[10px] uppercase tracking-widest transition-colors duration-500 ${progress > 5 ? 'text-terminal-green' : 'text-gray-800'}`}>
                    <Cpu size={14} className="mx-auto mb-1" />
                    Kernel
                </div>
                <div className={`text-[10px] uppercase tracking-widest transition-colors duration-500 ${progress > 25 ? 'text-terminal-green' : 'text-gray-800'}`}>
                    <Wifi size={14} className="mx-auto mb-1" />
                    Uplink
                </div>
                 <div className={`text-[10px] uppercase tracking-widest transition-colors duration-500 ${progress > 75 ? 'text-terminal-green' : 'text-gray-800'}`}>
                    <Lock size={14} className="mx-auto mb-1" />
                    Crypto
                </div>
                 <div className={`text-[10px] uppercase tracking-widest transition-colors duration-500 ${progress === 100 ? 'text-terminal-green' : 'text-gray-800'}`}>
                    <Terminal size={14} className="mx-auto mb-1" />
                    Shell
                </div>
            </div>
        </div>
    </div>
  );
};