"use client";

import { Card } from "@/components/common/Card";
import { useWalletBalances } from "@/hooks/useWalletBalances";
import { useWallet } from "@/hooks/useWallet";
import Image from "next/image";

export function WalletBalances() {
  const { isConnected } = useWallet();
  const { tokens, totalValueUSD, totalChange24h, isLoading } =
    useWalletBalances();

  if (!isConnected) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold dark:text-white">
              Wallet Balances
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Connected wallet assets
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Refresh balances"
          >
            <svg
              className="w-5 h-5 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>

        {/* Total Value */}
        <div className="p-4 bg-gradient-to-br from-primary-green/10 to-primary-green-light/10 border border-primary-green/20 rounded-lg">
          <div className="flex items-baseline gap-2">
            <h4 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isLoading ? (
                <span className="animate-pulse">...</span>
              ) : (
                `$${totalValueUSD.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              )}
            </h4>
            {!isLoading && totalChange24h !== 0 && (
              <span
                className={`text-sm font-medium ${
                  totalChange24h >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {totalChange24h >= 0 ? "+" : ""}
                {totalChange24h.toFixed(2)}%
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Total Wallet Value
          </p>
        </div>

        {/* Token List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse"
                >
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                  </div>
                </div>
              ))}
            </div>
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
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {/* Token Icon */}
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <Image
                      src={token.logo}
                      alt={token.symbol}
                      width={40}
                      height={40}
                      className="rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/assets/icons/token-default.svg";
                      }}
                    />
                  </div>

                  {/* Token Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {token.symbol}
                      </h4>
                      {token.change24h !== undefined &&
                        token.change24h !== 0 && (
                          <span
                            className={`text-xs font-medium ${
                              token.change24h >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {token.change24h >= 0 ? "+" : ""}
                            {token.change24h.toFixed(2)}%
                          </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {parseFloat(token.balance).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: token.decimals === 18 ? 4 : 2,
                      })}{" "}
                      {token.symbol}
                    </p>
                  </div>

                  {/* Value */}
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      $
                      {token.valueUSD.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      $
                      {token.priceUSD.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Empty State */}
        {!isLoading && tokens.every((t) => parseFloat(t.balance) === 0) && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              No tokens found in wallet
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Get test tokens from faucets to get started
            </p>
          </div>
        )}

        {/* Info Banner */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            💡 Balances update automatically. Only showing tokens with value or
            commonly used tokens (ETH, USDC).
          </p>
        </div>
      </div>
    </Card>
  );
}
