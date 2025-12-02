import React, { useMemo } from 'react';

interface DigitalAssetPreviewProps {
  seed: number;
  className?: string;
  showLabel?: boolean;
}

export const DigitalAssetPreview: React.FC<DigitalAssetPreviewProps> = ({ seed, className = '', showLabel = true }) => {
  const cells = useMemo(() => {
    const result = [];
    let currentSeed = seed;
    // Simple seeded random generator for deterministic patterns
    const random = () => {
      const x = Math.sin(currentSeed++) * 10000;
      return x - Math.floor(x);
    };

    // Generate 8x8 grid values
    for (let i = 0; i < 64; i++) {
       result.push(random());
    }
    return result;
  }, [seed]);

  return (
    <div className={`relative bg-black border border-gray-800 overflow-hidden ${className}`}>
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
        {cells.map((val, idx) => (
          <div 
            key={idx} 
            className="border-[0.5px] border-gray-900/50"
            style={{ 
              backgroundColor: val > 0.6 ? '#00ff41' : 'transparent',
              opacity: val > 0.6 ? val * 0.1 : 0 
            }}
          />
        ))}
      </div>
      
      {/* Central "Icon" constructed from CSS */}
      <div className="absolute inset-0 flex items-center justify-center">
         <div className="relative w-16 h-16 border border-terminal-green/30 bg-black/60 backdrop-blur-sm flex items-center justify-center shadow-[0_0_15px_rgba(0,255,65,0.05)]">
            <div className="absolute inset-0 border-t border-terminal-green/40 w-full top-1/2 -translate-y-1/2"></div>
            <div className="absolute inset-0 border-l border-terminal-green/40 h-full left-1/2 -translate-x-1/2"></div>
            
            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-terminal-green"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-terminal-green"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-terminal-green"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-terminal-green"></div>

            <span className="font-mono text-[10px] text-terminal-green z-10 bg-black px-1 border border-terminal-green/20">
                0x{seed.toString(16).substring(0, 3).toUpperCase()}
            </span>
         </div>
      </div>
      
      {/* Overlay Text details */}
      {showLabel && (
          <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[10px] text-gray-600 font-mono uppercase tracking-wider">
            <span>ENC_DATA::{seed}</span>
            <span>.BIN</span>
          </div>
      )}
      
      {/* Scanline overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>
    </div>
  );
};