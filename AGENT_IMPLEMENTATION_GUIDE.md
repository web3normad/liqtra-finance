# AI Agent Automation - Implementation Guide

## 🤖 Base AgentKit + LangChain Integration

This document outlines the implementation of autonomous DeFi portfolio management using Coinbase Developer Platform (CDP) AgentKit and LangChain.

---

## 📦 Step 1: Install Dependencies

### Backend Agent Dependencies

```bash
cd backend/agent

# Install CDP AgentKit
npm install @coinbase/cdp-agentkit-core @coinbase/cdp-sdk

# Install LangChain
npm install langchain @langchain/core @langchain/openai

# Install additional tools
npm install @langchain/community axios zod

# Update existing
npm install --save-dev @types/node typescript ts-node
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  User clicks "Automate" button                        │  │
│  │  → Sends request to API                               │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                     API LAYER (Next.js API)                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  POST /api/agent/automate                            │  │
│  │  → Validates user & wallet                           │  │
│  │  → Calls agent service                               │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  AGENT SERVICE (LangChain + CDP)            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  1. Perception: Scan DeFi opportunities              │  │
│  │  2. Decision: AI analyzes with LLM                   │  │
│  │  3. Execution: CDP AgentKit executes on Base        │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  BASE BLOCKCHAIN (Sepolia)                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Smart Contracts: Vault, Lido, Aave, Uniswap        │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 Environment Variables

Add to `backend/agent/.env`:

```env
# Coinbase Developer Platform
CDP_API_KEY_NAME=your-cdp-api-key-name
CDP_API_KEY_PRIVATE_KEY=your-cdp-private-key

# OpenAI
OPENAI_API_KEY=sk-your-openai-key

# Network
NETWORK_ID=base-sepolia
RPC_URL=https://sepolia.base.org

# Contracts
VAULT_CONTRACT=0x8962C42bFE1f011194f6DF329500D1b34b9844d1
USDC_CONTRACT=0x036CbD53842c5426634e7929541eC2318f3dCF7e

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/liqtra
```

---

## 🛠️ Implementation Files

### File Structure

```
backend/agent/src/
├── agent/
│   ├── base-agent.ts         # CDP AgentKit + LangChain agent
│   ├── tools/                # Custom tools for DeFi
│   │   ├── scan-yields.ts    # Scan DeFi protocols
│   │   ├── stake-funds.ts    # Stake in protocols
│   │   ├── rebalance.ts      # Rebalance portfolio
│   │   └── withdraw.ts       # Withdraw from protocols
│   └── prompts.ts            # LangChain prompts
├── services/
│   ├── agent.service.ts      # Main agent service
│   └── defi.service.ts       # DeFi protocol interactions
└── index.ts                  # Entry point

frontend/app/api/
└── agent/
    ├── automate/route.ts     # POST /api/agent/automate
    └── status/route.ts       # GET /api/agent/status
```

---

## 📝 Key Features

### 1. Autonomous Yield Optimization

- Scans top DeFi protocols (Lido, Aave, Compound, Uniswap)
- Analyzes APY, risk, TVL, and user preferences
- Automatically stakes in best opportunities

### 2. Risk Management

- Respects user risk tolerance (conservative/moderate/aggressive)
- Diversifies across multiple protocols
- Monitors for market changes

### 3. Rebalancing

- Continuously monitors portfolio performance
- Rebalances when better opportunities arise
- Minimizes gas costs with batch transactions

### 4. Smart Execution

- Uses CDP AgentKit for secure transaction signing
- Handles approval + staking in single flow
- Retries on failure with exponential backoff

---

## 🔄 Agent Workflow

```
User Click "Automate"
        ↓
┌───────────────────────────────────┐
│ 1. PERCEPTION                     │
│ • Get user balance from vault     │
│ • Scan DeFi protocols (DeFiLlama)│
│ • Get current gas prices          │
│ • Get user risk preference        │
└───────────────┬───────────────────┘
                ↓
┌───────────────────────────────────┐
│ 2. DECISION (LangChain + OpenAI)  │
│ • Analyze opportunities           │
│ • Consider risk/reward            │
│ • Calculate optimal allocation    │
│ • Generate execution plan         │
└───────────────┬───────────────────┘
                ↓
┌───────────────────────────────────┐
│ 3. EXECUTION (CDP AgentKit)       │
│ • Approve token spending          │
│ • Stake in protocol(s)            │
│ • Update database                 │
│ • Return results to frontend      │
└───────────────┬───────────────────┘
                ↓
        Success! ✅
```

---

## 🎯 Next Steps

1. Install dependencies (see commands above)
2. Set up CDP API credentials
3. Implement agent files (provided below)
4. Test on Base Sepolia
5. Deploy to production

---

## 📚 Resources

- [CDP AgentKit Docs](https://docs.cdp.coinbase.com/agentkit/docs/welcome)
- [LangChain Docs](https://js.langchain.com/docs/)
- [Base Network](https://docs.base.org/)
- [DeFiLlama API](https://defillama.com/docs/api)

---

Let's implement this step by step!
