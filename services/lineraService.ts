
import { ChainNode, Transaction, LineraStats, AgentState } from "../types";

// Mock Data for Complex Memory
const MOCK_AGENT_STATE: AgentState = {
  kvStore: [
    {
      key: "config",
      type: "object",
      value: "Settings",
      children: [
        { key: "risk_tolerance", value: "medium", type: "string" },
        { key: "preferred_currency", value: "TLIN", type: "string" }
      ]
    },
    {
      key: "relationships",
      type: "array",
      value: "Known Peers",
      children: [
        { key: "chain_alice", value: "trusted", type: "string" },
        { key: "chain_bob", value: "neutral", type: "string" }
      ]
    }
  ],
  shortTermHistory: [
    "User requested balance check",
    "Analyzed DAO proposal #42",
    "Executed transfer to Bob"
  ],
  semanticRecall: [
    { 
      id: "mem_102", 
      content: "Governance policy regarding high-value transfers requires 2-step verification.", 
      vector: [0.1, 0.9, 0.3], 
      similarity: 0.92,
      timestamp: Date.now() - 100000 
    },
    { 
      id: "mem_055", 
      content: "Alice previously requested a loan of 50 tokens in block #890123.", 
      vector: [0.8, 0.2, 0.5], 
      similarity: 0.78,
      timestamp: Date.now() - 5000000 
    }
  ]
};

// Initial Mock State matching the clean blue visualizer
const INITIAL_CHAINS: ChainNode[] = [
  { 
    id: 'chain_user', 
    label: 'User Chain', 
    type: 'user', 
    balance: 1000, 
    activityStatus: 'idle',
    agentState: MOCK_AGENT_STATE 
  },
  { id: 'chain_alice', label: 'Alice Chain', type: 'agent', balance: 50, activityStatus: 'idle' },
  { id: 'chain_bob', label: 'Bob Chain', type: 'agent', balance: 120, activityStatus: 'idle' },
  { id: 'app_nft', label: 'NFT App', type: 'app', balance: 0, activityStatus: 'idle' },
  { id: 'app_dao', label: 'DAO App', type: 'app', balance: 5000, activityStatus: 'idle' },
];

export class MockLineraService {
  private chains: ChainNode[] = [...INITIAL_CHAINS];
  private transactions: Transaction[] = [];
  private currentBlockHeight = 894200;

  getChains(): ChainNode[] {
    return this.chains.map(c => ({...c}));
  }

  getTransactions(): Transaction[] {
    return [...this.transactions].sort((a, b) => b.timestamp - a.timestamp);
  }

  getStats(): LineraStats {
    // Simulate slight variations
    return {
      tps: 14000 + Math.floor(Math.random() * 500),
      finality: 0.02,
      activeChains: this.chains.length,
      blockHeight: this.currentBlockHeight
    };
  }

  // Simulate executing an intent
  async executeTransaction(fromId: string, toId: string, amount: number, type: string): Promise<boolean> {
    const fromChain = this.chains.find(c => c.id === fromId);
    const toChain = this.chains.find(c => c.id === toId);

    if (!fromChain || !toChain) return false;
    if (fromChain.balance < amount) {
        // Trigger error state on user chain
        fromChain.activityStatus = 'error';
        setTimeout(() => { fromChain.activityStatus = 'idle'; }, 2000);
        return false;
    }

    // Set processing status on target (Agent/App) to visualize activity
    toChain.activityStatus = 'processing';

    // Simulate Network Latency (2s to allow visualization of processing state)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update State
    fromChain.balance -= amount;
    toChain.balance += amount;
    this.currentBlockHeight++;

    // Set success status
    toChain.activityStatus = 'success';
    
    // Auto-reset to idle after a delay
    setTimeout(() => {
        toChain.activityStatus = 'idle';
    }, 3000);

    const tx: Transaction = {
      id: Math.random().toString(36).substring(7),
      from: fromChain.label,
      to: toChain.label,
      amount,
      type,
      timestamp: Date.now(),
      blockHeight: this.currentBlockHeight,
      status: 'confirmed',
      gasFee: 0.000002 + Math.random() * 0.000005,
      parameters: type === 'MINT' 
        ? { collection: "Genesis", standard: "ERC721", uri: "ipfs://Qmb..." } 
        : { currency: "TLIN", memo: "Agentic Transfer" }
    };

    this.transactions.push(tx);
    return true;
  }
}

export const lineraService = new MockLineraService();
