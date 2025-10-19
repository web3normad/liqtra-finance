// components/wallet/WalletBalance.tsx
"use client";

import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";
import { TrendUp, TrendDown } from "@phosphor-icons/react";

export function WalletBalance() {
  const { address, isConnected, chain } = useAccount();
  const { data: balance, isLoading } = useBalance({
    address: address,
  });

  if (!isConnected) {
    return (
      <div className="bg-card rounded-md p-6 border border-gray-800">
        <p className="text-gray-400 text-center">
          Connect your wallet to view balance
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-card rounded-md p-6 border border-gray-800">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-700 rounded w-24"></div>
          <div className="h-8 bg-gray-700 rounded w-32"></div>
        </div>
      </div>
    );
  }

  const formattedBalance = balance
    ? parseFloat(formatEther(balance.value)).toFixed(4)
    : "0.0000";

  return (
    <div className="bg-card rounded-md p-6 border border-gray-800">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-400 text-sm mb-1">Wallet Balance</p>
          <h3 className="text-3xl font-bold text-white">
            {formattedBalance} {balance?.symbol}
          </h3>
        </div>
        <div className="px-3 py-1 rounded-lg bg-success/20 text-success text-xs font-medium">
          {chain?.name}
        </div>
      </div>

      {/* Mock percentage change - replace with real data */}
      <div className="flex items-center space-x-2">
        <TrendUp size={16} className="text-success" weight="bold" />
        <span className="text-success text-sm font-medium">+5.2% today</span>
      </div>
    </div>
  );
}
