"use client";

import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import {
  Lightning,
  TrendUp,
  ShieldCheck,
  Target,
  ChartLineUp,
  Sparkle,
  ArrowRight,
  CheckCircle,
} from "@phosphor-icons/react";
import { TrendIndicator } from "@/components/charts/TrendIndicator";

const strategies = [
  {
    id: "1",
    name: "Conservative Growth",
    description: "Low-risk strategy focused on stable returns",
    icon: "🛡️",
    risk: "low" as const,
    targetAPY: "3.5-4.5%",
    allocation: [
      { protocol: "Lido", percentage: 50 },
      { protocol: "Rocket Pool", percentage: 30 },
      { protocol: "Aave USDC", percentage: 20 },
    ],
    recommended: false,
  },
  {
    id: "2",
    name: "Balanced Yield",
    description: "Medium-risk strategy balancing safety and returns",
    icon: "⚖️",
    risk: "medium" as const,
    targetAPY: "5.0-7.0%",
    allocation: [
      { protocol: "Lido", percentage: 40 },
      { protocol: "Frax", percentage: 30 },
      { protocol: "Curve", percentage: 20 },
      { protocol: "Aave", percentage: 10 },
    ],
    recommended: true,
  },
  {
    id: "3",
    name: "Aggressive Growth",
    description: "High-risk strategy maximizing potential returns",
    icon: "🚀",
    risk: "high" as const,
    targetAPY: "8.0-12.0%",
    allocation: [
      { protocol: "Frax", percentage: 35 },
      { protocol: "Convex", percentage: 25 },
      { protocol: "GMX", percentage: 20 },
      { protocol: "Pendle", percentage: 20 },
    ],
    recommended: false,
  },
  {
    id: "4",
    name: "Stablecoin Yield",
    description: "Focused on stable assets with consistent returns",
    icon: "💵",
    risk: "low" as const,
    targetAPY: "4.5-6.0%",
    allocation: [
      { protocol: "Aave USDC", percentage: 40 },
      { protocol: "Compound DAI", percentage: 30 },
      { protocol: "Curve 3pool", percentage: 30 },
    ],
    recommended: false,
  },
];

