"use client";

import { useState } from "react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
  useReadContract,
} from "wagmi";
import { getVaultAddress } from "@/lib/web3/contracts/addresses";
import { VAULT_ABI } from "@/lib/web3/contracts/abis";
import toast from "react-hot-toast";

const RISK_LEVELS = [
  {
    level: 0,
    name: "Conservative",
    description: "Lower risk, stable returns (3-5% APY)",
    color: "bg-green-100 dark:bg-green-900/30 border-green-500",
    icon: "🛡️",
  },
  {
    level: 1,
    name: "Moderate",
    description: "Balanced risk and reward (5-10% APY)",
    color: "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500",
    icon: "⚖️",
  },
  {
    level: 2,
    name: "Aggressive",
    description: "Higher risk, maximum returns (10-20% APY)",
    color: "bg-red-100 dark:bg-red-900/30 border-red-500",
    icon: "🚀",
  },
];

export function RiskLevelCard() {
  const { address } = useAccount();
  const chainId = useChainId();
  const vaultAddress = getVaultAddress(chainId);

  // Get current risk level from contract
  const { data: currentRiskLevel, refetch } = useReadContract({
    address: vaultAddress,
    abi: VAULT_ABI,
    functionName: "userRiskLevel",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const [selectedLevel, setSelectedLevel] = useState<number>(
    currentRiskLevel !== undefined ? Number(currentRiskLevel) : 0
  );

  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSetRiskLevel = async () => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      writeContract({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: "setRiskLevel",
        args: [selectedLevel],
      });

      toast.loading("Setting risk level...", { id: "riskLevel" });
    } catch (err: any) {
      console.error("Set risk level error:", err);
      toast.error(err.message || "Failed to set risk level");
    }
  };

  // Handle transaction confirmation
  if (isSuccess) {
    toast.success("Risk level updated successfully!", { id: "riskLevel" });
    setTimeout(() => refetch(), 2000);
  }

  const currentLevel = RISK_LEVELS[Number(currentRiskLevel) || 0];
  const hasChanged = selectedLevel !== Number(currentRiskLevel);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold dark:text-white mb-2">
            Risk Preference
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Choose your risk tolerance to optimize yield strategies
          </p>
        </div>

        {/* Current Risk Level */}
        {currentRiskLevel !== undefined && (
          <div className={`p-4 rounded-lg border-2 ${currentLevel.color}`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{currentLevel.icon}</span>
              <div>
                <p className="font-semibold dark:text-white">
                  Current: {currentLevel.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentLevel.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Risk Level Options */}
        <div className="space-y-3">
          {RISK_LEVELS.map((risk) => (
            <button
              key={risk.level}
              onClick={() => setSelectedLevel(risk.level)}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                selectedLevel === risk.level
                  ? risk.color
                  : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{risk.icon}</span>
                <div className="text-left flex-1">
                  <p className="font-semibold dark:text-white">{risk.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {risk.description}
                  </p>
                </div>
                {selectedLevel === risk.level && (
                  <svg
                    className="w-6 h-6 text-primary-green"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Update Button */}
        {hasChanged && (
          <Button
            onClick={handleSetRiskLevel}
            disabled={isPending || isConfirming}
            isLoading={isPending || isConfirming}
            className="w-full"
          >
            Update Risk Level
          </Button>
        )}

        {/* Info */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            💡 Your risk level determines which DeFi protocols our AI agent uses
            to maximize your yields. You can change it anytime.
          </p>
        </div>
      </div>
    </Card>
  );
}
