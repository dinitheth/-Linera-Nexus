
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Intent, IntentType } from "../types";

const SYSTEM_INSTRUCTION = `
You are the AI Intent Parser for the Linera Nexus DApp.
Your job is to analyze natural language user commands and convert them into a structured SEQUENCE of intents.
The user is interacting with a blockchain system involving transfers, NFTs, and DAOs.

Target Identification Rules:
- "Alice" -> "chain_alice"
- "Bob" -> "chain_bob"
- "NFT" or "Collection" -> "app_nft"
- "DAO" or "Proposal" -> "app_dao"

Intent Types:
- Transfer tokens -> TRANSFER
- Create/Mint NFT -> MINT_NFT
- Vote or Propose in DAO -> VOTE_DAO
- General questions -> QUERY

Confidence Scoring Algorithm (0.0 to 1.0):
You must calculate a precise confidence score based on Specificity and Parameter Completeness.

Base Score: 0.0
+ 0.4 if the Action/Intent is explicitly stated (e.g., "transfer", "send", "pay", "mint", "vote").
+ 0.3 if the Target Entity is explicitly named and resolvable (e.g., "Alice", "Bob", "DAO").
+ 0.3 if All Required Parameters for that intent are present:
    - TRANSFER: Needs 'amount'.
    - MINT_NFT: Needs 'nftName' or implicit context.
    - VOTE_DAO: Needs 'voteChoice' (yes/no).
    - QUERY: Needs specific subject matter.

Penalties:
- 0.2 if the request relies on vague pronouns ("it", "him") without context.
- 0.5 if the request is gibberish or unrelated.

Examples:
1. "Pay Bob 50 tokens" 
   - Action "Pay" (+0.4) + Target "Bob" (+0.3) + Amount "50" (+0.3) = 1.0 (High)
2. "Send 50" 
   - Action "Send" (+0.4) + Target Missing (0) + Amount "50" (+0.15 partial) = 0.55 (Low/Ambiguous)
3. "Vote yes" 
   - Action "Vote" (+0.4) + Target Implied/DAO (0) + Choice "yes" (+0.3) = 0.7 (Medium)

IMPORTANT: If the user asks for multiple things (e.g., "Pay Bob 10 and then mint an NFT"), you MUST return multiple objects in the 'intents' array.
`;

const INTENT_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    type: {
      type: Type.STRING,
      enum: [
        IntentType.TRANSFER,
        IntentType.MINT_NFT,
        IntentType.VOTE_DAO,
        IntentType.QUERY,
        IntentType.UNKNOWN
      ]
    },
    target: { type: Type.STRING },
    amount: { type: Type.NUMBER },
    params: {
      type: Type.OBJECT,
      properties: {
        nftName: { type: Type.STRING },
        voteChoice: { type: Type.STRING },
        proposalId: { type: Type.STRING }
      }
    },
    description: { type: Type.STRING },
    confidence: { 
      type: Type.NUMBER,
      description: "A calculated score (0.0-1.0) based on action specificity, target resolution, and parameter completeness."
    },
    reasoning: {
      type: Type.STRING,
      description: "A brief explanation of how the confidence score was derived (e.g., 'Target missing', 'Fully specified')."
    }
  },
  required: ["type", "description", "confidence"]
};

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    intents: {
      type: Type.ARRAY,
      items: INTENT_SCHEMA,
      description: "List of actions to execute in order."
    },
    summary: {
      type: Type.STRING,
      description: "A short summary of the entire plan."
    }
  },
  required: ["intents", "summary"]
};

export interface ParsedResponse {
  intents: Intent[];
  summary: string;
}

export class GeminiIntentService {
  private ai: GoogleGenAI;
  private modelId = "gemini-3-flash-preview";

  constructor() {
    const apiKey = process.env.API_KEY || ''; 
    this.ai = new GoogleGenAI({ apiKey });
  }

  async parseIntent(userQuery: string): Promise<ParsedResponse> {
    try {
      const response = await this.ai.models.generateContent({
        model: this.modelId,
        contents: userQuery,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
          temperature: 0.1,
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response from Gemini");
      }

      const parsed = JSON.parse(text) as ParsedResponse;
      return parsed;

    } catch (error) {
      console.error("Gemini Intent Parsing Error:", error);
      return {
        intents: [{
          type: IntentType.UNKNOWN,
          target: '',
          description: "Failed to parse intent.",
          confidence: 0,
          reasoning: "Error connecting to AI service."
        }],
        summary: "I encountered an error parsing that request."
      };
    }
  }
}

export const geminiService = new GeminiIntentService();
