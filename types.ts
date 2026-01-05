
export enum IntentType {
  TRANSFER = 'TRANSFER',
  MINT_NFT = 'MINT_NFT',
  VOTE_DAO = 'VOTE_DAO',
  QUERY = 'QUERY',
  UNKNOWN = 'UNKNOWN'
}

export interface Intent {
  type: IntentType;
  target: string; // Chain ID or Recipient
  amount?: number;
  params?: Record<string, any>;
  description: string;
  confidence: number;
  reasoning?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  intents?: Intent[]; // Changed from single Intent to array
  status?: 'pending' | 'success' | 'failed' | 'executing';
}

// --- Agent Memory Structures (Rust Mapping) ---

export interface VectorEmbedding {
  id: string;
  content: string;
  vector: number[]; // Simplified float array
  similarity: number; // 0.0 to 1.0
  timestamp: number;
}

export interface MemoryNode {
  key: string;
  value: any;
  type: 'string' | 'object' | 'array';
  children?: MemoryNode[];
}

export interface AgentState {
  kvStore: MemoryNode[];       // Hierarchical Key-Value
  shortTermHistory: string[];  // Recent context
  semanticRecall: VectorEmbedding[]; // Vector Search Results
}

export interface ChainNode {
  id: string;
  label: string;
  type: 'user' | 'agent' | 'app';
  balance: number;
  activityStatus: 'idle' | 'processing' | 'success' | 'error';
  agentState?: AgentState; // New field for complex memory
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  type: string;
  timestamp: number;
  blockHeight: number;
  status: 'confirmed' | 'pending';
  gasFee?: number;
  parameters?: Record<string, any>;
}

export interface LineraStats {
  tps: number;
  finality: number;
  activeChains: number;
  blockHeight: number;
}
