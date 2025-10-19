"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { Tabs } from "@/components/common/Tabs";
import { ActivePositions } from "@/components/dashboard/ActivePositions";
import { Position } from "@/types/portfolio.types";
import { useAIAgent } from "@/hooks/useAIAgent";
import { useWallet } from "@/hooks/useWallet";
import { useAutomation } from "@/hooks/useAutomation";
import { getProtocolLogo } from "@/lib/utils/logos";
import toast from "react-hot-toast";
import {
  Lightning,
  TrendUp,
  Calendar,
  ChartLineUp,
  ArrowRight,
  Clock,
  CheckCircle,
  WarningCircle,
} from "@phosphor-icons/react";
import { TrendIndicator } from "@/components/charts/TrendIndicator";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { parseUnits, formatUnits } from "viem";
import {
  getVaultAddress,
  getUSDCAddress,
} from "@/lib/web3/contracts/addresses";
import { VAULT_ABI, ERC20_ABI } from "@/lib/web3/contracts/abis";

// Mock active positions
const mockPositions: Position[] = [
  {
    id: "1",
    protocol: "Lido",
    protocolLogo: "/assets/icons/lido.svg",
    pool: "stETH Pool",
    token: "ETH",
    tokenLogo: "/assets/icons/eth.svg",
    chain: "Ethereum",
    chainLogo: "/assets/icons/ethereum.svg",
    amount: 5.25,
    value: 12450.75,
    apy: 4.2,
    earned: 0.125,
    earnedUSD: 296.25,
    startDate: new Date("2024-01-15"),
    status: "active",
    risk: "low",
    autoCompound: true,
    nextReward: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    protocol: "Rocket Pool",
    protocolLogo: "/assets/icons/rocketpool.svg",
    pool: "rETH Pool",
    token: "ETH",
    tokenLogo: "/assets/icons/eth.svg",
    chain: "Ethereum",
    chainLogo: "/assets/icons/ethereum.svg",
    amount: 3.5,
    value: 8298.5,
    apy: 3.8,
    earned: 0.089,
    earnedUSD: 211.15,
    startDate: new Date("2024-02-01"),
    status: "active",
    risk: "low",
    autoCompound: false,
    nextReward: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    protocol: "Frax",
    protocolLogo: "/assets/icons/lido.svg",
    pool: "sfrxETH Pool",
    token: "ETH",
    tokenLogo: "/assets/icons/eth.svg",
    chain: "Ethereum",
    chainLogo: "/assets/icons/ethereum.svg",
    amount: 2.8,
    value: 6636.4,
    apy: 5.1,
    earned: 0.062,
    earnedUSD: 147.08,
    startDate: new Date("2024-03-01"),
    status: "active",
    risk: "medium",
    autoCompound: true,
    nextReward: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  },
];

