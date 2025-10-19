"use client";

import { Card } from "@/components/common/Card";
import { TrendIndicator } from "@/components/charts/TrendIndicator";
import { Wallet, TrendUp, Coins, ChartLineUp } from "@phosphor-icons/react";

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  iconBg: string;
}

function StatCard({ title, value, change, icon, iconBg }: StatCardProps) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {value}
        </h3>
        {change !== undefined && <TrendIndicator value={change} size="sm" />}
      </div>
      <div className={`${iconBg} p-4 rounded-md`}>{icon}</div>
    </Card>
  );
}

interface StatsOverviewProps {
  totalValue: number;
  totalChange: number;
  totalEarnings: number;
  earningsChange: number;
  activePositions: number;
  avgApy: number;
}

export function StatsOverview({
  totalValue,
  totalChange,
  totalEarnings,
  earningsChange,
  activePositions,
  avgApy,
}: StatsOverviewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const stats = [
    {
      title: "Total Portfolio Value",
      value: formatCurrency(totalValue),
      change: totalChange,
      icon: <Wallet size={24} weight="fill" className="text-primary-green" />,
      iconBg: "bg-primary-green/20",
    },
    {
      title: "Total Earnings",
      value: formatCurrency(totalEarnings),
      change: earningsChange,
      icon: <TrendUp size={24} weight="fill" className="text-success" />,
      iconBg: "bg-success/20",
    },
    {
      title: "Active Positions",
      value: activePositions.toString(),
      icon: <Coins size={24} weight="fill" className="text-primary-green-light" />,
      iconBg: "bg-primary-green-light/20",
    },
    {
      title: "Average APY",
      value: `${avgApy.toFixed(2)}%`,
      icon: <ChartLineUp size={24} weight="fill" className="text-warning" />,
      iconBg: "bg-warning/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