export default function StrategiesPage() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Yield Strategies</h1>
        <p className="text-gray-400">
          Pre-built strategies optimized for different risk profiles
        </p>
      </div>

      {/* AI Recommendation Banner */}
      <Card variant="gradient">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/10 rounded-md flex items-center justify-center">
              <Sparkle size={24} weight="fill" className="text-white" />
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">
                AI-Powered Strategy Recommendations
              </h4>
              <p className="text-white/70 text-sm">
                Let our AI analyze your portfolio and suggest the best strategy
                for your goals
              </p>
            </div>
          </div>
          <Button variant="secondary">
            <Sparkle size={18} weight="fill" />
            <span>Get Recommendation</span>
          </Button>
        </div>
      </Card>

      {/* Strategy Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Strategies</span>
            <Target size={20} className="text-primary-green" />
          </div>
          <p className="text-2xl font-bold text-white mb-1">4</p>
          <p className="text-sm text-gray-400">Available strategies</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Avg Returns</span>
            <TrendUp size={20} weight="fill" className="text-success" />
          </div>
          <p className="text-2xl font-bold text-white mb-1">5.8%</p>
          <TrendIndicator value={2.3} size="sm" showIcon={false} />
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Active Users</span>
            <ChartLineUp
              size={20}
              weight="fill"
              className="text-primary-green-light"
            />
          </div>
          <p className="text-2xl font-bold text-white mb-1">12.4K</p>
          <p className="text-sm text-gray-400">Using strategies</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Success Rate</span>
            <ShieldCheck size={20} weight="fill" className="text-success" />
          </div>
          <p className="text-2xl font-bold text-white mb-1">94%</p>
          <p className="text-sm text-gray-400">Target achievement</p>
        </Card>
      </div>

      {/* Strategies List */}
      <div className="space-y-6">
        {strategies.map((strategy) => (
          <Card key={strategy.id}>
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              {/* Left: Strategy Info */}
              <div className="flex-1">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gray-800 rounded-md flex items-center justify-center text-3xl flex-shrink-0">
                    {strategy.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-bold text-white">
                        {strategy.name}
                      </h3>
                      {strategy.recommended && (
                        <Badge variant="purple">
                          <Sparkle size={14} weight="fill" />
                          <span>Recommended</span>
                        </Badge>
                      )}
                      <Badge
                        variant={
                          strategy.risk === "low"
                            ? "success"
                            : strategy.risk === "medium"
                            ? "warning"
                            : "danger"
                        }
                        size="sm"
                      >
                        {strategy.risk} risk
                      </Badge>
                    </div>
                    <p className="text-gray-400 mb-4">{strategy.description}</p>

                    {/* Target APY */}
                    <div className="flex items-center space-x-6 mb-4">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Target APY</p>
                        <p className="text-success font-bold text-lg">
                          {strategy.targetAPY}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Protocols</p>
                        <p className="text-white font-semibold">
                          {strategy.allocation.length}
                        </p>
                      </div>
                    </div>

                    {/* Allocation Breakdown */}
                    <div>
                      <p className="text-sm font-medium text-gray-300 mb-3">
                        Asset Allocation
                      </p>
                      <div className="space-y-2">
                        {strategy.allocation.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center space-x-3"
                          >
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-white">
                                  {item.protocol}
                                </span>
                                <span className="text-sm text-gray-400">
                                  {item.percentage}%
                                </span>
                              </div>
                              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-primary-green to-primary-green-light"
                                  style={{ width: `${item.percentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Action */}
              <div className="flex flex-col items-stretch lg:items-end gap-3">
                <Button variant="primary" className="w-full lg:w-auto">
                  <Lightning size={18} weight="fill" />
                  <span>Activate Strategy</span>
                </Button>
                <Button variant="secondary" className="w-full lg:w-auto">
                  <span>View Details</span>
                  <ArrowRight size={18} weight="bold" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Custom Strategy CTA */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-green/20 rounded-md flex items-center justify-center">
              <Target size={24} className="text-primary-green" />
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">
                Need a Custom Strategy?
              </h4>
              <p className="text-gray-400 text-sm">
                Work with our AI to build a personalized yield strategy
              </p>
            </div>
          </div>
          <Button variant="primary">
            <Sparkle size={18} weight="fill" />
            <span>Build Custom</span>
          </Button>
        </div>
      </Card>

      {/* How It Works */}
      <Card>
        <h3 className="text-lg font-bold text-white mb-6">
          How Strategies Work
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="w-12 h-12 bg-primary-green/20 rounded-md flex items-center justify-center mb-3">
              <CheckCircle
                size={24}
                weight="fill"
                className="text-primary-green"
              />
            </div>
            <h4 className="text-white font-semibold mb-2">Choose Strategy</h4>
            <p className="text-gray-400 text-sm">
              Select a pre-built strategy that matches your risk tolerance and
              goals
            </p>
          </div>

          <div>
            <div className="w-12 h-12 bg-primary-green-light/20 rounded-md flex items-center justify-center mb-3">
              <Lightning
                size={24}
                weight="fill"
                className="text-primary-green-light"
              />
            </div>
            <h4 className="text-white font-semibold mb-2">Auto-Deploy</h4>
            <p className="text-gray-400 text-sm">
              Your funds are automatically allocated across protocols according
              to the strategy
            </p>
          </div>

          <div>
            <div className="w-12 h-12 bg-success/20 rounded-md flex items-center justify-center mb-3">
              <TrendUp size={24} weight="fill" className="text-success" />
            </div>
            <h4 className="text-white font-semibold mb-2">Earn & Optimize</h4>
            <p className="text-gray-400 text-sm">
              Strategies auto-rebalance to maximize returns while managing risk
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
