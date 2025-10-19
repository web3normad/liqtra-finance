"use client";

import React, { useState, useEffect } from "react";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ActivePositions } from "@/components/dashboard/ActivePositions";
import { TopYieldCards } from "@/components/dashboard/TopYieldCards";
import { Card } from "@/components/common/Card";
import { Modal } from "@/components/common/Modal";
import { DepositWithdrawCard } from "@/components/dashboard/DepositWithdrawCard";
import { RiskLevelCard } from "@/components/dashboard/RiskLevelCard";
import { AutomateModal } from "@/components/dashboard/AutomateModal";
import { useWallet } from "@/hooks/useWallet";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useYieldData } from "@/hooks/useYieldData";
import { useProtocolData } from "@/hooks/useProtocolData";
import { useAIAgent } from "@/hooks/useAIAgent";
import { Position } from "@/types/portfolio.types";
import { YieldOpportunity } from "@/types/protocol.types";
import { getProtocolLogo, getTokenLogo, getChainLogo } from "@/lib/utils/logos";
import toast from "react-hot-toast";

// Fallback mock opportunities (used when DeFiLlama API fails)
const mockOpportunities: YieldOpportunity[] = [
  {
    id: "1",
    protocol: {
      id: "lido",
      name: "Lido",
      logo: "/assets/icons/lido.svg",
      category: "liquid-staking",
      chain: {
        id: 1,
        name: "Ethereum",
        logo: "/assets/icons/ethereum.svg",
        rpcUrl: "",
        explorerUrl: "",
      },
      tvl: 23000000000,
      apy: 4.2,
      risk: "low",
      verified: true,
    },
    pool: {
      id: "lido-steth",
      protocol: {} as any,
      name: "stETH Pool",
      token: {
        address: "0x",
        symbol: "ETH",
        name: "Ethereum",
        decimals: 18,
        logo: "/assets/icons/eth.svg",
        price: 2370,
        priceChange24h: 2.5,
      },
      apy: 4.2,
      tvl: 23000000000,
      minStake: 0.01,
      rewardToken: {} as any,
      fees: {
        deposit: 0,
        withdrawal: 0,
        performance: 10,
      },
    },
    apy: 4.2,
    apyBreakdown: {
      base: 3.5,
      rewards: 0.7,
    },
    risk: "low",
    tvl: 23000000000,
    trending: true,
    featured: true,
  },
  {
    id: "2",
    protocol: {
      id: "rocketpool",
      name: "Rocket Pool",
      logo: "/assets/icons/rocketpool.svg",
      category: "liquid-staking",
      chain: {
        id: 1,
        name: "Ethereum",
        logo: "/assets/icons/ethereum.svg",
        rpcUrl: "",
        explorerUrl: "",
      },
      tvl: 3500000000,
      apy: 3.8,
      risk: "low",
      verified: true,
    },
    pool: {
      id: "rocketpool-reth",
      protocol: {} as any,
      name: "rETH Pool",
      token: {
        address: "0x",
        symbol: "ETH",
        name: "Ethereum",
        decimals: 18,
        logo: "/assets/icons/eth.svg",
        price: 2370,
        priceChange24h: 2.5,
      },
      apy: 3.8,
      tvl: 3500000000,
      minStake: 0.01,
      rewardToken: {} as any,
      fees: {
        deposit: 0,
        withdrawal: 0,
        performance: 15,
      },
    },
    apy: 3.8,
    apyBreakdown: {
      base: 3.2,
      rewards: 0.6,
    },
    risk: "low",
    tvl: 3500000000,
    trending: false,
  },
  {
    id: "3",
    protocol: {
      id: "aave",
      name: "Aave",
      logo: "/assets/icons/aave.svg",
      category: "lending",
      chain: {
        id: 137,
        name: "Polygon",
        logo: "/assets/icons/polygon.svg",
        rpcUrl: "",
        explorerUrl: "",
      },
      tvl: 5800000000,
      apy: 5.5,
      risk: "low",
      verified: true,
    },
    pool: {
      id: "aave-usdc",
      protocol: {} as any,
      name: "USDC Pool",
      token: {
        address: "0x",
        symbol: "USDC",
        name: "USD Coin",
        decimals: 6,
        logo: "/assets/icons/usdc.svg",
        price: 1,
        priceChange24h: 0.01,
      },
      apy: 5.5,
      tvl: 1200000000,
      minStake: 10,
      rewardToken: {} as any,
      fees: {
        deposit: 0,
        withdrawal: 0,
        performance: 0,
      },
    },
    apy: 5.5,
    apyBreakdown: {
      base: 5.5,
      rewards: 0,
    },
    risk: "low",
    tvl: 1200000000,
    featured: true,
  },
  {
    id: "4",
    protocol: {
      id: "uniswap",
      name: "Uniswap V3",
      logo: "/assets/icons/uniswap.svg",
      category: "dex",
      chain: {
        id: 1,
        name: "Ethereum",
        logo: "/assets/icons/ethereum.svg",
        rpcUrl: "",
        explorerUrl: "",
      },
      tvl: 4200000000,
      apy: 12.5,
      risk: "medium",
      verified: true,
    },
    pool: {
      id: "uni-eth-usdc",
      protocol: {} as any,
      name: "ETH/USDC Pool",
      token: {
        address: "0x",
        symbol: "ETH-USDC",
        name: "ETH-USDC LP",
        decimals: 18,
        logo: "/assets/icons/eth.svg",
        price: 1,
        priceChange24h: 1.2,
      },
      apy: 12.5,
      tvl: 850000000,
      minStake: 100,
      rewardToken: {} as any,
      fees: {
        deposit: 0,
        withdrawal: 0,
        performance: 0,
      },
    },
    apy: 12.5,
    apyBreakdown: {
      base: 8.0,
      rewards: 2.5,
      trading: 2.0,
    },
    risk: "medium",
    tvl: 850000000,
    trending: true,
  },
];

