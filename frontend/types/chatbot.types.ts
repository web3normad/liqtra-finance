/**
 * AI Chatbot Types
 */

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  metadata?: {
    opportunities?: YieldOpportunity[];
    transactionHash?: string;
    amount?: string;
    status?: 'pending' | 'success' | 'error';
  };
}

export interface YieldOpportunity {
  protocol: string;
  apy: number;
  risk: 'low' | 'medium' | 'high';
  tvl?: string;
  category: string;
}

export interface ChatbotState {
  messages: Message[];
  isTyping: boolean;
  currentStep: 'greeting' | 'showing_opportunities' | 'awaiting_selection' | 'awaiting_amount' | 'confirming_transaction' | 'completed';
  selectedProtocols: string[];
  investmentAmount: string;
  userAddress?: string;
}
