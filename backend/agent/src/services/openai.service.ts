import OpenAI from 'openai';
import { CONFIG } from '../config/constants';
import { PortfolioContext, AgentDecision } from '../types';
import Logger from '../utils/logger';

const logger = new Logger('OPENAI');

export class OpenAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: CONFIG.OPENAI_API_KEY,
    });
  }

  async makeDecision(context: PortfolioContext): Promise<AgentDecision> {
    try {
      const tools: OpenAI.Chat.ChatCompletionTool[] = [
        {
          type: 'function',
          function: {
            name: 'rebalance_portfolio',
            description: 'Move funds from one protocol to another for better yield',
            parameters: {
              type: 'object',
              properties: {
                from_protocol: {
                  type: 'string',
                  enum: ['aave', 'compound', 'moonwell'],
                  description: 'Protocol to withdraw from',
                },
                to_protocol: {
                  type: 'string',
                  enum: ['aave', 'compound', 'moonwell'],
                  description: 'Protocol to deposit to',
                },
                amount: {
                  type: 'number',
                  description: 'Amount in USDC (e.g., 1000.50)',
                },
                reason: {
                  type: 'string',
                  description: 'Explanation for this decision',
                },
              },
              required: ['from_protocol', 'to_protocol', 'amount', 'reason'],
            },
          },
        },
        {
          type: 'function',
          function: {
            name: 'do_nothing',
            description: 'Keep current allocation, no action needed',
            parameters: {
              type: 'object',
              properties: {
                reason: {
                  type: 'string',
                  description: 'Why no action is needed',
                },
              },
              required: ['reason'],
            },
          },
        },
      ];

      const systemPrompt = `You are Floquidity, an AI DeFi portfolio manager.

User's risk level: ${context.user.risk_level}

DECISION RULES:
${CONFIG.MIN_APY_DIFFERENCE}% minimum APY difference to rebalance
- Only move if APY difference > ${CONFIG.MIN_APY_DIFFERENCE}%
- Gas costs must be < ${CONFIG.MAX_GAS_PERCENTAGE}% of amount moved
- Conservative users: Only use Aave and Compound (highest safety scores)
- Balanced users: Can use all three protocols
- Aggressive users: Prioritize highest APY

SAFETY RULES:
- Never move funds if safety scores are below user's risk tolerance
- Always explain your reasoning clearly
- Consider gas costs in your decision`;

      const userPrompt = `Current portfolio state:
      
Vault Balance: $${(Number(context.balances.vault) / 1e6).toFixed(2)} USDC
Current Allocations:
- Aave: $${(Number(context.balances.aave) / 1e6).toFixed(2)} (APY: ${context.market.aave_apy}%)
- Compound: $${(Number(context.balances.compound) / 1e6).toFixed(2)} (APY: ${context.market.compound_apy}%)
- Moonwell: $${(Number(context.balances.moonwell) / 1e6).toFixed(2)} (APY: ${context.market.moonwell_apy}%)

Gas Price: ${Number(context.gas_price) / 1e9} gwei

What action should I take?`;

      logger.debug('Sending request to OpenAI', { user: context.user.wallet_address });

      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        tools,
        tool_choice: 'auto',
      });

      const message = response.choices[0].message;

      if (!message.tool_calls || message.tool_calls.length === 0) {
        return {
          action: 'do_nothing',
          reason: 'AI did not suggest any action',
        };
      }

      const toolCall = message.tool_calls[0];
      const functionName = 'function' in toolCall ? toolCall.function.name : 'unknown_function';
      const args = 'arguments' in toolCall ? JSON.parse(toolCall.arguments as string) : {};

      logger.info('AI Decision', { function: functionName, args });

      if (functionName === 'rebalance_portfolio') {
        return {
          action: 'rebalance',
          from_protocol: args.from_protocol,
          to_protocol: args.to_protocol,
          amount: BigInt(Math.floor(args.amount * 1e6)), // Convert to USDC decimals
          reason: args.reason,
        };
      }

      return {
        action: 'do_nothing',
        reason: args.reason || 'Current allocation is optimal',
      };
    } catch (error) {
      logger.error('OpenAI API error', error);
      return {
        action: 'do_nothing',
        reason: 'Error communicating with AI',
      };
    }
  }
}