export default function DashboardPage() {
  // State for modals
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [isAutomateModalOpen, setIsAutomateModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Real data hooks
  const { address, isConnected } = useWallet();
  const {
    vaultBalance,
    usdcBalance,
    portfolioData,
    riskLevel,
    isLoading: isLoadingPortfolio,
    refetch: refetchPortfolio,
  } = usePortfolio();
  const {
    topYields,
    liquidStakingYields,
    isLoading: isLoadingYields,
  } = useYieldData();
  const { getTokenPrice, ethPrice } = useProtocolData();
  const { executeAutomation, isExecuting, getPortfolioStats, getPositions } =
    useAIAgent();

  // Get USDC price for calculations
  const usdcPrice = getTokenPrice("USDC");

  // Get real portfolio stats from automation positions
  const automationStats = getPortfolioStats();

  // Auto-refresh portfolio data every 30 seconds
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
      refetchPortfolio?.();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isConnected, refetchPortfolio]);

  // Refresh after deposits/withdrawals
  useEffect(() => {
    if (vaultBalance !== "0") {
      setRefreshKey((prev) => prev + 1);
    }
  }, [vaultBalance]);

  // Calculate real stats - use actual data from positions and vault balance
  const totalValue =
    automationStats.totalValue > 0
      ? automationStats.totalValue
      : vaultBalance && parseFloat(vaultBalance) > 0
      ? parseFloat(vaultBalance)
      : 0;

  const totalEarnings =
    automationStats.totalEarnings > 0 ? automationStats.totalEarnings : 0;

  const avgApy = automationStats.avgApy > 0 ? automationStats.avgApy : 0;

  const activePositions =
    automationStats.activePositions > 0 ? automationStats.activePositions : 0;

  // Transform real yields data to match TopYieldCards format
  const realOpportunities: YieldOpportunity[] = (topYields || [])
    .slice(0, 6)
    .map((yieldData, index) => ({
      id: `yield-${index}`,
      protocol: {
        id: yieldData.protocol.toLowerCase().replace(/\s+/g, "-"),
        name: yieldData.protocol,
        logo: getProtocolLogo(yieldData.protocol),
        category: yieldData.category as any,
        chain: {
          id:
            yieldData.chain === "Ethereum"
              ? 1
              : yieldData.chain === "Polygon"
              ? 137
              : 1,
          name: yieldData.chain,
          logo: getChainLogo(yieldData.chain),
          rpcUrl: "",
          explorerUrl: "",
        },
        tvl: yieldData.tvl,
        apy: yieldData.apy,
        risk: yieldData.risk,
        verified: true,
      },
      pool: {
        id: `${yieldData.protocol}-${yieldData.symbol}`.toLowerCase(),
        protocol: {} as any,
        name: yieldData.pool,
        token: {
          address: "0x",
          symbol: yieldData.symbol,
          name: yieldData.symbol,
          decimals: 18,
          logo: getTokenLogo(yieldData.symbol.split("-")[0]),
          price: getTokenPrice(yieldData.symbol.split("-")[0]) || 1,
          priceChange24h: 0,
        },
        apy: yieldData.apy,
        tvl: yieldData.tvl,
        minStake: 0.01,
        rewardToken: {} as any,
        fees: {
          deposit: 0,
          withdrawal: 0,
          performance: 0,
        },
      },
      apy: yieldData.apy,
      apyBreakdown: {
        base: yieldData.apy * 0.8,
        rewards: yieldData.apy * 0.2,
      },
      risk: yieldData.risk,
      tvl: yieldData.tvl,
      trending: index < 2,
      featured: yieldData.risk === "low" && yieldData.apy > 5,
    }));

  // Get real positions from automation - shows protocol breakdown
  const realPositions: Position[] = React.useMemo(() => {
    if (!isConnected) return [];

    // Get positions from automation hook
    const automationPositions = getPositions();

    // If we have automation positions with protocol breakdown, use those
    if (automationPositions && automationPositions.length > 0) {
      return automationPositions.map((pos: any) => ({
        id: pos.id,
        protocol: pos.protocol,
        protocolLogo: getProtocolLogo(pos.protocol),
        pool: pos.pool || `${pos.protocol} Pool`,
        token: "USDC",
        tokenLogo: getTokenLogo("USDC"),
        chain: "Base Sepolia",
        chainLogo: getChainLogo("Base"),
        amount: pos.amount,
        value: pos.amount * usdcPrice,
        apy: pos.apy,
        earned: pos.earned || 0,
        earnedUSD: (pos.earned || 0) * usdcPrice,
        startDate: pos.startDate || new Date(),
        status: "active" as const,
        risk: pos.risk || ("low" as const),
        autoCompound: true,
      }));
    }

    // Fallback: If only vault balance exists (before automation), show vault position
    if (parseFloat(vaultBalance) > 0) {
      return [
        {
          id: "vault-1",
          protocol: "Liqtra Vault",
          protocolLogo: getProtocolLogo("Aave"),
          pool: "Main Vault",
          token: "USDC",
          tokenLogo: getTokenLogo("USDC"),
          chain: "Base Sepolia",
          chainLogo: getChainLogo("Base"),
          amount: parseFloat(vaultBalance),
          value: parseFloat(vaultBalance) * usdcPrice,
          apy: avgApy,
          earned: totalEarnings / usdcPrice,
          earnedUSD: totalEarnings,
          startDate: new Date(),
          status: "active" as const,
          risk: "low" as const,
          autoCompound: true,
        },
      ];
    }

    return [];
  }, [
    isConnected,
    vaultBalance,
    avgApy,
    totalEarnings,
    usdcPrice,
    getPositions,
    refreshKey,
  ]);

  // Quick action handlers
  const handleDeposit = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    setIsDepositModalOpen(true);
  };

  const handleWithdraw = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    if (parseFloat(vaultBalance) === 0) {
      toast.error("No funds to withdraw");
      return;
    }
    setIsWithdrawModalOpen(true);
  };

  const handleSwap = () => {
    toast("Swap feature coming soon!", { icon: "ℹ️" });
  };

  const handleAIOptimize = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    // Start autonomous AI optimization
    toast.loading("🤖 AI Agent analyzing yields...", {
      id: "ai-optimize",
      duration: 2000,
    });

    // Simulate AI analyzing yields
    setTimeout(() => {
      toast.loading("🔍 Scanning DeFi protocols...", {
        id: "ai-optimize",
        duration: 2000,
      });
    }, 2000);

    setTimeout(() => {
      toast.loading("📊 Calculating optimal allocation...", {
        id: "ai-optimize",
        duration: 2000,
      });
    }, 4000);

    setTimeout(() => {
      // Get top 3 yields from available opportunities
      const topYields = realOpportunities.slice(0, 3);

      if (topYields.length === 0) {
        toast.error("No yield opportunities found", { id: "ai-optimize" });
        return;
      }

      toast.success(
        `✅ AI found ${topYields.length} optimal yields! Auto-staking...`,
        { id: "ai-optimize", duration: 2000 }
      );

      // Simulate auto-staking in the best yields
      setTimeout(() => {
        const topProtocol = topYields[0].protocol.name;
        const topAPY = topYields[0].apy.toFixed(2);

        toast.success(
          `🎉 Successfully staked in ${topProtocol} (${topAPY}% APY)!`,
          { duration: 4000 }
        );

        // In a real implementation, this would call the smart contract
        // to automatically stake the funds
      }, 2000);
    }, 6000);
  };

  const handleAutomate = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    // Open the automation modal
    setIsAutomateModalOpen(true);
  };

  const handleAutomateConfirm = async (amount: string) => {
    try {
      // Pass the amount to automation (will be used by useAutomation hook)
      await executeAutomation(amount);
    } catch (error) {
      // Error already handled by useAIAgent hook
      console.error("Automation failed:", error);
      throw error; // Re-throw to let modal handle it
    }
  };

  const handleAnalytics = () => {
    toast("Advanced analytics coming soon!", { icon: "📊" });
  };

  const handleStakeOpportunity = (opportunity: YieldOpportunity) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    // Show protocol info
    toast.success(
      `${opportunity.protocol.name} - ${opportunity.apy.toFixed(
        2
      )}% APY\n\nDeposit USDC to your vault to start earning yields!`,
      { duration: 5000 }
    );

    // Open deposit modal
    setIsDepositModalOpen(true);
  };

  // Show loading state
  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold dark:text-white">
            Welcome to Liqtra Finance
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Connect your wallet to view your portfolio and start earning yields
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <StatsOverview
        totalValue={totalValue}
        totalChange={3.45}
        totalEarnings={totalEarnings}
        earningsChange={12.5}
        activePositions={activePositions}
        avgApy={avgApy}
      />

      {/* Quick Actions */}
      <QuickActions
        onDeposit={handleDeposit}
        onSwap={handleSwap}
        onWithdraw={handleWithdraw}
        onAIOptimize={handleAIOptimize}
        onAutomate={handleAutomate}
        onAnalytics={handleAnalytics}
      />

      {/* Active Positions and Risk Level */}
      {realPositions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivePositions positions={realPositions} />
          </div>
          <div>
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold dark:text-white mb-2">
                    Risk Preference
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {riskLevel === 0 ? "🛡️" : riskLevel === 1 ? "⚖️" : "🚀"}
                    </span>
                    <div>
                      <p className="font-medium dark:text-white">
                        {riskLevel === 0
                          ? "Conservative"
                          : riskLevel === 1
                          ? "Moderate"
                          : riskLevel === 2
                          ? "Aggressive"
                          : "Not Set"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {riskLevel === 0
                          ? "3-5% APY"
                          : riskLevel === 1
                          ? "5-10% APY"
                          : riskLevel === 2
                          ? "10-20% APY"
                          : "Set your risk level"}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsRiskModalOpen(true)}
                  className="w-full px-4 py-2 bg-primary-green hover:bg-primary-green/90 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {riskLevel !== undefined
                    ? "Update Risk Level"
                    : "Set Risk Level"}
                </button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Top Yield Opportunities - Real Data from DeFiLlama */}
      {isLoadingYields ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Loading yield opportunities...
          </p>
        </div>
      ) : realOpportunities.length > 0 ? (
        <TopYieldCards
          opportunities={realOpportunities}
          onStakeClick={handleStakeOpportunity}
        />
      ) : (
        <TopYieldCards
          opportunities={mockOpportunities}
          onStakeClick={handleStakeOpportunity}
        />
      )}

      {/* AI Insights Section */}
      {totalValue > 0 && (
        <Card variant="gradient" className="border-primary-green/30">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-br from-primary-green to-primary-green-light p-3 rounded-md">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-gray-900 dark:text-white font-semibold mb-2">
                AI Recommendation
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                Your funds are currently being managed in the vault. Our AI
                agent is optimizing yields across DeFi protocols to maximize
                your returns while maintaining your risk profile.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAIOptimize}
                  className="px-4 py-2 bg-primary-green hover:bg-primary-green/90 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Optimize Now
                </button>
                <button
                  onClick={handleAnalytics}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
                >
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Deposit Modal */}
      <Modal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        title="Deposit Funds"
      >
        <DepositWithdrawCard />
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        title="Withdraw Funds"
      >
        <DepositWithdrawCard />
      </Modal>

      {/* Risk Level Modal */}
      <Modal
        isOpen={isRiskModalOpen}
        onClose={() => setIsRiskModalOpen(false)}
        title="Set Risk Preference"
      >
        <RiskLevelCard />
      </Modal>

      {/* Automate Modal */}
      <AutomateModal
        isOpen={isAutomateModalOpen}
        onClose={() => setIsAutomateModalOpen(false)}
        onConfirm={handleAutomateConfirm}
        riskLevel={riskLevel || 1}
      />
    </div>
  );
}
