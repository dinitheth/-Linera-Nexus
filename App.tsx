import React, { useEffect, useState, useCallback } from 'react';
import Header from './components/Header';
import NetworkGraph from './components/NetworkGraph';
import AIChat from './components/AIChat';
import RightPanel from './components/RightPanel';
import LandingPage from './components/LandingPage';
import { Intent, ChainNode, Transaction, LineraStats, ChatMessage, IntentType } from './types';
import { lineraService } from './services/lineraService';

const HeaderComponent = ({ stats }: { stats: LineraStats }) => (
  <header className="h-16 bg-[#0B0F19]/90 backdrop-blur-md border-b border-linera-700 flex items-center justify-between px-4 md:px-6 z-30 relative shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex-shrink-0">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-linera-accent to-linera-purple rounded-xl flex items-center justify-center text-white shadow-lg shadow-linera-accent/20 ring-1 ring-white/10 group overflow-hidden relative">
        <div className="absolute inset-0 bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <div>
        <h1 className="text-gray-100 font-bold text-sm md:text-base tracking-tight leading-none mb-1 font-sans">Linera Nexus</h1>
        <div className="flex items-center gap-2 text-[8px] md:text-[10px] text-linera-400 font-mono bg-linera-800/50 px-1.5 py-0.5 rounded border border-linera-700/50 w-fit">
           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
           <span className="hidden md:inline">MAINNET SIMULATION</span>
           <span className="md:hidden">MAINNET</span>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-6 lg:gap-10 font-mono text-xs hidden md:flex">
      <div className="text-center group cursor-help">
        <div className="text-linera-500 text-[9px] uppercase tracking-wider mb-0.5 group-hover:text-linera-400 transition-colors">TPS</div>
        <div className="text-gray-200 font-bold bg-linera-800/30 px-2 py-0.5 rounded border border-transparent group-hover:border-linera-700 transition-all">{stats.tps.toLocaleString()}</div>
      </div>
      <div className="text-center group cursor-help">
        <div className="text-linera-500 text-[9px] uppercase tracking-wider mb-0.5 group-hover:text-linera-400 transition-colors">Finality</div>
        <div className="text-emerald-400 font-bold bg-emerald-900/10 px-2 py-0.5 rounded border border-transparent group-hover:border-emerald-500/20 transition-all">&lt; {stats.finality}s</div>
      </div>
      <div className="text-center group cursor-help">
        <div className="text-linera-500 text-[9px] uppercase tracking-wider mb-0.5 group-hover:text-linera-400 transition-colors">Active Chains</div>
        <div className="text-gray-200 font-bold bg-linera-800/30 px-2 py-0.5 rounded border border-transparent group-hover:border-linera-700 transition-all">{stats.activeChains}</div>
      </div>
    </div>

    <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-2 bg-linera-800/80 border border-linera-600 px-2 md:px-3 py-1.5 rounded-full cursor-pointer hover:bg-linera-700 transition-all hover:border-linera-500 shadow-sm">
            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-b from-linera-accent to-blue-700 text-white flex items-center justify-center text-[10px] md:text-xs font-bold ring-2 ring-linera-900">U</div>
            <span className="text-xs text-gray-200 font-medium mr-1 hidden sm:inline">User Wallet</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
    </div>
  </header>
);

