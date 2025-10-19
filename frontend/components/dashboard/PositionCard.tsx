"use client";

import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { TrendIndicator } from "@/components/charts/TrendIndicator";
import { LogoImage } from "@/components/common/LogoImage";
import { DotsThree, ArrowUpRight } from "@phosphor-icons/react";

interface PositionCardProps {
  id: string;
  protocol: string;
  protocolLogo: string;
  pool: string;
  token: string;
  tokenLogo: string;
  chain: string;
  chainLogo: string;
  amount: number;
  value: number;
  apy: number;
  earned: number;
  earnedUSD: number;
  status: "active" | "pending" | "unstaking";
  risk: "low" | "medium" | "high";
  autoCompound: boolean;
}

export function PositionCard({
  protocol,
  protocolLogo,
  pool,
  token,
  tokenLogo,
  chain,
  chainLogo,
  amount,
  value,
  apy,
  earned,
  earnedUSD,
  status,
  risk,
  autoCompound,
}: PositionCardProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(val);
  };

  const riskColors = {
    low: "success",
    medium: "warning",
    high: "danger",
  } as const;

  const statusColors = {
    active: "success",
    pending: "warning",
    unstaking: "blue",
  } as const;

  return (
    <Card className="hover:border-primary-green/50 transition-all cursor-pointer">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
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
              size={20}
              className="absolute -bottom-1 -right-1 border-2 border-white dark:border-card"
              fallbackText={chain.substring(0, 1)}
            />
          </div>
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold text-lg">
              {protocol}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{pool}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <DotsThree
            size={20}
            className="text-gray-600 dark:text-gray-400"
            weight="bold"
          />
        </button>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 mb-4">
        <Badge variant={statusColors[status]} size="sm">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
        <Badge variant={riskColors[risk]} size="sm">
          {risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
        </Badge>
        {autoCompound && (
          <Badge variant="purple" size="sm">
            Auto-compound
          </Badge>
        )}
      </div>

      {/* Amount & Value */}
      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
            Staked Amount
          </p>
          <div className="flex items-center gap-2">
            <LogoImage
              src={tokenLogo}
              alt={token}
              size={20}
              fallbackText={token.substring(0, 1)}
            />
            <span className="text-gray-900 dark:text-white font-semibold">
              {formatNumber(amount)} {token}
            </span>
          </div>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
            Current Value
          </p>
          <p className="text-gray-900 dark:text-white font-semibold">
            {formatCurrency(value)}
          </p>
        </div>
      </div>

      {/* APY & Earnings */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">APY</p>
          <div className="flex items-center gap-2">
            <span className="text-success font-bold text-lg">
              {apy.toFixed(2)}%
            </span>
            <ArrowUpRight size={16} className="text-success" weight="bold" />
          </div>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
            Earned
          </p>
          <p className="text-gray-900 dark:text-white font-semibold">
            {formatNumber(earned)} {token}
          </p>
          <p className="text-success text-xs">+{formatCurrency(earnedUSD)}</p>
        </div>
      </div>
    </Card>
  );
}
