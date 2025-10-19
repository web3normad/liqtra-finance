import { Coinbase, Wallet } from '@coinbase/cdp-sdk';
import { ChatOpenAI } from '@langchain/openai';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { Tool } from '@langchain/core/tools';
import { ScanYieldsTool } from './tools/scan-yields';
import { StakeFundsTool } from './tools/stake-funds';
import { RebalancePortfolioTool } from './tools/rebalance';
import Logger from '../utils/logger';

const logger = new Logger('BASE_AGENT');

export interface AgentConfig {
  wallet: Wallet;
  userAddress: string;
  riskTolerance: 'low' | 'medium' | 'high';
  vaultBalance: string; // USDC balance in vault
}

export interface AgentDecision {
  action: 'stake' | 'rebalance' | 'do_nothing';
  protocols: Array<{
    name: string;
    amount: string;
    apy: number;
  }>;
  reasoning: string;
  confidence: number;
}

/**
 * Base AgentKit + LangChain AI Agent
 * 
 * This agent autonomously manages DeFi portfolio by:
 * 1. Scanning yield opportunities
 * 2. Making decisions using LLM
 * 3. Executing transactions on Base network
 */
export class BaseAgent {
  private llm: ChatOpenAI;
  private wallet: Wallet;
  private tools: Tool[];
  private config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
    this.wallet = config.wallet;

    // Initialize OpenAI LLM
    this.llm = new ChatOpenAI({
      modelName: 'gpt-4-turbo-preview',
      temperature: 0.3, // Lower temperature for more consistent decisions
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // Initialize tools
    this.tools = this.initializeTools();

    logger.info('🤖 Base Agent initialized');
    logger.info(`   User: ${config.userAddress}`);
    logger.info(`   Balance: $${config.vaultBalance} USDC`);
    logger.info(`   Risk: ${config.riskTolerance}`);
  }

  /**
   * Initialize LangChain tools for DeFi operations
   */
  private initializeTools(): Tool[] {
    return [
      new ScanYieldsTool({
        riskTolerance: this.config.riskTolerance,
      }),
      new StakeFundsTool({
        wallet: this.wallet,
        userAddress: this.config.userAddress,
      }),
      new RebalancePortfolioTool({
        wallet: this.wallet,
        userAddress: this.config.userAddress,
      }),
    ];
  }

  /**
   * Create system prompt for the agent
   */
  private getSystemPrompt(): string {
    return `You are an expert DeFi portfolio manager AI agent.

Your role:
- Analyze yield opportunities across DeFi protocols
- Make optimal allocation decisions based on APY, risk, and TVL
- Execute transactions autonomously on Base network
- Maximize returns while respecting user's risk tolerance

User Profile:
- Address: ${this.config.userAddress}
- Vault Balance: $${this.config.vaultBalance} USDC
- Risk Tolerance: ${this.config.riskTolerance}

Risk Guidelines:
- LOW: Only blue-chip protocols (Lido, Aave), max 2 protocols, APY < 6%
- MEDIUM: Mix of established protocols, max 3 protocols, APY < 10%
- HIGH: Can include newer protocols, max 5 protocols, no APY limit

Always:
1. Diversify across multiple protocols (don't put everything in one)
2. Consider gas costs (Base is cheap but still matters)
3. Prefer protocols with higher TVL (more secure)
4. Explain your reasoning clearly
5. Be conservative - better safe than sorry

Output Format:
- Action: stake, rebalance, or do_nothing
- Protocols: List of protocols with allocation amounts
- Reasoning: Clear explanation of decision
- Confidence: 0-100 score`;
  }

  /**
   * Execute autonomous portfolio management
   */
  async execute(): Promise<AgentDecision> {
    try {
      logger.info('🚀 Starting autonomous execution...');

      // Create agent executor
      const executor = await initializeAgentExecutorWithOptions(
        this.tools,
        this.llm,
        {
          agentType: 'chat-conversational-react-description',
          verbose: true,
          maxIterations: 5,
        }
      );

      // Execute agent
      const result = await executor.invoke({
        input: `Analyze current DeFi yield opportunities and make an optimal allocation decision for the user's portfolio. Current vault balance: $${this.config.vaultBalance} USDC. Risk tolerance: ${this.config.riskTolerance}.`,
      });

      // Parse agent output
      const decision = this.parseAgentOutput(result.output);

      logger.info('✅ Agent decision made:');
      logger.info(`   Action: ${decision.action}`);
      logger.info(`   Confidence: ${decision.confidence}%`);
      logger.info(`   Reasoning: ${decision.reasoning}`);

      if (decision.protocols.length > 0) {
        logger.info('   Allocations:');
        decision.protocols.forEach((p) => {
          logger.info(`     - ${p.name}: $${p.amount} USDC (${p.apy}% APY)`);
        });
      }

      return decision;
    } catch (error) {
      logger.error('❌ Agent execution failed:', error);
      throw error;
    }
  }

  /**
   * Parse agent output into structured decision
   */
  private parseAgentOutput(output: string): AgentDecision {
    // Default decision
    const decision: AgentDecision = {
      action: 'do_nothing',
      protocols: [],
      reasoning: 'Unable to parse agent output',
      confidence: 0,
    };

    try {
      // Try to extract JSON from output
      const jsonMatch = output.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          action: parsed.action || 'do_nothing',
          protocols: parsed.protocols || [],
          reasoning: parsed.reasoning || 'No reasoning provided',
          confidence: parsed.confidence || 50,
        };
      }

      // Fallback: parse text output
      if (output.toLowerCase().includes('stake')) {
        decision.action = 'stake';
      } else if (output.toLowerCase().includes('rebalance')) {
        decision.action = 'rebalance';
      }

      decision.reasoning = output;
      decision.confidence = 50;

      return decision;
    } catch (error) {
      logger.warn('Failed to parse agent output, using default');
      return decision;
    }
  }

  /**
   * Get wallet address
   */
  getWalletAddress(): string {
    return this.config.userAddress;
  }

  /**
   * Get wallet balance
   */
  async getWalletBalance(): Promise<string> {
    // Implementation would query actual balance
    return this.config.vaultBalance;
  }
}
