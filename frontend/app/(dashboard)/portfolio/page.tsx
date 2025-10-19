"use client";

import { ValueOverTime } from "@/components/portfolio/ValueOverTime";
import { PortfolioSummary } from "@/components/portfolio/PortfolioSummary";
import { Card } from "@/components/common/Card";

/**
 * Portfolio Dashboard Page
 *
 * This page demonstrates the ValueOverTime component along with other
 * portfolio tracking features.
 */
export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Portfolio</h1>
        <p className="text-gray-400">
          Track your DeFi investments and earnings over time
        </p>
      </div>

      {/* Portfolio Summary */}
      <PortfolioSummary />

      {/* Value Over Time - Main Component */}
      <ValueOverTime />

      {/* Additional Portfolio Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">
            Asset Allocation
          </h3>
          <div className="space-y-3">
            {[
              { name: "Ethereum", value: 45, color: "bg-blue-500" },
              { name: "Stablecoins", value: 30, color: "bg-green-500" },
              { name: "Other", value: 25, color: "bg-purple-500" },
            ].map((asset) => (
              <div key={asset.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{asset.name}</span>
                  <span className="text-white font-medium">{asset.value}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className={`${asset.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${asset.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {[
              {
                action: "Staked 2.5 ETH",
                protocol: "Lido",
                time: "2 hours ago",
                amount: "+$5,925",
              },
              {
                action: "Claimed rewards",
                protocol: "Aave",
                time: "1 day ago",
                amount: "+$42.50",
              },
              {
                action: "Deposited USDC",
                protocol: "Compound",
                time: "3 days ago",
                amount: "+$1,000",
              },
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
              >
                <div>
                  <p className="text-white text-sm font-medium">
                    {activity.action}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {activity.protocol} · {activity.time}
                  </p>
                </div>
                <span className="text-success text-sm font-semibold">
                  {activity.amount}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
