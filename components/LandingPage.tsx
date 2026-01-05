import React from 'react';

interface LandingPageProps {
  onLaunch: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLaunch }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-linera-accent/30 selection:text-white overflow-y-auto custom-scrollbar">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-[#0B0F19]/80 backdrop-blur-md border-b border-linera-700/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-linera-accent to-linera-purple rounded-lg flex items-center justify-center text-white shadow-lg shadow-linera-accent/20 group">
               <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
               </svg>
            </div>
            <span className="font-bold text-sm tracking-tight text-gray-100 font-sans">Linera Nexus</span>
          </div>
          <button 
            onClick={onLaunch}
            className="bg-linera-accent/10 hover:bg-linera-accent/20 text-linera-accent border border-linera-accent/30 px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all"
          >
            Launch Nexus
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-linera-accent/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-linera-purple/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-linera-800/50 border border-linera-700/50 rounded-full px-3 py-1 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-mono text-linera-400 uppercase tracking-widest">Live Mainnet Simulation</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
            The Nexus for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-linera-accent to-linera-purple">Agentic Microchains</span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Interact with the Linera protocol using natural language. 
            Orchestrate complex transfers, NFT minting, and DAO governance across sharded microchains with sub-second finality.
          </p>

          <button 
            onClick={onLaunch}
            className="group relative inline-flex items-center gap-3 bg-white text-black px-8 py-3 rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            <span>Enter Nexus</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </section>

      {/* Workflow Visualization */}
      <section className="py-20 bg-[#0B0F19] border-y border-linera-700/30">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-16">Architecture & Execution Flow</h2>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Lines (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-linera-accent/50 to-linera-purple/50 border-t border-dashed border-gray-600/30 z-0"></div>

            {/* Step 1: User Intent */}
            <div className="relative z-10 bg-[#111827] border border-linera-700 p-6 rounded-xl hover:border-linera-500/50 transition-colors group">
              <div className="w-12 h-12 bg-linera-800 rounded-lg flex items-center justify-center border border-linera-700 mb-6 group-hover:bg-linera-accent/10 group-hover:text-linera-accent transition-colors">
                 <svg className="w-6 h-6 text-gray-400 group-hover:text-linera-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                 </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">1. Natural Language Intent</h3>
              <p className="text-sm text-gray-500 mb-4 h-10">The user inputs a raw command into the Agentic Interface.</p>
              
              <div className="bg-[#050505] rounded p-3 border border-linera-700/50 font-mono text-xs text-gray-300 flex items-center gap-2">
                 <span className="text-linera-accent">❯</span> "Pay Bob 500"
              </div>
            </div>

            {/* Step 2: Agentic Parsing */}
            <div className="relative z-10 bg-[#111827] border border-linera-700 p-6 rounded-xl hover:border-linera-purple/50 transition-colors group">
              <div className="w-12 h-12 bg-linera-800 rounded-lg flex items-center justify-center border border-linera-700 mb-6 group-hover:bg-linera-purple/10 group-hover:text-linera-purple transition-colors">
                 <svg className="w-6 h-6 text-gray-400 group-hover:text-linera-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                 </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">2. Intent Parsing</h3>
              <p className="text-sm text-gray-500 mb-4 h-10">Gemini AI parses the intent into structured JSON execution parameters.</p>
              
              <div className="bg-[#050505] rounded p-3 border border-linera-700/50 font-mono text-[10px] text-gray-400">
                 <span className="text-purple-400">{"{"}</span><br/>
                 &nbsp;&nbsp;"type": "TRANSFER",<br/>
                 &nbsp;&nbsp;"target": "chain_bob",<br/>
                 &nbsp;&nbsp;"amount": 500<br/>
                 <span className="text-purple-400">{"}"}</span>
              </div>
            </div>

            {/* Step 3: Microchain Execution */}
            <div className="relative z-10 bg-[#111827] border border-linera-700 p-6 rounded-xl hover:border-emerald-500/50 transition-colors group">
              <div className="w-12 h-12 bg-linera-800 rounded-lg flex items-center justify-center border border-linera-700 mb-6 group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
                 <svg className="w-6 h-6 text-gray-400 group-hover:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                 </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">3. Atomic Settlement</h3>
              <p className="text-sm text-gray-500 mb-4 h-10">Linera executes the cross-chain message with &lt;0.2s finality.</p>
              
              <div className="bg-[#050505] rounded p-3 border border-linera-700/50 font-mono text-xs text-gray-300 flex items-center justify-between">
                 <span>Status</span>
                 <span className="flex items-center gap-1.5 text-emerald-500 font-bold bg-emerald-900/10 px-2 py-0.5 rounded border border-emerald-900/30 text-[10px]">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    CONFIRMED
                 </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
                <div>
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                        <span className="w-8 h-8 rounded bg-blue-900/20 text-blue-500 flex items-center justify-center text-sm font-bold border border-blue-900/50">01</span>
                        Linear Scalability
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed pl-11">
                        Unlike traditional blockchains that bottleneck on a single execution queue, Linera adds capacity by adding chains. Your "User Chain" is yours alone, guaranteeing performance.
                    </p>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                        <span className="w-8 h-8 rounded bg-purple-900/20 text-purple-500 flex items-center justify-center text-sm font-bold border border-purple-900/50">02</span>
                        Low-Latency Responsiveness
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed pl-11">
                        Designed for web-speed interactions. Blocks are committed instantly, enabling real-time applications like this chat interface without the "pending transaction" spinner fatigue.
                    </p>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                        <span className="w-8 h-8 rounded bg-emerald-900/20 text-emerald-500 flex items-center justify-center text-sm font-bold border border-emerald-900/50">03</span>
                        Elastic Microchains
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed pl-11">
                        Applications live on their own chains. When you vote in a DAO or mint an NFT, you are interacting with distinct microchains, visualized in our network graph.
                    </p>
                </div>
            </div>
            
            <div className="bg-[#111827] rounded-xl border border-linera-700 p-1 shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500">
                 <div className="bg-[#050505] rounded-lg overflow-hidden border border-linera-700/50">
                     <div className="h-8 bg-[#111827] border-b border-linera-700 flex items-center px-3 gap-2">
                         <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                         <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                         <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                     </div>
                     <div className="p-6 space-y-4 font-mono text-xs">
                         <div className="flex gap-3">
                             <div className="text-blue-400">user@chain:~$</div>
                             <div className="text-gray-300">linera wallet balance</div>
                         </div>
                         <div className="text-gray-500 pl-4">1,000.00 TLIN</div>
                         <div className="flex gap-3">
                             <div className="text-blue-400">user@chain:~$</div>
                             <div className="text-gray-300">linera transfer 500 --to @bob</div>
                         </div>
                         <div className="text-gray-500 pl-4">
                             Certificate confirmed in block 894201<br/>
                             <span className="text-emerald-500">Success. Cost: 0.000001 TLIN</span>
                         </div>
                         <div className="flex gap-3">
                             <div className="text-blue-400">user@chain:~$</div>
                             <div className="animate-pulse">_</div>
                         </div>
                     </div>
                 </div>
            </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 text-center text-xs text-gray-600 border-t border-linera-700/30">
          <p>Powered by Linera Protocol • Google Gemini • React 19</p>
      </footer>
    </div>
  );
};

export default LandingPage;