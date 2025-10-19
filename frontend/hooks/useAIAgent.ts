import { useState, useCallback } from 'react';
import { usePortfolio } from './usePortfolio';
import { useWallet } from './useWallet';
import { useAutomation } from './useAutomation';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AgentAllocation {
  protocol: string;
  amount: string;
  apy: number;
  percentage: number;
}

export interface AgentTransaction {
  protocol: string;
  txHash: string;
  status: 'pending' | 'success' | 'failed';
}

export interface AgentResult {
  success: boolean;
  action: 'stake' | 'rebalance' | 'do_nothing';
  allocations: AgentAllocation[];
  reasoning: string;
  transactions?: AgentTransaction[];
  error?: string;
}

export function useAIAgent() {
  const { address, isConnected } = useWallet();
  const { portfolioData, riskLevel } = usePortfolio();
  const automation = useAutomation();
  const [lastResult, setLastResult] = useState<AgentResult | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI portfolio manager. I can help you optimize yields, assess risks, and manage your DeFi positions. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Execute autonomous portfolio management with real blockchain transactions
   */
  const executeAutomation = useCallback(async (amount?: string): Promise<AgentResult> => {
    if (!isConnected || !address) {
      const errorMsg = 'Please connect your wallet first';
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      // Convert riskLevel to string type if it's a number
      const riskLevelStr = typeof riskLevel === 'number' 
        ? (riskLevel === 0 ? 'low' : riskLevel === 1 ? 'medium' : 'high')
        : (riskLevel || 'medium');
      
      // Execute real automation (approve -> deposit -> allocate)
      const result = await automation.executeAutomation(riskLevelStr as 'low' | 'medium' | 'high', amount);
      
      // Convert to AgentResult format
      const agentResult: AgentResult = {
        success: result.success,
        action: 'stake',
        allocations: result.allocations,
        reasoning: `Successfully deposited ${result.vaultDeposit} USDC and allocated to ${result.allocations.length} protocols`,
        transactions: result.txHash ? [{
          protocol: 'Vault',
          txHash: result.txHash,
          status: 'success',
        }] : [],
      };
      
      setLastResult(agentResult);
      return agentResult;
    } catch (err: any) {
      console.error('Automation error:', err);
      const errorResult: AgentResult = {
        success: false,
        action: 'do_nothing',
        allocations: [],
        reasoning: err.message || 'Automation failed',
        error: err.message,
      };
      setLastResult(errorResult);
      throw err;
    }
  }, [isConnected, address, riskLevel, automation]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [
              ...messages.map((m) => ({
                role: m.role,
                content: m.content,
              })),
              { role: 'user', content },
            ],
            portfolioData,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get AI response');
        }

        // Handle streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let aiContent = '';

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '',
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            aiContent += chunk;

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessage.id
                  ? { ...msg, content: aiContent }
                  : msg
              )
            );
          }
        }
      } catch (err: any) {
        console.error('AI error:', err);
        setError(err.message || 'Failed to send message');
        
        // Add error message
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, portfolioData]
  );

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Hi! I'm your AI portfolio manager. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
    setError(null);
  }, []);

  return {
    // Chat functionality
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    
    // Automation functionality
    executeAutomation,
    isExecuting: automation.isExecuting,
    lastResult,
    
    // Portfolio stats
    getPortfolioStats: automation.getPortfolioStats,
    getPositions: automation.getPositions,
  };
}
