// components/wallet/NetworkSelector.tsx
"use client";

import { useAccount, useSwitchChain, useChainId } from "wagmi";
import { Check, CaretDown } from "@phosphor-icons/react";
import { useState } from "react";
import { chains } from "@/lib/web3/config";

export function NetworkSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  const currentChain = chains.find((chain) => chain.id === chainId);

  if (!isConnected) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800/50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
      >
        <div className="w-2 h-2 bg-success rounded-full"></div>
        <span className="text-gray-900 dark:text-white font-medium text-sm">
          {currentChain?.name || "Unknown Network"}
        </span>
        <CaretDown size={14} className="text-gray-600 dark:text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-card rounded-md border border-gray-200 dark:border-gray-800 shadow-xl z-50">
            <div className="p-2">
              <p className="text-xs text-gray-600 dark:text-gray-400 px-3 py-2">
                Select Network
              </p>

              {chains.map((chain) => {
                const isActive = chain.id === chainId;

                return (
                  <button
                    key={chain.id}
                    onClick={() => {
                      if (!isActive) {
                        switchChain({ chainId: chain.id });
                      }
                      setIsOpen(false);
                    }}
                    disabled={isPending}
                    className={`
                      w-full flex items-center justify-between px-3 py-2.5 rounded-lg
                      transition-colors
                      ${
                        isActive
                          ? "bg-primary-green/20 text-gray-900 dark:text-white"
                          : "text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    <span className="text-sm font-medium">{chain.name}</span>
                    {isActive && (
                      <Check
                        size={16}
                        className="text-primary-green"
                        weight="bold"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