export default function ActiveStakingPage() {
  const [activeTab, setActiveTab] = useState("all");
  const { getPositions, getPortfolioStats } = useAIAgent();
  const { clearPositions } = useAutomation();
  const { address, chainId } = useWallet();
  const [positions, setPositions] = useState<Position[]>([]);
  const [isEnablingAutoCompound, setIsEnablingAutoCompound] = useState(false);
  const [isUnstakeModalOpen, setIsUnstakeModalOpen] = useState(false);

  // Withdrawal functionality
  const {
    writeContract,
    data: withdrawHash,
    isPending: isWithdrawing,
  } = useWriteContract();
  const { isLoading: isWithdrawConfirming, isSuccess: isWithdrawSuccess } =
    useWaitForTransactionReceipt({
      hash: withdrawHash,
    });

  const vaultAddress = chainId ? getVaultAddress(chainId) : undefined;
  const usdcAddress = chainId ? getUSDCAddress(chainId) : undefined;

  // Get actual vault balance - FIXED: Use getUserBalance instead of balanceOf
  const { data: vaultBalanceData, refetch: refetchVaultBalance } =
    useReadContract({
      address: vaultAddress,
      abi: VAULT_ABI,
      functionName: "getUserBalance", // Changed from "balanceOf" to "getUserBalance"
      args: address ? [address] : undefined,
      query: {
        enabled: !!address && !!vaultAddress,
        refetchInterval: 5000, // Refetch every 5 seconds
      },
    });

  const vaultBalance = vaultBalanceData
    ? parseFloat(formatUnits(vaultBalanceData as bigint, 6))
    : 0;

  // Debug logging
  useEffect(() => {
    console.log("🔍 Active Staking Debug:", {
      vaultBalanceData,
      vaultBalanceRaw: vaultBalanceData?.toString(),
      vaultBalance,
      vaultBalanceFormatted: vaultBalance.toFixed(6),
      address,
      vaultAddress,
      chainId,
      positionsCount: positions.length,
      hasBalance: vaultBalance > 0,
    });

    // Show warning if vault balance is 0 but we expect funds
    if (address && vaultAddress && vaultBalance === 0) {
      console.warn(
        "⚠️ Vault balance is 0 - check if funds are actually deposited in contract:",
        vaultAddress
      );
    }
  }, [
    vaultBalanceData,
    vaultBalance,
    address,
    vaultAddress,
    chainId,
    positions.length,
  ]);

  // Load positions from automation
  useEffect(() => {
    if (!address) {
      setPositions([]);
      return;
    }

    const updatePositions = () => {
      const rawPositions = getPositions();
      console.log("📊 Raw positions from localStorage:", rawPositions);

      // If no positions but we have vault balance, create a single vault position
      if (rawPositions.length === 0 && vaultBalance > 0) {
        console.log("✅ Creating vault position with balance:", vaultBalance);
        const vaultPosition: Position = {
          id: "vault-main",
          protocol: "Liqtra Vault",
          protocolLogo: getProtocolLogo("Aave"),
          pool: "Main Vault",
          token: "USDC",
          tokenLogo: "/assets/icons/usdc.svg",
          chain: "Base Sepolia",
          chainLogo: "/eth-logo.svg",
          amount: vaultBalance,
          value: vaultBalance,
          apy: 5.5,
          earned: 0,
          earnedUSD: 0,
          startDate: new Date(),
          status: "active",
          risk: "low",
          autoCompound: true,
          nextReward: new Date(Date.now() + 24 * 60 * 60 * 1000),
        };
        setPositions([vaultPosition]);
        return;
      }

      if (rawPositions.length === 0 && vaultBalance === 0) {
        console.log("❌ No positions and no vault balance");
        setPositions([]);
        return;
      }

      // Transform automation positions to Position format with real-time earnings
      const transformedPositions: Position[] = rawPositions.map((pos: any) => {
        const amount = parseFloat(pos.amount);
        const timeElapsed = Date.now() - pos.startTime;
        const daysElapsed = timeElapsed / (1000 * 60 * 60 * 24);
        const yearlyEarnings = amount * (pos.apy / 100);
        const currentEarnings = (yearlyEarnings / 365) * daysElapsed;

        return {
          id: pos.id,
          protocol: pos.protocol,
          protocolLogo: getProtocolLogo(pos.protocol),
          pool: `${pos.protocol} Yield`,
          token: "USDC",
          tokenLogo: "/assets/icons/usdc.svg",
          chain: "Base",
          chainLogo: "/eth-logo.svg",
          amount: amount,
          value: amount + currentEarnings,
          apy: pos.apy,
          earned: currentEarnings,
          earnedUSD: currentEarnings,
          startDate: new Date(pos.startTime),
          status: pos.status,
          risk: pos.apy < 6 ? "low" : pos.apy < 10 ? "medium" : "high",
          autoCompound: true,
          nextReward: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next day
        };
      });

      setPositions(transformedPositions);
    };

    // Initial load
    updatePositions();

    // Update earnings every 30 seconds
    const interval = setInterval(updatePositions, 30000);

    return () => clearInterval(interval);
  }, [address, getPositions, vaultBalance]);

  // Calculate stats from real vault balance AND positions
  // Use vault balance as source of truth, but if 0 and we have positions, sum positions (for display)
  const positionsTotalAmount = positions.reduce(
    (sum, pos) => sum + pos.amount,
    0
  );
  const totalStaked =
    vaultBalance > 0
      ? vaultBalance
      : positionsTotalAmount > 0
      ? positionsTotalAmount
      : 0;

  const totalEarned = positions.reduce((sum, pos) => sum + pos.earned, 0);
  const avgAPY =
    positions.length > 0
      ? positions.reduce((sum, pos) => sum + pos.apy, 0) / positions.length
      : 0;

  // Log discrepancy if vault balance doesn't match positions
  useEffect(() => {
    if (positionsTotalAmount > 0 && vaultBalance === 0) {
      console.error(
        "⚠️ MISMATCH: Positions show",
        positionsTotalAmount,
        "USDC but vault balance is 0!"
      );
      console.error("This means either:");
      console.error("1. Funds were withdrawn from the vault");
      console.error("2. localStorage has stale position data");
      console.error("3. Wrong vault contract address");
      toast.error("Position data mismatch detected! Check console.", {
        id: "mismatch",
      });
    }
  }, [positionsTotalAmount, vaultBalance]);

  const tabs = [
    { value: "all", label: "All Positions" },
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "unstaking", label: "Unstaking" },
  ];

  /**
   * Enable auto-compound for all positions
   */
  const handleEnableAutoCompound = async () => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    if (positions.length === 0) {
      toast.error("No positions to enable auto-compound for");
      return;
    }

    setIsEnablingAutoCompound(true);

    try {
      // Update all positions to have autoCompound enabled
      const positionsKey = `positions_${address}_${84532}`;
      const updatedPositions = positions.map((pos) => ({
        ...pos,
        autoCompound: true,
      }));

      // Save to localStorage
      localStorage.setItem(
        positionsKey,
        JSON.stringify(
          updatedPositions.map((pos) => ({
            id: pos.id,
            protocol: pos.protocol,
            amount: pos.amount.toString(),
            apy: pos.apy,
            percentage: 100 / updatedPositions.length, // Equal distribution
            startTime: pos.startDate.getTime(),
            earnings: pos.earned.toString(),
            status: pos.status,
            txHash: "",
            autoCompound: true,
          }))
        )
      );

      // Update local state
      setPositions(updatedPositions);

      toast.success(
        `✅ Auto-compound enabled for ${positions.length} positions!`,
        {
          duration: 3000,
        }
      );
    } catch (error: any) {
      console.error("Failed to enable auto-compound:", error);
      toast.error(error.message || "Failed to enable auto-compound");
    } finally {
      setIsEnablingAutoCompound(false);
    }
  };

  /**
   * Compound all rewards
   */
  const handleCompoundRewards = () => {
    if (positions.length === 0) {
      toast.error("No positions to compound");
      return;
    }

    const totalEarnings = positions.reduce((sum, pos) => sum + pos.earned, 0);

    if (totalEarnings === 0) {
      toast.error("No earnings to compound yet");
      return;
    }

    toast.loading("Compounding rewards...", { id: "compound" });

    // Simulate compounding (in production, this would call smart contract)
    setTimeout(() => {
      toast.success(`✅ Compounded $${totalEarnings.toFixed(2)} in earnings!`, {
        id: "compound",
        duration: 3000,
      });
    }, 1500);
  };

  /**
   * Claim all rewards
   */
  const handleClaimRewards = () => {
    if (positions.length === 0) {
      toast.error("No positions to claim from");
      return;
    }

    const totalEarnings = positions.reduce((sum, pos) => sum + pos.earned, 0);

    if (totalEarnings === 0) {
      toast.error("No earnings to claim yet");
      return;
    }

    toast.loading("Claiming rewards...", { id: "claim" });

    // Simulate claiming (in production, this would call smart contract)
    setTimeout(() => {
      toast.success(`✅ Claimed $${totalEarnings.toFixed(2)} to your wallet!`, {
        id: "claim",
        duration: 3000,
      });
    }, 1500);
  };

  /**
   * Unstake all positions - Open confirmation modal
   */
  const handleUnstake = () => {
    console.log("🔴 Unstake clicked:", {
      vaultBalance,
      hasBalance: vaultBalance > 0,
      address,
      chainId,
      vaultAddress,
    });

    if (!address || !chainId || !vaultAddress) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!vaultBalance || vaultBalance <= 0) {
      toast.error(`No funds to unstake. Vault balance: ${vaultBalance} USDC`);
      console.error("❌ No vault balance found");
      return;
    }

    // Open confirmation modal
    setIsUnstakeModalOpen(true);
  };
  /**
   * Confirm and execute unstake
   */
  const confirmUnstake = async () => {
    try {
      setIsUnstakeModalOpen(false);
      toast.loading("Initiating withdrawal...", { id: "unstake" });

      // Convert amount to wei (USDC has 6 decimals)
      const amountWei = parseUnits(vaultBalance.toFixed(6), 6);

      // Call vault.withdraw(amount)
      await writeContract({
        address: vaultAddress!,
        abi: VAULT_ABI,
        functionName: "withdraw",
        args: [amountWei],
      });

      toast.loading("Confirming transaction...", { id: "unstake" });
    } catch (error: any) {
      console.error("Withdrawal error:", error);
      toast.error(error.message || "Failed to initiate withdrawal", {
        id: "unstake",
      });
    }
  };

  // Handle successful withdrawal
  useEffect(() => {
    if (isWithdrawSuccess && withdrawHash) {
      toast.success(
        `✅ Successfully unstaked ${vaultBalance.toFixed(2)} USDC!`,
        {
          id: "unstake",
          duration: 5000,
        }
      );

      // Clear positions from localStorage
      if (address && chainId) {
        const key = `positions_${address}_${chainId}`;
        localStorage.removeItem(key);
        setPositions([]);
      }

      console.log(`Transaction hash: ${withdrawHash}`);
    }
  }, [isWithdrawSuccess, withdrawHash, address, chainId, vaultBalance]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Active Staking</h1>
          <p className="text-gray-400">
            Monitor and manage your staking positions
          </p>
        </div>
        <Button variant="primary">
          <Lightning size={18} weight="fill" />
          <span>Stake More</span>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Staked</span>
            {vaultBalance > 0 ? (
              <CheckCircle size={20} weight="fill" className="text-success" />
            ) : (
              <WarningCircle size={20} weight="fill" className="text-warning" />
            )}
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            $
            {totalStaked.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-sm text-gray-400">
            {positions.length}{" "}
            {positions.length === 1 ? "position" : "positions"}
            {vaultBalance === 0 && positionsTotalAmount > 0 && (
              <span className="text-warning ml-1">(⚠️ Vault: $0)</span>
            )}
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Earned</span>
            <TrendUp size={20} weight="fill" className="text-success" />
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            $
            {totalEarned.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </p>
          <TrendIndicator value={12.5} size="sm" showIcon={false} />
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Average APY</span>
            <ChartLineUp
              size={20}
              weight="fill"
              className="text-primary-green"
            />
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {avgAPY.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-400">Weighted average</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Auto-Compound</span>
            <Lightning size={20} weight="fill" className="text-warning" />
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {positions.filter((p) => p.autoCompound).length}/{positions.length}
          </p>
          <p className="text-sm text-gray-400">Enabled</p>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">
              Staking Performance
            </h3>
            <p className="text-sm text-gray-400">Earnings over time</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="secondary" size="sm">
              7D
            </Button>
            <Button variant="secondary" size="sm">
              1M
            </Button>
            <Button variant="secondary" size="sm">
              3M
            </Button>
            <Button variant="primary" size="sm">
              1Y
            </Button>
          </div>
        </div>

        {/* Simple earnings chart placeholder */}
        <div className="h-64 bg-gray-800/30 rounded-md flex items-center justify-center border border-gray-800">
          <div className="text-center">
            <ChartLineUp
              size={48}
              weight="duotone"
              className="text-gray-600 mx-auto mb-3"
            />
            <p className="text-gray-500">Performance chart coming soon</p>
          </div>
        </div>
      </Card>

      {/* Upcoming Rewards */}
      <Card>
        <h3 className="text-lg font-bold text-white mb-4">Upcoming Rewards</h3>
        <div className="space-y-3">
          {mockPositions
            .filter((p) => p.nextReward)
            .sort(
              (a, b) =>
                (a.nextReward?.getTime() || 0) - (b.nextReward?.getTime() || 0)
            )
            .slice(0, 3)
            .map((position) => {
              const daysUntil = Math.ceil(
                ((position.nextReward?.getTime() || 0) - Date.now()) /
                  (1000 * 60 * 60 * 24)
              );
              return (
                <div
                  key={position.id}
                  className="flex items-center justify-between p-4 bg-gray-800/30 rounded-md hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-green/20 rounded-md flex items-center justify-center">
                      <Clock size={20} className="text-primary-green" />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {position.protocol} - {position.pool}
                      </p>
                      <p className="text-gray-400 text-sm">
                        ~$
                        {((position.value * position.apy) / 100 / 365).toFixed(
                          2
                        )}{" "}
                        daily
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="purple" size="sm">
                      {daysUntil}d
                    </Badge>
                    <p className="text-gray-400 text-xs mt-1">Next reward</p>
                  </div>
                </div>
              );
            })}
        </div>
      </Card>

      {/* Tabs */}
      <Tabs tabs={tabs} defaultValue={activeTab} onChange={setActiveTab}>
        {() => <></>}
      </Tabs>

      {/* Positions List */}
      <ActivePositions positions={positions} />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className="hover:border-primary-green/50 transition-colors cursor-pointer"
          onClick={handleCompoundRewards}
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-semibold mb-1">
                Compound Rewards
              </h4>
              <p className="text-gray-400 text-sm">Reinvest all earnings</p>
            </div>
            <div className="w-12 h-12 bg-primary-green/20 rounded-md flex items-center justify-center">
              <Lightning
                size={24}
                weight="fill"
                className="text-primary-green"
              />
            </div>
          </div>
        </Card>

        <Card
          className="hover:border-primary-green-light/50 transition-colors cursor-pointer"
          onClick={handleClaimRewards}
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-semibold mb-1">Claim Rewards</h4>
              <p className="text-gray-400 text-sm">Withdraw earnings</p>
            </div>
            <div className="w-12 h-12 bg-primary-green-light/20 rounded-md flex items-center justify-center">
              <TrendUp
                size={24}
                weight="fill"
                className="text-primary-green-light"
              />
            </div>
          </div>
        </Card>

        <Card
          className={`hover:border-warning/50 transition-colors ${
            isWithdrawing || isWithdrawConfirming
              ? "opacity-60 cursor-wait"
              : "cursor-pointer"
          }`}
          onClick={
            isWithdrawing || isWithdrawConfirming ? undefined : handleUnstake
          }
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-semibold mb-1">
                {isWithdrawing || isWithdrawConfirming
                  ? "Withdrawing..."
                  : "Unstake"}
              </h4>
              <p className="text-gray-400 text-sm">
                {isWithdrawing
                  ? "Waiting for approval..."
                  : isWithdrawConfirming
                  ? "Confirming transaction..."
                  : "Withdraw positions"}
              </p>
            </div>
            <div className="w-12 h-12 bg-warning/20 rounded-md flex items-center justify-center">
              <WarningCircle size={24} weight="fill" className="text-warning" />
            </div>
          </div>
        </Card>
      </div>

      {/* Info Banner */}
      <Card variant="gradient">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/10 rounded-md flex items-center justify-center">
              <Lightning size={24} weight="fill" className="text-white" />
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">
                Enable Auto-Compound for All Positions
              </h4>
              <p className="text-white/70 text-sm">
                Maximize your returns with automated compounding
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={handleEnableAutoCompound}
            disabled={isEnablingAutoCompound || positions.length === 0}
          >
            <span>{isEnablingAutoCompound ? "Enabling..." : "Enable Now"}</span>
            <ArrowRight size={18} weight="bold" />
          </Button>
        </div>
      </Card>

      {/* Unstake Confirmation Modal */}
      <Modal
        isOpen={isUnstakeModalOpen}
        onClose={() => setIsUnstakeModalOpen(false)}
        title="Confirm Unstake"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <WarningCircle
                size={24}
                weight="fill"
                className="text-warning flex-shrink-0 mt-0.5"
              />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Withdraw All Funds
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Are you sure you want to unstake all your positions?
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Total Amount
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {vaultBalance.toFixed(2)} USDC
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Active Positions
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {positions.length}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            This will withdraw <strong>{vaultBalance.toFixed(2)} USDC</strong>{" "}
            from the vault back to your wallet. All your active positions will
            be closed.
          </p>

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setIsUnstakeModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={confirmUnstake}
              disabled={isWithdrawing || isWithdrawConfirming}
              className="flex-1"
            >
              {isWithdrawing || isWithdrawConfirming
                ? "Processing..."
                : "Confirm Unstake"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
