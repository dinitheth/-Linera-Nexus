
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Intent } from '../types';
import { geminiService } from '../services/geminiService';

interface AIChatProps {
  onIntentConfirmed: (intents: Intent[]) => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const AIChat: React.FC<AIChatProps> = ({ onIntentConfirmed, messages, setMessages }) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    try {
      const result = await geminiService.parseIntent(userMsg.content);
      
      // Construct a readable plan
      let planDisplay = result.summary + "\n\n";
      result.intents.forEach((intent, idx) => {
        planDisplay += `${idx + 1}. ${intent.description}\n`;
        if (intent.target) planDisplay += `   Target: ${intent.target}\n`;
        if (intent.amount) planDisplay += `   Amount: ${intent.amount}\n`;
      });

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: planDisplay.trim(),
        timestamp: Date.now(),
        intents: result.intents,
        status: 'pending'
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: "Error connecting to Agentic Layer.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = (messageId: string, intents: Intent[]) => {
    onIntentConfirmed(intents);
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status: 'success' } : msg
    ));
  };

  return (
    <div className="flex flex-col h-full bg-[#111827] border-r border-linera-700 z-20 shadow-xl">
      <div className="p-4 border-b border-linera-700 bg-linera-800/50 backdrop-blur-sm flex justify-between items-center">
        <h2 className="text-xs font-bold text-gray-100 flex items-center gap-2 uppercase tracking-wider">
           <svg className="w-4 h-4 text-linera-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
           </svg>
           Command Center
        </h2>
        <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${isProcessing ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`}></span>
            <span className="text-[10px] font-mono text-gray-500">v1.1.0</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-gradient-to-b from-[#111827] to-[#0b0f19]">
        {messages.length === 0 && (
          <div className="mt-20 text-center space-y-4 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
            <div className="w-16 h-16 bg-linera-800/50 rounded-full mx-auto flex items-center justify-center border border-linera-700/50 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                 <svg className="w-8 h-8 text-linera-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
            </div>
            <div className="text-gray-300 text-sm font-medium tracking-wide">Linera Nexus Initialized</div>
            <div className="text-xs text-gray-500 max-w-[240px] mx-auto leading-relaxed">
              Connected to local microchain. Explain your intent in natural language to execute transactions.
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-[280px] mx-auto mt-6">
                {['Transfer 10 tokens', 'Mint NFT', 'Pay Bob and Vote'].map(tag => (
                    <span key={tag} className="text-[9px] font-mono bg-linera-800/80 border border-linera-700/80 px-2 py-1 rounded text-linera-400">{tag}</span>
                ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[90%] rounded-lg p-3 text-sm shadow-md border backdrop-blur-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600/10 text-blue-100 border-blue-500/20' 
                : msg.role === 'system' ? 'bg-red-900/10 text-red-400 border-red-900/30'
                : 'bg-[#1F2937]/50 border-linera-600/30 text-gray-300'
            }`}>
              {msg.role === 'assistant' && (
                 <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-700/30">
                     <svg className="w-3 h-3 text-linera-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                     </svg>
                     <span className="text-[10px] font-bold text-linera-accent uppercase tracking-wider">Analysis</span>
                     {msg.intents && msg.intents.length > 1 && (
                        <span className="text-[9px] bg-linera-700 px-1.5 rounded text-gray-300">{msg.intents.length} Steps</span>
                     )}
                 </div>
              )}
              
              <div className="whitespace-pre-wrap font-mono text-xs leading-relaxed opacity-90">{msg.content}</div>
              
              {msg.status === 'success' && (
                 <div className="mt-3 flex items-center gap-2 text-[10px] text-emerald-400 font-mono bg-emerald-900/10 px-2 py-1 rounded border border-emerald-500/20 w-fit">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    EXECUTION CONFIRMED
                 </div>
              )}

              {msg.intents && msg.status === 'pending' && (
                <div className="mt-3 flex gap-2 pt-2 border-t border-gray-600/20">
                  <button 
                    onClick={() => handleConfirm(msg.id, msg.intents!)}
                    className="flex-1 px-3 py-1.5 bg-linera-accent/10 hover:bg-linera-accent/20 text-linera-accent border border-linera-accent/30 text-[10px] font-bold uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2 group"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-linera-accent opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-linera-accent"></span>
                    </span>
                    <span>Execute Plan</span>
                    <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                  <button className="px-3 py-1.5 bg-transparent hover:bg-gray-700/50 text-gray-500 border border-gray-600/30 text-[10px] font-bold uppercase tracking-wider rounded transition-all">
                    Dismiss
                  </button>
                </div>
              )}
            </div>
            <span className="text-[9px] text-gray-600 mt-1.5 ml-1 font-mono uppercase tracking-wide">
                {msg.role === 'assistant' ? 'Nexus' : 'You'} • {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-linera-700 bg-[#111827]">
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter instruction..."
            className="w-full bg-[#0B0F19] text-gray-200 text-sm rounded border border-linera-700 pl-4 pr-12 py-3 focus:outline-none focus:border-linera-500 focus:ring-1 focus:ring-linera-500/20 placeholder-gray-700 font-mono transition-all shadow-inner"
            disabled={isProcessing}
          />
          <button 
            type="submit"
            disabled={isProcessing}
            className="absolute right-2 top-2 p-1.5 text-linera-500 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </form>
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
            {['Pay Bob 50', 'Mint NFT', 'Pay Alice 20 and Vote'].map(suggestion => (
                <button 
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="whitespace-nowrap text-[10px] px-2.5 py-1 bg-linera-800/50 text-gray-500 rounded hover:text-linera-300 hover:bg-linera-700/50 border border-linera-800 hover:border-linera-600 transition-all font-mono"
                >
                    {suggestion}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AIChat;
