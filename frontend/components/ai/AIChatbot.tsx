// components/ai/AIChatbot.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { useChatbot } from "@/hooks/useChatbot";
import { useAutomation } from "@/hooks/useAutomation";
import { useWallet } from "@/hooks/useWallet";
import {
  PaperPlaneRight,
  Robot,
  X,
  ArrowsOutSimple,
  ArrowsInSimple,
  Trash,
} from "@phosphor-icons/react";

interface AIChatbotProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

// Simple markdown renderer
function formatMessage(content: string) {
  return content.split("\n").map((line, i) => {
    // Handle bullet points
    if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
      return (
        <li key={i} className="ml-4">
          {line.replace(/^[•-]\s*/, "")}
        </li>
      );
    }
    // Handle bold text
    const boldFormatted = line.split("**").map((part, j) =>
      j % 2 === 1 ? (
        <strong key={j} className="font-semibold">
          {part}
        </strong>
      ) : (
        part
      )
    );
    return (
      <p key={i} className="mb-2 last:mb-0">
        {boldFormatted}
      </p>
    );
  });
}

export function AIChatbot({
  isOpen = true,
  onClose,
  isMinimized = false,
  onToggleMinimize,
}: AIChatbotProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    isTyping,
    currentStep,
    selectedProtocols,
    investmentAmount,
    sendMessage,
    resetChat,
  } = useChatbot();
  const {
    executeAutomation,
    isExecuting,
    currentStep: automationStep,
  } = useAutomation();
  const { address } = useWallet();

  const isApproving = automationStep === "approving";
  const isDepositing = automationStep === "depositing";

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Trigger automation when step reaches confirming
  useEffect(() => {
    if (
      currentStep === "confirming_transaction" &&
      investmentAmount &&
      selectedProtocols.length > 0
    ) {
      const amount = parseFloat(investmentAmount);
      if (amount > 0) {
        // Calculate risk level based on selected protocols
        const riskLevel =
          selectedProtocols.length <= 2
            ? "low"
            : selectedProtocols.length <= 4
            ? "medium"
            : "high";
        executeAutomation(riskLevel as any, investmentAmount);
      }
    }
  }, [currentStep, investmentAmount, selectedProtocols, executeAutomation]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const message = inputValue.trim();
    setInputValue("");
    await sendMessage(message);
  };

  const handleQuickReply = async (reply: string) => {
    if (isTyping) return;
    await sendMessage(reply);
  };

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggleMinimize}
          className="w-14 h-14 rounded-full bg-primary-green text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center relative"
        >
          <Robot size={28} weight="duotone" />
          {messages.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
              {messages.filter((m) => m.role === "assistant").length}
            </span>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-card rounded-lg shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-green/20 rounded-full flex items-center justify-center">
            <Robot size={24} weight="duotone" className="text-primary-green" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              AI Yield Assistant
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isTyping ? "Typing..." : "Online"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetChat}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Reset chat"
          >
            <Trash size={18} className="text-gray-500 dark:text-gray-400" />
          </button>
          {onToggleMinimize && (
            <button
              onClick={onToggleMinimize}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Minimize"
            >
              <ArrowsInSimple
                size={18}
                className="text-gray-500 dark:text-gray-400"
              />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Close"
            >
              <X size={18} className="text-gray-500 dark:text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.length === 0 && !address && (
          <div className="text-center py-12">
            <Robot
              size={64}
              weight="duotone"
              className="text-gray-300 dark:text-gray-600 mx-auto mb-4"
            />
            <p className="text-gray-500 dark:text-gray-400">
              Connect your wallet to start chatting!
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === "user"
                  ? "bg-primary-green text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
              }`}
            >
              <div className="text-sm">{formatMessage(message.content)}</div>
              <span className="text-xs opacity-70 mt-1 block">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3">
              <div className="flex gap-1">
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></span>
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></span>
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {currentStep === "showing_opportunities" && (
        <div className="px-4 pb-2">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleQuickReply("yes")}
              className="px-3 py-1.5 text-xs bg-primary-green/10 text-primary-green rounded-full hover:bg-primary-green/20 transition-colors"
              disabled={isTyping}
            >
              ✅ Yes, invest in all
            </button>
            <button
              onClick={() => handleQuickReply("show more details")}
              className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              disabled={isTyping}
            >
              📊 More details
            </button>
          </div>
        </div>
      )}

      {/* Transaction Status */}
      {(isApproving || isDepositing) && (
        <div className="px-4 pb-2">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
              {isApproving
                ? "🔐 Waiting for approval..."
                : "⚡ Depositing to vault..."}
            </p>
          </div>
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            disabled={isTyping || !address}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green text-gray-900 dark:text-white placeholder-gray-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping || !address}
            className="px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-primary-green-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <PaperPlaneRight size={20} weight="fill" />
          </button>
        </div>
      </form>
    </div>
  );
}
