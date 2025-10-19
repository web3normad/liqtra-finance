"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { useWallet } from "@/hooks/useWallet";
import { usePortfolio } from "@/hooks/usePortfolio";
import { formatUnits } from "viem";
import {
  Robot,
  Lightning,
  ShieldCheck,
  ChartLineUp,
  Coins,
  ArrowRight,
  WarningCircle,
  CheckCircle,
} from "@phosphor-icons/react";

interface AutomateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: string) => Promise<void>;
  riskLevel: number;
}

export function AutomateModal({
  isOpen,
  onClose,
  onConfirm,
  riskLevel,
}: AutomateModalProps) {
  const { address } = useWallet();
  const { usdcBalance, vaultBalance } = usePortfolio();
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  // Get available balance
  const availableBalance = usdcBalance ? parseFloat(usdcBalance) : 0;

  // Reset amount when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setError("");
    }
  }, [isOpen]);

  // Validate amount
  const validateAmount = (value: string): boolean => {
    const numValue = parseFloat(value);

    if (!value || isNaN(numValue)) {
      setError("Please enter a valid amount");
      return false;
    }

    if (numValue <= 0) {
      setError("Amount must be greater than 0");
      return false;
    }

    if (numValue < 1) {
      setError("Minimum amount is 1 USDC");
      return false;
    }

    if (numValue > availableBalance) {
      setError(
        `Insufficient balance. Available: ${availableBalance.toFixed(2)} USDC`
      );
      return false;
    }

    setError("");
    return true;
  };

  // Handle amount change
  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    if (value && !/^\d*\.?\d*$/.test(value)) return;

    setAmount(value);
    if (value) {
      validateAmount(value);
    } else {
      setError("");
    }
  };

  // Set max amount
  const handleMaxClick = () => {
    const maxAmount = availableBalance.toString();
    setAmount(maxAmount);
    validateAmount(maxAmount);
  };

  // Handle confirm
  const handleConfirm = async () => {
    if (!validateAmount(amount)) return;

    setIsProcessing(true);
    try {
      await onConfirm(amount);
      onClose();
    } catch (error: any) {
      setError(error.message || "Failed to start automation");
    } finally {
      setIsProcessing(false);
    }
  };

  // Get risk level details
  const getRiskDetails = () => {
    switch (riskLevel) {
      case 0:
        return {
          label: "Low Risk",
          color: "text-success",
          bgColor: "bg-success/20",
          protocols: "2 protocols",
          apy: "< 6% APY",
          description: "Conservative: Aave, Compound, Lido",
        };
      case 1:
        return {
          label: "Medium Risk",
          color: "text-warning",
          bgColor: "bg-warning/20",
          protocols: "3 protocols",
          apy: "< 10% APY",
          description: "Balanced: Mix of established protocols",
        };
      case 2:
        return {
          label: "High Risk",
          color: "text-error",
          bgColor: "bg-error/20",
          protocols: "4 protocols",
          apy: "No limit",
          description: "Aggressive: All available protocols",
        };
      default:
        return {
          label: "Medium Risk",
          color: "text-warning",
          bgColor: "bg-warning/20",
          protocols: "3 protocols",
          apy: "< 10% APY",
          description: "Balanced: Mix of established protocols",
        };
    }
  };

  const riskDetails = getRiskDetails();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="2xl">
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 bg-primary-green/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Robot size={24} weight="duotone" className="text-primary-green" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">
            AI-Powered Automation
          </h2>
          <p className="text-sm text-gray-400">
            Let our AI optimize your DeFi yields automatically
          </p>
        </div>

        {/* Amount Input */}
        <Card>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-white font-semibold text-sm">
                Amount to Automate
              </label>
              <div className="text-gray-400 text-xs">
                Available: {availableBalance.toFixed(2)} USDC
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-16 text-white text-xl font-bold focus:outline-none focus:border-primary-green transition-colors"
                disabled={isProcessing}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <span className="text-gray-400 text-sm font-medium">USDC</span>
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-error text-xs">
                <WarningCircle size={14} weight="fill" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick percentage buttons */}
            <div className="grid grid-cols-5 gap-2">
              {[
                { label: "10%", value: 0.1 },
                { label: "25%", value: 0.25 },
                { label: "50%", value: 0.5 },
                { label: "75%", value: 0.75 },
                { label: "MAX", value: 1 },
              ].map((preset) => (
                <Button
                  key={preset.label}
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    const value = (availableBalance * preset.value).toFixed(2);
                    setAmount(value);
                    validateAmount(value);
                  }}
                  disabled={isProcessing || availableBalance === 0}
                  className="text-xs"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Risk Level Info */}
        <Card className="border-gray-700">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck size={18} className={riskDetails.color} />
                <span className="text-white font-semibold text-sm">
                  Risk Level
                </span>
              </div>
              <div
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${riskDetails.bgColor} ${riskDetails.color}`}
              >
                {riskDetails.label}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800/50 rounded-lg p-2">
                <div className="text-gray-400 text-xs mb-1">Protocols</div>
                <div className="text-white font-semibold text-sm">
                  {riskDetails.protocols}
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-2">
                <div className="text-gray-400 text-xs mb-1">Max APY</div>
                <div className="text-white font-semibold text-sm">
                  {riskDetails.apy}
                </div>
              </div>
            </div>

            <p className="text-gray-400 text-xs">{riskDetails.description}</p>
          </div>
        </Card>

        {/* What will happen */}
        <Card variant="gradient">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-white font-semibold text-sm mb-2">
              <Lightning size={18} weight="fill" />
              <span>What happens next?</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="text-white text-xs font-medium">Approve USDC</p>
                  <p className="text-white/70 text-xs">
                    Authorize vault to spend {amount || "your"} USDC
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="text-white text-xs font-medium">
                    Deposit to Vault
                  </p>
                  <p className="text-white/70 text-xs">
                    Transfer USDC to secure vault contract
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="text-white text-xs font-medium">
                    AI Allocation
                  </p>
                  <p className="text-white/70 text-xs">
                    Distribute across {riskDetails.protocols} for optimal yield
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle
                    size={14}
                    weight="fill"
                    className="text-success"
                  />
                </div>
                <div>
                  <p className="text-white text-xs font-medium">
                    Start Earning
                  </p>
                  <p className="text-white/70 text-xs">
                    Watch your yields grow automatically
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!amount || !!error || isProcessing}
            className="flex-1"
          >
            {isProcessing ? (
              "Processing..."
            ) : (
              <>
                <span>Start Automation</span>
                <ArrowRight size={16} weight="bold" />
              </>
            )}
          </Button>
        </div>

        {/* Security Notice */}
        <div className="flex items-start space-x-2 text-gray-400 text-xs leading-tight">
          <ShieldCheck size={12} className="flex-shrink-0 mt-0.5" />
          <p>
            Your funds remain in your custody. You can withdraw at any time. All
            transactions are secured by smart contracts on Base Sepolia.
          </p>
        </div>
      </div>
    </Modal>
  );
}
