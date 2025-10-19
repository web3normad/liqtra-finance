"use client";

import { useState } from "react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { useWallet } from "@/hooks/useWallet";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useTransactions } from "@/hooks/useTransactions";
import { useProtocolData } from "@/hooks/useProtocolData";
import toast from "react-hot-toast";

export function DepositWithdrawCard() {
  const [amount, setAmount] = useState("");
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");

  const { address, isConnected } = useWallet();
  const { vaultBalance, usdcBalance, needsApproval, isLoading, refetch } =
    usePortfolio();
  const { approveUSDC, deposit, withdraw, isPending } = useTransactions();
  const { getTokenPrice } = useProtocolData();

  const usdcPrice = getTokenPrice("USDC");

  const handleDeposit = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (Number(amount) > Number(usdcBalance)) {
      toast.error("Insufficient USDC balance");
      return;
    }

    // If needs approval, approve first then deposit
    if (needsApproval) {
      await approveUSDC(amount);
      // Wait for approval to complete, then auto-deposit
      setTimeout(async () => {
        await refetch();
        // Check if approval was successful, then deposit
        setTimeout(async () => {
          await deposit(amount);
          setTimeout(() => {
            refetch();
            setAmount("");
          }, 3000);
        }, 1000);
      }, 3000);
    } else {
      // Already approved, just deposit
      await deposit(amount);
      setTimeout(() => {
        refetch();
        setAmount("");
      }, 3000);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (Number(amount) > Number(vaultBalance)) {
      toast.error("Insufficient vault balance");
      return;
    }
    await withdraw(amount);
    setTimeout(() => {
      refetch();
      setAmount("");
    }, 3000);
  };

  const setMaxAmount = () => {
    if (activeTab === "deposit") {
      setAmount(usdcBalance);
    } else {
      setAmount(vaultBalance);
    }
  };

  if (!isConnected) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500 dark:text-gray-400">
          Connect your wallet to deposit or withdraw funds
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <button
            onClick={() => setActiveTab("deposit")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "deposit"
                ? "bg-white dark:bg-gray-700 text-primary-green shadow"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Deposit
          </button>
          <button
            onClick={() => setActiveTab("withdraw")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "withdraw"
                ? "bg-white dark:bg-gray-700 text-primary-green shadow"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Withdraw
          </button>
        </div>

        {/* Balances */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Wallet Balance
            </p>
            <p className="text-lg font-semibold dark:text-white">
              {isLoading ? "..." : `${Number(usdcBalance).toFixed(2)} USDC`}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Vault Balance
            </p>
            <p className="text-lg font-semibold dark:text-white">
              {isLoading ? "..." : `${Number(vaultBalance).toFixed(2)} USDC`}
            </p>
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium dark:text-white">
              Amount
            </label>
            <button
              onClick={setMaxAmount}
              className="text-xs text-primary-green hover:underline"
            >
              MAX
            </button>
          </div>
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-lg"
          />
          {amount && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ≈ ${(Number(amount) * usdcPrice).toFixed(2)} USD
            </p>
          )}
        </div>

        {/* Action Button */}
        <Button
          onClick={activeTab === "deposit" ? handleDeposit : handleWithdraw}
          disabled={isPending || !amount}
          isLoading={isPending}
          className="w-full"
        >
          {activeTab === "deposit"
            ? needsApproval
              ? "Approve & Deposit"
              : "Deposit"
            : "Withdraw"}
        </Button>

        {/* Info */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            {activeTab === "deposit"
              ? "Your funds will be managed by our AI agent to maximize yields across DeFi protocols."
              : "Withdrawals may take a few minutes to process depending on network congestion."}
          </p>
        </div>
      </div>
    </Card>
  );
}
