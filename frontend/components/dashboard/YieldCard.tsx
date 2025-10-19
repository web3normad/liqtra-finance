"use client";

import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { LogoImage } from "@/components/common/LogoImage";
import { TrendUp, Lightning, Sparkle } from "@phosphor-icons/react";

interface YieldCardProps {
  protocol: string;
  protocolLogo: string;
  pool: string;
  token: string;
  tokenLogo: string;
  chain: string;
  chainLogo: string;
  apy: number;
  apyBreakdown: {
    base: number;
    rewards: number;
    trading?: number;
  };
  tvl: number;
  risk: "low" | "medium" | "high";
  trending?: boolean;
  featured?: boolean;
  onStake?: () => void;
}

export function YieldCard({
  protocol,
  protocolLogo,
  pool,
  token,
  tokenLogo,
  chain,
  chainLogo,
  apy,
  apyBreakdown,
  tvl,
  risk,
  trending,
  featured,
  onStake,
}: YieldCardProps) {
  const formatCurrency = (val: number) => {
    if (val >= 1_000_000_000) {
      return `$${(val / 1_000_000_000).toFixed(2)}B`;
    }
    if (val >= 1_000_000) {
      return `$${(val / 1_000_000).toFixed(2)}M`;
    }
    return `$${(val / 1_000).toFixed(2)}K`;
  };

  const riskColors = {
    low: "success",
    medium: "warning",
    high: "danger",
  } as const;

  return (
    <Card className="hover:border-primary-green/50 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <LogoImage
              src={protocolLogo}
              alt={protocol}
              size={48}
              fallbackText={protocol.substring(0, 2)}
            />
            <LogoImage
              src={chainLogo}
              alt={chain}
              size={18}
              className="absolute -bottom-1 -right-1 border-2 border-white dark:border-card"
              fallbackText={chain.substring(0, 1)}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-gray-900 dark:text-white font-semibold">
                {protocol}
              </h3>
              {trending && (
                <TrendUp size={16} className="text-success" weight="bold" />
              )}
              {featured && (
                <Sparkle size={16} className="text-warning" weight="fill" />
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{pool}</p>
          </div>
        </div>
      </div>

      {/* APY */}
      <div className="bg-gradient-to-r from-primary-green/10 to-primary-green-light/10 border border-primary-green/20 rounded-md p-4 mb-4">
        <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
          Current APY
        </p>
        <div className="flex items-end gap-2">
          <h2 className="text-3xl font-bold gradient-text">
            {apy.toFixed(2)}%
          </h2>
          <Lightning
            size={20}
            className="text-primary-green mb-1"
            weight="fill"
          />
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs">
          <span className="text-gray-600 dark:text-gray-400">
            Base: {apyBreakdown.base}%
          </span>
          <span className="text-gray-400 dark:text-gray-600">•</span>
          <span className="text-gray-600 dark:text-gray-400">
            Rewards: {apyBreakdown.rewards}%
          </span>
          {apyBreakdown.trading && (
            <>
              <span className="text-gray-400 dark:text-gray-600">•</span>
              <span className="text-gray-600 dark:text-gray-400">
                Fees: {apyBreakdown.trading}%
              </span>
            </>
          )}
        </div>
      </div>

      {/* Token & TVL */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">Token</p>
          <div className="flex items-center gap-2">
            <LogoImage
              src={tokenLogo}
              alt={token}
              size={20}
              fallbackText={token.substring(0, 1)}
            />
            <span className="text-gray-900 dark:text-white font-medium">
              {token}
            </span>
          </div>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">TVL</p>
          <p className="text-gray-900 dark:text-white font-semibold">
            {formatCurrency(tvl)}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
        <Badge variant={riskColors[risk]} size="sm">
          {risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
        </Badge>
        <button
          onClick={onStake}
          className="px-4 py-2 bg-primary-green/20 hover:bg-primary-green/30 text-primary-green rounded-lg text-sm font-medium transition-all group-hover:bg-primary-green group-hover:text-white"
        >
          Stake Now
        </button>
      </div>
    </Card>
  );
}
