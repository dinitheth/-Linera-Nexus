
import React, { useState } from 'react';
import { Transaction, ChainNode, MemoryNode } from '../types';

interface RightPanelProps {
  userChain: ChainNode;
  transactions: Transaction[];
}

const RightPanel: React.FC<RightPanelProps> = ({ userChain, transactions }) => {
  const [activeTab, setActiveTab] = useState<'wallet' | 'memory' | 'dao'>('wallet');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  
  // Local state for DAO interaction
  const [proposalVotes, setProposalVotes] = useState({ yes: 70, no: 30, total: 100 });
  const [userVote, setUserVote] = useState<'yes' | 'no' | null>(null);

  const handleVote = (vote: 'yes' | 'no') => {
      if (userVote) return; // Prevent double voting
      setUserVote(vote);
      setProposalVotes(prev => ({
          ...prev,
          [vote]: prev[vote] + 1,
          total: prev.total + 1
      }));
  };

  const yesPercent = Math.round((proposalVotes.yes / proposalVotes.total) * 100);
  const noPercent = 100 - yesPercent;

  // Recursive component for Hierarchical Store
  const MemoryTree = ({ nodes, depth = 0 }: { nodes: MemoryNode[], depth?: number }) => (
    <div className="space-y-1">
        {nodes.map((node) => (
            <div key={node.key} style={{ paddingLeft: `${depth * 12}px` }}>
                <div className="flex items-center gap-2 text-xs font-mono py-1 hover:bg-linera-800/50 rounded px-1 group cursor-default">
                    <span className="text-linera-500">{depth === 0 ? '▼' : '├'}</span>
                    <span className="text-linera-purple">{node.key}:</span>
                    {node.children ? (
                        <span className="text-gray-500 text-[10px] italic">[{node.children.length} items]</span>
                    ) : (
                        <span className="text-emerald-400">"{node.value}"</span>
                    )}
                </div>
                {node.children && <MemoryTree nodes={node.children} depth={depth + 1} />}
            </div>
        ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#111827] border-l border-linera-700 shadow-xl z-20">
      {/* Tabs */}
      <div className="flex border-b border-linera-700 bg-linera-900/50">
        {['wallet', 'memory', 'dao'].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab as any); setSelectedTx(null); }}
            className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 ${
              activeTab === tab 
                ? 'text-linera-accent border-b-2 border-linera-accent bg-linera-800/50' 
                : 'text-gray-600 hover:text-gray-400 hover:bg-linera-800/30'
            }`}
          >
            {tab === 'memory' ? 'Brain' : tab}
          </button>
        ))}
      </div>

      <div className="p-6 flex-1 overflow-y-auto custom-scrollbar relative">
        {activeTab === 'wallet' && (
          <div className="space-y-6">
            
            {selectedTx ? (
              // --- Transaction Detail View ---
              <div className="animate-[fadeIn_0.3s_ease-out]">
                 <button 
                    onClick={() => setSelectedTx(null)}
                    className="flex items-center gap-2 text-[10px] font-bold text-gray-500 hover:text-linera-accent mb-4 transition-colors uppercase tracking-wider"
                 >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Activity
                 </button>

                 <div className="bg-[#0f141e] border border-linera-700 rounded-lg overflow-hidden shadow-lg">
                    <div className="p-4 border-b border-linera-700/50 bg-linera-800/30 flex justify-between items-center">
                        <span className="text-xs font-mono text-gray-400">Transaction Details</span>
                        <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-bold bg-emerald-900/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            CONFIRMED
                        </div>
                    </div>
                    
                    <div className="p-5 space-y-6">
                        <div className="text-center">
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total Amount</div>
                            <div className="text-2xl font-bold text-white font-mono flex items-center justify-center gap-2">
                                {selectedTx.amount.toFixed(4)} <span className="text-linera-accent text-sm">TLIN</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-linera-800/30 p-3 rounded border border-linera-700/30">
                                <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">From</div>
                                <div className="text-xs text-gray-300 font-mono truncate">{selectedTx.from}</div>
                            </div>
                            <div className="bg-linera-800/30 p-3 rounded border border-linera-700/30">
                                <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">To</div>
                                <div className="text-xs text-gray-300 font-mono truncate">{selectedTx.to}</div>
                            </div>
                            <div className="bg-linera-800/30 p-3 rounded border border-linera-700/30">
                                <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">Gas Fee</div>
                                <div className="text-xs text-amber-400 font-mono">{(selectedTx.gasFee || 0.000002).toFixed(6)} TLIN</div>
                            </div>
                            <div className="bg-linera-800/30 p-3 rounded border border-linera-700/30">
                                <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">Block Height</div>
                                <div className="text-xs text-linera-accent font-mono">#{selectedTx.blockHeight}</div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="text-[9px] text-gray-500 uppercase tracking-widest">Intent Parameters</div>
                            <div className="bg-[#050505] p-3 rounded border border-linera-700/50 font-mono text-[10px] text-gray-400 overflow-x-auto">
                                <pre>{JSON.stringify(selectedTx.parameters || {}, null, 2)}</pre>
                            </div>
                        </div>

                         <div className="space-y-2">
                            <div className="text-[9px] text-gray-500 uppercase tracking-widest">Transaction Hash</div>
                            <div className="flex items-center gap-2">
                                <div className="bg-[#050505] p-2 rounded border border-linera-700/50 font-mono text-[9px] text-gray-500 truncate flex-1">
                                    0x{selectedTx.id}8293...19283
                                </div>
                                <button className="p-2 hover:bg-linera-700/50 rounded transition-colors text-gray-400">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                 </div>
              </div>
            ) : (
              // --- Default View ---
              <>
                {/* Balance Card */}
                <div className="relative overflow-hidden rounded p-6 border border-linera-700/50 shadow-2xl group bg-[#0f141e]">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-linera-accent/10 to-transparent rounded-bl-full pointer-events-none"></div>
                   <div className="relative z-10">
                     <div className="flex justify-between items-start mb-4">
                        <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">Microchain Balance</p>
                        <div className="w-5 h-5 rounded bg-linera-800/80 flex items-center justify-center border border-linera-700 text-gray-400">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                        </div>
                     </div>
                     <h2 className="text-2xl font-bold text-gray-100 mb-6 tracking-tight font-mono">
                       {userChain.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-linera-accent text-sm font-normal">TLIN</span>
                     </h2>
                     <div className="flex gap-3">
                       <button className="flex-1 bg-linera-100 hover:bg-white text-linera-900 py-2 rounded text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm">
                         Send
                       </button>
                       <button className="flex-1 bg-linera-800 hover:bg-linera-700 text-gray-300 py-2 rounded text-[10px] font-bold uppercase tracking-wider transition-all border border-linera-700">
                         Receive
                       </button>
                     </div>
                   </div>
                </div>

                {/* Recent Transactions List */}
                <div>
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-4 pl-1">Recent Activity</h3>
                  <div className="space-y-2">
                    {transactions.slice(0, 5).map((tx) => {
                      const isIncoming = tx.to === userChain.label;
                      return (
                        <div 
                            key={tx.id} 
                            onClick={() => setSelectedTx(tx)}
                            className="bg-linera-800/30 hover:bg-linera-800/50 rounded p-3 border border-linera-700/30 hover:border-linera-600 flex items-center justify-between transition-all duration-200 group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded flex items-center justify-center border ${
                              isIncoming ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500' : 'bg-rose-500/5 border-rose-500/10 text-rose-500'
                            }`}>
                               <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  {isIncoming 
                                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                  }
                               </svg>
                            </div>
                            <div>
                              <p className="text-xs text-gray-300 font-medium leading-none mb-1 group-hover:text-linera-accent transition-colors">
                                {isIncoming ? `From ${tx.from}` : `To ${tx.to}`}
                              </p>
                              <p className="text-[9px] text-gray-600 font-mono uppercase">Block {tx.blockHeight}</p>
                            </div>
                          </div>
                          <div className={`text-xs font-mono font-bold ${
                               isIncoming ? 'text-emerald-500' : 'text-gray-500'
                          }`}>
                            {isIncoming ? '+' : '-'}{tx.amount.toFixed(2)}
                          </div>
                        </div>
                      );
                    })}
                    {transactions.length === 0 && (
                        <div className="text-center text-[10px] text-gray-700 py-8 border border-dashed border-linera-800 rounded">No transactions recorded</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'memory' && (
            <div className="space-y-6">
                {/* Agent Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-linera-700/50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 p-[1px]">
                        <div className="w-full h-full rounded-full bg-linera-900 flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-200">Agent Cortex</h3>
                        <p className="text-[9px] text-gray-500 font-mono">STATE HASH: 0x8f2...a9d</p>
                    </div>
                </div>

                {/* Hierarchical Store */}
                <div>
                     <h4 className="text-[10px] font-bold text-linera-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-linera-purple rounded-sm"></span>
                        Hierarchical KV Store
                     </h4>
                     <div className="bg-[#0f141e] border border-linera-700/50 rounded-lg p-3 overflow-hidden shadow-inner">
                        {userChain.agentState?.kvStore ? (
                            <MemoryTree nodes={userChain.agentState.kvStore} />
                        ) : (
                            <div className="text-gray-600 text-xs italic">Memory empty</div>
                        )}
                     </div>
                </div>

                {/* Vector Embeddings */}
                <div>
                     <h4 className="text-[10px] font-bold text-linera-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-sm"></span>
                        Semantic Recall (Vector DB)
                     </h4>
                     <div className="space-y-2">
                        {userChain.agentState?.semanticRecall?.map((mem) => (
                            <div key={mem.id} className="bg-linera-800/30 border border-linera-700/30 rounded p-3 hover:bg-linera-800/50 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[9px] font-mono text-gray-500 bg-linera-900/50 px-1.5 py-0.5 rounded border border-linera-700/30">{mem.id}</span>
                                    <div className="flex items-center gap-1">
                                        <div className="h-1 w-12 bg-gray-800 rounded-full overflow-hidden">
                                            <div style={{width: `${mem.similarity * 100}%`}} className="h-full bg-emerald-500"></div>
                                        </div>
                                        <span className="text-[9px] text-emerald-400 font-bold">{(mem.similarity * 100).toFixed(0)}%</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-300 leading-relaxed border-l-2 border-emerald-500/20 pl-2">
                                    {mem.content}
                                </p>
                            </div>
                        ))}
                     </div>
                </div>
            </div>
        )}

        {activeTab === 'dao' && (
             <div className="space-y-5">
                 <div className="p-5 bg-gradient-to-b from-linera-800/30 to-[#0b0f19] rounded border border-linera-700/50 shadow-lg relative overflow-hidden">
                     {/* Active Indicator Strip */}
                     <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-500"></div>
                     
                     <div className="flex justify-between items-start mb-3 pl-2">
                         <h4 className="text-sm font-bold text-gray-200">Proposal #42: Protocol v2</h4>
                         <span className="text-[9px] bg-amber-900/10 text-amber-500 px-2 py-0.5 rounded border border-amber-800/30 font-bold tracking-wider">VOTING</span>
                     </div>
                     <p className="text-[10px] text-gray-500 mb-5 leading-relaxed pl-2">Implements parallel commit for faster finality across sharded chains. Hard fork simulation required.</p>
                     
                     {/* Voting Progress */}
                     <div className="mb-5 pl-2">
                        <div className="flex justify-between text-[9px] font-mono mb-1.5 uppercase tracking-wider">
                             <span className="text-emerald-500 font-bold">FOR {yesPercent}%</span>
                             <span className="text-rose-500 font-bold">AGAINST {noPercent}%</span>
                        </div>
                        {/* Striped Progress Bar */}
                        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden flex relative">
                            <div style={{ width: `${yesPercent}%` }} className="bg-emerald-600 h-full transition-all duration-700 ease-out"></div>
                            <div style={{ width: `${noPercent}%` }} className="bg-rose-600 h-full transition-all duration-700 ease-out"></div>
                        </div>
                     </div>

                     {/* Action Buttons */}
                     <div className="flex gap-3 pl-2">
                        <button 
                            onClick={() => handleVote('yes')}
                            disabled={userVote !== null}
                            className={`flex-1 py-2 rounded text-[9px] font-bold uppercase tracking-wider transition-all border ${
                                userVote === 'yes' 
                                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' 
                                : userVote === null 
                                    ? 'bg-linera-800/50 border-linera-700 text-gray-400 hover:bg-linera-700 hover:text-gray-200'
                                    : 'bg-transparent border-gray-800 text-gray-700 opacity-50 cursor-not-allowed'
                            }`}
                        >
                            {userVote === 'yes' ? 'Voted For' : 'Vote For'}
                        </button>
                        <button 
                            onClick={() => handleVote('no')}
                            disabled={userVote !== null}
                            className={`flex-1 py-2 rounded text-[9px] font-bold uppercase tracking-wider transition-all border ${
                                userVote === 'no' 
                                ? 'bg-rose-500/10 border-rose-500/50 text-rose-500' 
                                : userVote === null 
                                    ? 'bg-linera-800/50 border-linera-700 text-gray-400 hover:bg-linera-700 hover:text-gray-200'
                                    : 'bg-transparent border-gray-800 text-gray-700 opacity-50 cursor-not-allowed'
                            }`}
                        >
                            {userVote === 'no' ? 'Voted Against' : 'Vote Against'}
                        </button>
                     </div>
                 </div>
             </div>
        )}
      </div>
    </div>
  );
};

export default RightPanel;
