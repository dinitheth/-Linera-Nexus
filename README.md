
# Linera Nexus

Linera Nexus is a Microchain-Native Agentic AI DApp interface designed for the Linera protocol. It bridges the gap between natural language intent and low-latency blockchain execution, visualizing the unique architecture of Linera's microchain model.

## Overview

Traditional blockchains often suffer from congestion because all transactions go through a single execution queue. Linera solves this by introducing "microchains"—lightweight chains owned by individual users.

Linera Nexus provides a futuristic "Command Center" interface where users interact with their microchain using natural language. An AI agent parses these commands into structured blockchain operations (transfers, NFT minting, DAO voting) and executes them across the simulated network, visualized in real-time.

## Tech Stack

*   **Frontend Framework**: React 19 (ES Modules)
*   **Language**: TypeScript
*   **AI Engine**: Google Gemini API (`@google/genai` SDK)
*   **Visualization**: D3.js (Force-directed graph and particle systems)
*   **Styling**: Tailwind CSS
*   **Fonts**: Inter (UI) & JetBrains Mono (Code/Data)

## Key Features

### 1. Agentic Intent Parsing
Users do not need to deal with complex transaction forms or hex addresses. The application uses Google's Gemini model to parse natural language into executable intents.
*   **Input**: "Pay Alice 50 tokens and mint a cool NFT."
*   **Output**: Generates a multi-step execution plan containing a `TRANSFER` intent and a `MINT_NFT` intent.
*   **Confidence Scoring**: The AI assigns confidence scores to intents based on parameter completeness and specificity.

### 2. Real-Time Microchain Visualization
A D3.js-powered network graph visualizes the state of the local network.
*   **User Chain**: The central node representing the user's wallet.
*   **Counterparty Chains**: Dynamic nodes for recipients (Alice, Bob).
*   **App Chains**: Specialized chains for logic (NFT App, DAO App).
*   **Visual Feedback**: Nodes pulse during processing; particles travel between nodes to represent transactions; colors indicate state (Idle, Processing, Success, Error).

### 3. Interactive Transaction Review
*   **Plan Execution**: Users can review multi-step AI plans before execution.
*   **Granular Details**: Inspect transaction specifics including gas fees, block height, and raw intent parameters.
*   **History**: A log of recent on-chain activity.

### 4. Agent Memory & State
The interface visualizes the internal state of the AI Agent.
*   **Hierarchical KV Store**: Displays configuration and relationship data.
*   **Vector Semantic Recall**: Shows how the agent retrieves context (e.g., past interactions or governance policies) to inform decisions.

## Architecture

The application is structured into three distinct layers:

1.  **UI Layer (React)**
    *   **AIChat**: Handles user input and displays the conversation interface.
    *   **NetworkGraph**: Renders the canvas-based visualization of chains.
    *   **RightPanel**: Manages wallet details, transaction history, and agent memory views.

2.  **Service Layer**
    *   **GeminiIntentService**: Communicates with the Google Gemini API to translate text to JSON intents.
    *   **LineraService (Mock)**: Simulates the Linera protocol. It manages the state of all chains, processes transactions with simulated latency, handles block height increments, and maintains the global ledger state.

3.  **Data Layer**
    *   **Types**: Shared TypeScript interfaces for `Intent`, `ChainNode`, `Transaction`, and `AgentState`.

## Use Cases

*   **DeFi Operations**: "Send 100 TLIN to Bob."
*   **NFT Management**: "Mint a Genesis NFT."
*   **Governance**: "Vote YES on the current DAO proposal."
*   **Complex Workflows**: "Pay Alice 10 tokens and then vote no on the proposal."

## Setup and Installation

1.  **Environment Setup**
    This project uses ES modules and imports React directly from CDNs/ESM providers. It does not require a complex build step like Webpack for the basic structure provided.

2.  **API Key Configuration**
    You must have a Google Gemini API key.
    *   Get a key from Google AI Studio.
    *   The `geminiService.ts` file expects `process.env.API_KEY`. In a local dev environment, you may need to hardcode this or use a `.env` loader depending on your runner.

3.  **Running the Application**
    If running in a local environment with a bundler (like Vite or Create React App):
    ```bash
    npm install
    npm start
    ```

## Why Linera Nexus?

Web3 interfaces are notoriously difficult to use. Linera Nexus demonstrates that by combining **Agentic AI** with **Microchain Scalability**, we can create crypto applications that feel as fast and intuitive as modern chat apps, without sacrificing the trustless nature of the underlying protocol.