type MobileTab = 'chat' | 'visualizer' | 'details';

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [chains, setChains] = useState<ChainNode[]>([]);
  const [stats, setStats] = useState<LineraStats>({ tps: 0, finality: 0, activeChains: 0, blockHeight: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeTransaction, setActiveTransaction] = useState<{from: string, to: string} | null>(null);
  
  const [activeTab, setActiveTab] = useState<MobileTab>('chat');

  useEffect(() => {
    setChains(lineraService.getChains());
    const interval = setInterval(() => {
      setStats(lineraService.getStats());
      setChains(lineraService.getChains());
    }, 500); 

    return () => clearInterval(interval);
  }, []);

  const executeSingleIntent = async (intent: Intent) => {
    let targetId = '';
    
    // Target Resolution
    if (intent.target.toLowerCase().includes('alice')) targetId = 'chain_alice';
    else if (intent.target.toLowerCase().includes('bob')) targetId = 'chain_bob';
    else if (intent.target.toLowerCase().includes('nft')) targetId = 'app_nft';
    else if (intent.target.toLowerCase().includes('dao')) targetId = 'app_dao';
    else targetId = intent.target;

    if (!targetId && intent.type === IntentType.TRANSFER) targetId = 'chain_alice'; // Fallback

    const amount = intent.amount || 0;

    // Visuals
    setActiveTransaction({ from: 'chain_user', to: targetId });
    if (window.innerWidth < 768) setActiveTab('visualizer');

    // Execution Logic
    if (intent.type === IntentType.TRANSFER) {
        await lineraService.executeTransaction('chain_user', targetId, amount, 'TRANSFER');
    } else if (intent.type === IntentType.MINT_NFT) {
        await lineraService.executeTransaction('chain_user', targetId, 0, 'MINT');
        // Mock Mint Record
        setTransactions(prev => [{
            id: 'mint-' + Date.now(),
            from: 'User Chain',
            to: 'NFT App',
            amount: 0,
            type: 'MINT',
            timestamp: Date.now(),
            blockHeight: stats.blockHeight + 1,
            status: 'confirmed'
        }, ...prev]);
    } else {
        await lineraService.executeTransaction('chain_user', targetId, 0, 'EXECUTE');
    }

    // Refresh State
    setChains(lineraService.getChains());
    setTransactions(lineraService.getTransactions());
    
    // Clear Animation
    await new Promise(r => setTimeout(r, 1500));
    setActiveTransaction(null);
  };

  const handleIntents = useCallback(async (intents: Intent[]) => {
      for (const intent of intents) {
          await executeSingleIntent(intent);
          // Small delay between steps for visual separation
          await new Promise(r => setTimeout(r, 500)); 
      }
  }, [stats.blockHeight]);

  const userChain = chains.find(c => c.type === 'user') || { id: 'user', label: 'User', type: 'user', balance: 0, activityStatus: 'idle' };

  if (showLanding) {
    return <LandingPage onLaunch={() => setShowLanding(false)} />;
  }

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-gray-200 overflow-hidden font-sans selection:bg-linera-accent/30 selection:text-white">
      <HeaderComponent stats={stats} />

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative pb-16 md:pb-0">
        {/* Left Panel: AI Chat */}
        <section className={`
            ${activeTab === 'chat' ? 'flex' : 'hidden'} 
            md:flex md:w-1/4 md:min-w-[350px] md:max-w-[450px] 
            h-full z-20 shadow-[4px_0_24px_rgba(0,0,0,0.4)]
        `}>
          <div className="w-full h-full">
            <AIChat 
                onIntentConfirmed={handleIntents} 
                messages={messages} 
                setMessages={setMessages} 
            />
          </div>
        </section>

        {/* Center Panel: Visualization */}
        <section className={`
            ${activeTab === 'visualizer' ? 'flex' : 'hidden'} 
            md:flex md:flex-1 relative bg-[#0B0F19] flex-col h-full
        `}>
          <div className="flex-1 relative w-full h-full p-4 md:p-0 flex flex-col min-h-0">
             {/* Graph Container */}
             <div className="flex-1 min-h-0 relative rounded-lg overflow-hidden border border-linera-800/50 md:border-0">
                <NetworkGraph chains={chains} activeTransaction={activeTransaction} />
             </div>
          </div>
          
          <div className="h-9 bg-[#111827] border-t border-linera-700 flex items-center justify-between px-6 text-[10px] font-mono text-gray-400 z-10 flex-shrink-0">
             <div className="flex items-center gap-3">
                <span className="opacity-70 hidden sm:inline">ORCHESTRATOR STATUS</span>
                <span className="text-emerald-500 flex items-center gap-1.5 bg-emerald-900/10 px-2 py-0.5 rounded border border-emerald-500/10">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    <span className="hidden sm:inline">Policy Engine</span> Active
                </span>
             </div>
             <div className="flex gap-4">
                 <span><span className="hidden sm:inline">SHARD: </span><span className="text-gray-300">us-w-1a</span></span>
                 <span><span className="hidden sm:inline">BLOCK: </span><span className="text-linera-accent font-bold">{stats.blockHeight.toLocaleString()}</span></span>
             </div>
          </div>
        </section>

        {/* Right Panel: App Details */}
        <section className={`
            ${activeTab === 'details' ? 'flex' : 'hidden'}
            md:flex md:w-1/4 md:min-w-[320px] md:max-w-[400px] 
            h-full z-20 shadow-[-4px_0_24px_rgba(0,0,0,0.4)]
        `}>
          <div className="w-full h-full">
            <RightPanel userChain={userChain} transactions={transactions} />
          </div>
        </section>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full h-16 bg-[#111827] border-t border-linera-700 flex justify-around items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
         <button 
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center gap-1 p-2 w-full h-full justify-center transition-colors ${activeTab === 'chat' ? 'text-linera-accent' : 'text-gray-500 hover:text-gray-300'}`}
         >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === 'chat' ? 2 : 1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="text-[10px] font-medium">Assistant</span>
         </button>
         
         <button 
            onClick={() => setActiveTab('visualizer')}
            className={`flex flex-col items-center gap-1 p-2 w-full h-full justify-center transition-colors ${activeTab === 'visualizer' ? 'text-linera-accent' : 'text-gray-500 hover:text-gray-300'}`}
         >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === 'visualizer' ? 2 : 1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-[10px] font-medium">Network</span>
         </button>

         <button 
            onClick={() => setActiveTab('details')}
            className={`flex flex-col items-center gap-1 p-2 w-full h-full justify-center transition-colors ${activeTab === 'details' ? 'text-linera-accent' : 'text-gray-500 hover:text-gray-300'}`}
         >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === 'details' ? 2 : 1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="text-[10px] font-medium">Apps</span>
         </button>
      </nav>
    </div>
  );
};

export default App;