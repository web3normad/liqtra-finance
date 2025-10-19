// hooks/useChatbot.ts
"use client";

import { useState, useCallback, useEffect } from "react";
import { Message, YieldOpportunity, ChatbotState } from "@/types/chatbot.types";
import { useWallet } from "./useWallet";
import { getEnabledProtocols } from "@/lib/web3/contracts/protocols";

export function useChatbot() {
  const { address } = useWallet();
  const [state, setState] = useState<ChatbotState>({
    messages: [],
    isTyping: false,
    currentStep: 'greeting',
    selectedProtocols: [],
    investmentAmount: '',
  });

  // Initialize with greeting when wallet connects
  useEffect(() => {
    if (address && state.messages.length === 0) {
      sendGreeting(address);
    }
  }, [address]);

  const sendGreeting = useCallback((walletAddress: string) => {
    const opportunities = getEnabledProtocols().slice(0, 5);
    
    const greetingMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: `👋 Hi there **${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}**!\n\nI found **${opportunities.length} high-yield opportunities** for you today:\n\n${opportunities.map((opp, i) => 
        `${i + 1}. **${opp.name}** - ${opp.apy}% APY (${opp.risk} risk)`
      ).join('\n')}\n\n💡 Would you like me to help you invest? Just say **"yes"** or tell me which protocols interest you!`,
      timestamp: Date.now(),
      metadata: {
        opportunities: opportunities.map(o => ({
          protocol: o.name,
          apy: o.apy,
          risk: o.risk,
          category: o.category,
        })),
      },
    };

    setState(prev => ({
      ...prev,
      messages: [greetingMessage],
      currentStep: 'showing_opportunities',
      userAddress: walletAddress,
    }));
  }, []);

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));

    return newMessage;
  }, []);

  const setTyping = useCallback((isTyping: boolean) => {
    setState(prev => ({ ...prev, isTyping }));
  }, []);

  const simulateTyping = useCallback(async (message: Omit<Message, 'id' | 'timestamp'>, delay = 1000) => {
    setTyping(true);
    await new Promise(resolve => setTimeout(resolve, delay));
    setTyping(false);
    return addMessage(message);
  }, [setTyping, addMessage]);

  const processUserMessage = useCallback(async (userInput: string) => {
    // Add user message
    addMessage({
      role: 'user',
      content: userInput,
    });

    const input = userInput.toLowerCase().trim();

    // State machine for conversation flow
    switch (state.currentStep) {
      case 'showing_opportunities':
      case 'awaiting_selection':
        if (input.includes('yes') || input.includes('all')) {
          // User wants to invest in suggested protocols
          const opportunities = state.messages[0]?.metadata?.opportunities || [];
          await simulateTyping({
            role: 'assistant',
            content: `🎯 Great choice! You've selected **all ${opportunities.length} protocols**.\n\n💰 How much would you like to invest? Please enter an amount (e.g., 10, 50, 100)`,
          });
          setState(prev => ({
            ...prev,
            currentStep: 'awaiting_amount',
            selectedProtocols: opportunities.map(o => o.protocol),
          }));
        } else if (input.match(/\d+/)) {
          // User selected by number
          const numbers = input.match(/\d+/g)?.map(Number) || [];
          const opportunities = state.messages[0]?.metadata?.opportunities || [];
          const selected = numbers
            .filter(n => n > 0 && n <= opportunities.length)
            .map(n => opportunities[n - 1].protocol);

          if (selected.length > 0) {
            await simulateTyping({
              role: 'assistant',
              content: `✅ Perfect! You've selected:\n${selected.map((p, i) => `${i + 1}. **${p}**`).join('\n')}\n\n💰 How much USDC would you like to invest in total?`,
            });
            setState(prev => ({
              ...prev,
              currentStep: 'awaiting_amount',
              selectedProtocols: selected,
            }));
          }
        } else if (input.includes('no')) {
          await simulateTyping({
            role: 'assistant',
            content: `No problem! Feel free to ask me anything about yield opportunities, or say **"show opportunities"** when you're ready! 😊`,
          });
        } else {
          await simulateTyping({
            role: 'assistant',
            content: `I can help you invest! Try:\n• Say **"yes"** to invest in all protocols\n• Choose specific ones (e.g., "1, 3, 5")\n• Or ask me **"show opportunities"** again`,
          });
        }
        break;

      case 'awaiting_amount':
        const amount = input.match(/[\d.]+/)?.[0];
        if (amount && parseFloat(amount) > 0) {
          setState(prev => ({
            ...prev,
            investmentAmount: amount,
            currentStep: 'confirming_transaction',
          }));
          
          await simulateTyping({
            role: 'assistant',
            content: `💡 Perfect! You're about to invest **${amount} USDC** across **${state.selectedProtocols.length} protocols**.\n\nEach protocol will receive approximately **${(parseFloat(amount) / state.selectedProtocols.length).toFixed(2)} USDC**.\n\n🔐 I'll now open your wallet for approval. Please confirm the transaction!`,
          });

          // Trigger automation flow
          setTimeout(() => {
            setState(prev => ({
              ...prev,
              currentStep: 'completed',
            }));
          }, 500);
        } else {
          await simulateTyping({
            role: 'assistant',
            content: `Please enter a valid amount (e.g., 10, 50, 100)`,
          });
        }
        break;

      case 'completed':
        // Reset conversation
        if (input.includes('again') || input.includes('more') || input.includes('invest')) {
          sendGreeting(address || '');
        } else {
          await simulateTyping({
            role: 'assistant',
            content: `I'm here to help! You can:\n• Say **"show opportunities"** to see new yields\n• Ask about your **"positions"**\n• Or just chat with me! 😊`,
          });
        }
        break;

      default:
        await simulateTyping({
          role: 'assistant',
          content: `I'm here to help you find the best yield opportunities! Say **"show opportunities"** to get started.`,
        });
    }
  }, [state, addMessage, simulateTyping, address, sendGreeting]);

  const resetChat = useCallback(() => {
    if (address) {
      sendGreeting(address);
    } else {
      setState({
        messages: [],
        isTyping: false,
        currentStep: 'greeting',
        selectedProtocols: [],
        investmentAmount: '',
      });
    }
  }, [address, sendGreeting]);

  return {
    messages: state.messages,
    isTyping: state.isTyping,
    currentStep: state.currentStep,
    selectedProtocols: state.selectedProtocols,
    investmentAmount: state.investmentAmount,
    sendMessage: processUserMessage,
    resetChat,
  };
}
