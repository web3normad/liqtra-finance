"use client";

import { useWalletBalances } from "@/hooks/useWalletBalances";
import { useWallet } from "@/hooks/useWallet";

export function SidebarWalletBalances() {
  const { isConnected } = useWallet();
  const { tokens, totalValueUSD, isLoading } = useWalletBalances();

  if (!isConnected) {
    return null;
  }

  return (
    <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700">
      <div className="space-y-3">
        {/* Total Value */}
        <div className="px-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Wallet Balance
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {isLoading ? (
              <span className="animate-pulse">...</span>
            ) : (
              `$${totalValueUSD.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            )}
          </p>
        </div>

        {/* Token List */}
        <div className="space-y-2">
          {isLoading ? (
            // Loading skeleton
            <>
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 animate-pulse"
                >
                  <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12" />
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12" />
                </div>
              ))}
            </>
          ) : (
            tokens
              .filter(
                (token) =>
                  parseFloat(token.balance) > 0 ||
                  token.symbol === "ETH" ||
                  token.symbol === "USDC"
              )
              .map((token) => (
                <div
                  key={token.symbol}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {/* Token Icon */}
                  <div className="relative w-5 h-5 flex-shrink-0">
                    <img
                      src={token.logo}
                      alt={token.symbol}
                      width={20}
                      height={20}
                      className="rounded-full object-contain"
                    />
                  </div>

                  {/* Token Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 dark:text-white">
                      {token.symbol}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {parseFloat(token.balance).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: token.decimals === 18 ? 4 : 2,
                      })}
                    </p>
                  </div>

                  {/* USD Value */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                      $
                      {token.valueUSD.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
