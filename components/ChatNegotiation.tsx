import React, { useState, useEffect, useRef } from 'react';
import { Send, Lock, User, Bot, AlertOctagon } from 'lucide-react';
import { Product, ChatMessage, Language } from '../types';
import { startNegotiation, sendMessageToSeller } from '../services/geminiService';
import { t } from '../translations';

interface ChatNegotiationProps {
  product: Product;
  onAddToCart: (price: number) => void;
  onCancel: () => void;
  language: Language;
}

export const ChatNegotiation: React.FC<ChatNegotiationProps> = ({ product, onAddToCart, onCancel, language }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Reset if language changes or product changes
    setMessages([]);
    setFinalPrice(null);
    initialized.current = false;
  }, [language, product.id]);

  useEffect(() => {
    if (!initialized.current) {
        initialized.current = true;
        initChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, product]);

  const initChat = async () => {
    setLoading(true);
    // Add system-like message
    setMessages([{
        id: 'sys-1',
        sender: 'model',
        text: t(language, 'chat.connecting'),
        timestamp: new Date()
    }]);

    try {
        const reply = await startNegotiation(product.name, product.priceBTC, language);
        setMessages(prev => [...prev, {
            id: 'init-reply',
            sender: 'model',
            text: reply || 'Connection Error',
            timestamp: new Date()
        }]);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await sendMessageToSeller(input);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'model',
        text: reply || 'Error receiving message.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);

      // Simple heuristic to detect if a deal was struck
      const lowerReply = reply?.toLowerCase() || '';
      const confirmationWords = ['deal', 'agreed', 'einverstanden', 'ok'];
      if (confirmationWords.some(w => lowerReply.includes(w))) {
          setFinalPrice(product.priceBTC);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
      onAddToCart(finalPrice || product.priceBTC);
  };

  return (
    <div className="max-w-4xl mx-auto h-[600px] flex flex-col border border-terminal-green bg-black shadow-[0_0_20px_rgba(0,255,65,0.05)]">
      {/* Chat Header */}
      <div className="bg-gray-900 border-b border-terminal-green/30 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(255,0,0,0.8)]"></div>
            <div>
                <h2 className="text-white font-mono font-bold">{t(language, 'chat.header')} // {product.seller}</h2>
                <p className="text-xs text-gray-500">{product.name}</p>
            </div>
        </div>
        <div className="text-right">
            <p className="text-xs text-terminal-green">{t(language, 'chat.encryption')}</p>
            <p className="text-xs text-gray-500">{t(language, 'chat.trace')}</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/80 font-mono relative">
        {/* Background watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Lock size={200} />
        </div>

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 border ${
                msg.sender === 'user' 
                  ? 'bg-gray-900 border-gray-700 text-gray-200' 
                  : 'bg-terminal-dim/10 border-terminal-green/40 text-terminal-green'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 opacity-50 text-[10px] uppercase tracking-wider">
                {msg.sender === 'user' ? <User size={10} /> : <Bot size={10} />}
                <span>{msg.sender === 'user' ? t(language, 'chat.you') : product.seller}</span>
                <span>[{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}]</span>
              </div>
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
             <div className="flex justify-start">
                 <div className="bg-transparent text-terminal-green p-3 text-xs animate-pulse">
                     {t(language, 'chat.decoding')}
                 </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-900 border-t border-terminal-green/30">
        
        {finalPrice ? (
            <div className="flex flex-col items-center justify-center p-4 bg-terminal-green/10 border border-terminal-green mb-2 text-center">
                <p className="text-terminal-green font-bold mb-2">{t(language, 'chat.deal_reached')}</p>
                <div className="flex gap-4">
                    <button 
                        onClick={handleAccept}
                        className="bg-terminal-green text-black font-bold px-6 py-2 hover:bg-white transition-colors uppercase"
                    >
                        {t(language, 'chat.transfer_btn')} ({finalPrice} BTC)
                    </button>
                     <button 
                        onClick={onCancel}
                        className="border border-red-500 text-red-500 font-bold px-6 py-2 hover:bg-red-500 hover:text-white transition-colors uppercase"
                    >
                        {t(language, 'chat.cancel_btn')}
                    </button>
                </div>
            </div>
        ) : (
            <div className="flex gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t(language, 'chat.input_placeholder')}
                className="flex-1 bg-black border border-gray-700 text-gray-200 p-3 focus:outline-none focus:border-terminal-green font-mono text-sm"
                disabled={loading}
            />
            <button 
                onClick={handleSend}
                disabled={loading}
                className="bg-gray-800 hover:bg-terminal-green hover:text-black text-terminal-green border border-terminal-green/50 p-3 transition-colors disabled:opacity-50"
            >
                <Send size={20} />
            </button>
            <button 
                onClick={onCancel}
                className="bg-gray-900 hover:bg-red-900/30 text-gray-500 hover:text-red-500 border border-gray-700 p-3 transition-colors"
                title="Disconnect"
            >
                <AlertOctagon size={20} />
            </button>
            </div>
        )}
      </div>
    </div>
  );
};