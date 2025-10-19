// components/layout/ChatbotSidebar.tsx
"use client";

import { useState, useEffect } from "react";
import { AIChatbot } from "@/components/ai/AIChatbot";
import { CaretLeft, CaretRight, Robot, X } from "@phosphor-icons/react";

interface ChatbotSidebarProps {
  onOpenChange?: (isOpen: boolean) => void;
  isOpen?: boolean;
}

export function ChatbotSidebar({
  onOpenChange,
  isOpen: controlledIsOpen,
}: ChatbotSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false); // Start OPEN by default
  const [isMinimized, setIsMinimized] = useState(false);

  // Always start open so users see the chatbot
  useEffect(() => {
    setIsCollapsed(false); // Open by default
    onOpenChange?.(true);
  }, []);

  // Notify parent when state changes
  const handleToggle = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onOpenChange?.(!newCollapsed);
  };

  const handleClose = () => {
    setIsCollapsed(true);
    onOpenChange?.(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    setIsCollapsed(true);
    onOpenChange?.(false);
  };

  const handleUnminimize = () => {
    setIsMinimized(false);
    setIsCollapsed(false);
    onOpenChange?.(true);
  };

  // Show floating button when collapsed
  if (isCollapsed) {
    return (
      <button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary-green text-white rounded-full shadow-2xl hover:shadow-primary-green/50 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        title="Open AI Assistant"
      >
        <Robot
          size={28}
          weight="duotone"
          className="group-hover:scale-110 transition-transform"
        />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
      </button>
    );
  }

  return (
    <>
      {/* Chatbot Container */}
      <div className="fixed right-0 top-0 h-screen w-96 transition-all duration-300 ease-in-out z-40">
        <div className="h-full bg-white dark:bg-card border-l border-gray-200 dark:border-gray-700 shadow-2xl">
          <AIChatbot
            isOpen={!isCollapsed}
            onClose={handleClose}
            isMinimized={false}
            onToggleMinimize={handleMinimize}
          />
        </div>
      </div>

      {/* Floating Close/Minimize Button at Bottom Right of Chatbot */}
      <button
        onClick={handleClose}
        className="fixed right-4 bottom-6 z-50 w-12 h-12 bg-gray-800 dark:bg-gray-700 text-white rounded-full shadow-xl hover:bg-gray-900 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center group"
        title="Minimize Chat"
      >
        <X
          size={20}
          weight="bold"
          className="group-hover:rotate-90 transition-transform duration-300"
        />
      </button>

      {/* Mobile Overlay */}
      <div
        className="fixed inset-0 bg-black/20 -z-10 lg:hidden"
        onClick={handleClose}
      />
    </>
  );
}
