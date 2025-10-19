"use client";

import { useState } from "react";
import {
  Bell,
  MagnifyingGlass,
  Plus,
  Moon,
  Sun,
  Lightning,
} from "@phosphor-icons/react";
import { WalletConnect } from "@/components/wallet/WalletConnect";
import { NetworkSelector } from "@/components/wallet/NetworkSelector";
import { useTheme } from "@/contexts/ThemeContext";
import { useWallet } from "@/hooks/useWallet";
import { useAutomation } from "@/hooks/useAutomation";
import toast from "react-hot-toast";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { address, isConnected } = useWallet();
  const { executeAutomation, isExecuting } = useAutomation();
  const [isAutoInvesting, setIsAutoInvesting] = useState(false);

  const handleAutoInvestToggle = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (isAutoInvesting) {
      setIsAutoInvesting(false);
      toast.success("Auto-invest disabled");
      return;
    }

    try {
      setIsAutoInvesting(true);
      toast.loading("Starting auto-invest with full USDC balance...", {
        id: "auto-invest",
      });

      // Execute automation with medium risk (balanced approach)
      // No amount specified = uses full balance
      await executeAutomation("medium");

      toast.success("Auto-invest completed! Check Active Staking page", {
        id: "auto-invest",
      });
    } catch (error: any) {
      console.error("Auto-invest error:", error);
      toast.error(error.message || "Auto-invest failed", { id: "auto-invest" });
      setIsAutoInvesting(false);
    }
  };

  return (
    <header className="h-20 bg-white dark:bg-card border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm bg-white/80 dark:bg-card/80">
      {/* Left Section */}
      <div className="flex items-center space-x-2 lg:space-x-4 flex-1 min-w-0">
        <div className="relative max-w-[200px] lg:max-w-xs w-full">
          <MagnifyingGlass
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
          />
          <input
            type="text"
            placeholder="Search protocols..."
            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-md pl-10 pr-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-green/50 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0 ml-4">
        {/* Auto-Invest Toggle */}
        {isConnected && (
          <div className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            <Lightning
              size={18}
              weight={isAutoInvesting ? "fill" : "regular"}
              className={
                isAutoInvesting
                  ? "text-primary-green"
                  : "text-gray-500 dark:text-gray-400"
              }
            />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Auto-Invest
            </span>
            <button
              onClick={handleAutoInvestToggle}
              disabled={isExecuting}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2 ${
                isAutoInvesting
                  ? "bg-primary-green"
                  : "bg-gray-300 dark:bg-gray-600"
              } ${
                isExecuting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAutoInvesting ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        )}

        {/* Compact Auto-Invest Toggle for medium screens */}
        {isConnected && (
          <button
            onClick={handleAutoInvestToggle}
            disabled={isExecuting}
            className={`xl:hidden p-2.5 rounded-md transition-all ${
              isAutoInvesting
                ? "bg-primary-green/10 text-primary-green"
                : "bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400"
            } hover:scale-105 ${
              isExecuting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            title={isAutoInvesting ? "Auto-Invest ON" : "Auto-Invest OFF"}
          >
            <Lightning
              size={20}
              weight={isAutoInvesting ? "fill" : "regular"}
            />
          </button>
        )}

        {/* Network Selector */}
        <NetworkSelector />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800/50 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun
              size={20}
              weight="fill"
              className="text-yellow-500 hover:text-yellow-400 transition-colors"
            />
          ) : (
            <Moon
              size={20}
              weight="fill"
              className="text-gray-700 hover:text-primary-green transition-colors"
            />
          )}
        </button>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-md bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <Bell
            size={20}
            weight="fill"
            className="text-gray-600 dark:text-gray-400"
          />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
        </button>

        {/* Deposit Button */}
        <button className="flex items-center space-x-2 px-4 py-2.5 rounded-md bg-primary-green/20 hover:bg-primary-green/30 transition-colors border border-primary-green/50">
          <Plus size={16} weight="bold" className="text-primary-green" />
          <span className="text-primary-green font-medium text-sm">
            Deposit
          </span>
        </button>

        {/* Wallet Connect */}
        <WalletConnect />
      </div>
    </header>
  );
}
