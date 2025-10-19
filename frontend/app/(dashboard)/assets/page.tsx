"use client";

import { useState } from "react";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Tabs } from "@/components/common/Tabs";
import { AssetList } from "@/components/portfolio/AssetList";
import { AllocationChart } from "@/components/portfolio/AllocationChart";
import {
  MagnifyingGlass,
  Funnel,
  ArrowsDownUp,
  Plus,
  Download,
  TrendUp,
  TrendDown,
} from "@phosphor-icons/react";
import { TrendIndicator } from "@/components/charts/TrendIndicator";

// Mock asset data
const mockAssets = [
  {
    id: "1",
    name: "Ethereum",
    symbol: "ETH",
    protocol: "Lido",
    balance: "5.25",
    value: "$12,450.75",
    apy: "4.2%",
    change24h: "+5.2%",
    logo: "🔷",
    chain: "Ethereum",
    status: "active" as const,
  },
  {
    id: "2",
    name: "Ethereum",
    symbol: "ETH",
    protocol: "Rocket Pool",
    balance: "3.5",
    value: "$8,298.50",
    apy: "3.8%",
    change24h: "+4.8%",
    logo: "🔷",
    chain: "Ethereum",
    status: "active" as const,
  },
  {
    id: "3",
    name: "USD Coin",
    symbol: "USDC",
    protocol: "Aave",
    balance: "15,000",
    value: "$15,000.00",
    apy: "5.5%",
    change24h: "+0.1%",
    logo: "💵",
    chain: "Polygon",
    status: "active" as const,
  },
  {
    id: "4",
    name: "Wrapped BTC",
    symbol: "WBTC",
    protocol: "Compound",
    balance: "0.25",
    value: "$10,750.00",
    apy: "2.3%",
    change24h: "+3.5%",
    logo: "₿",
    chain: "Ethereum",
    status: "active" as const,
  },
];

export default function AssetsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Calculate totals
  const totalValue = mockAssets.reduce(
    (sum, asset) => sum + parseFloat(asset.value.replace(/[$,]/g, "")),
    0
  );
  const totalEarnings = 2453.4;
  const change24h = 5.2;

  const tabs = [
    { value: "all", label: "All Assets" },
    { value: "staking", label: "Staking" },
    { value: "lending", label: "Lending" },
    { value: "liquidity", label: "Liquidity" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Assets</h1>
        <p className="text-gray-400">
          Manage and track all your DeFi assets across protocols
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Value</span>
            <TrendIndicator value={change24h} size="sm" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            $
            {totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-400">
            Across {mockAssets.length} assets
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Earnings</span>
            <Badge variant="success" size="sm">
              Active
            </Badge>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            ${totalEarnings.toLocaleString()}
          </p>
          <p className="text-sm text-gray-400">All time earnings</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Average APY</span>
            <TrendUp size={20} weight="fill" className="text-success" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">4.2%</p>
          <p className="text-sm text-gray-400">Weighted average</p>
        </Card>
      </div>

      {/* Asset Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AllocationChart />
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-bold text-white mb-6">
              Asset Overview
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-gray-400 text-sm mb-2">Top Performer</p>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🔷</span>
                  <div>
                    <p className="text-white font-semibold">ETH (Lido)</p>
                    <p className="text-success text-sm">+5.2% (24h)</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-2">Highest APY</p>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">💵</span>
                  <div>
                    <p className="text-white font-semibold">USDC (Aave)</p>
                    <p className="text-primary-green text-sm">5.5% APY</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-2">Largest Position</p>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">💵</span>
                  <div>
                    <p className="text-white font-semibold">USDC</p>
                    <p className="text-gray-400 text-sm">$15,000</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-2">Active Protocols</p>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🔧</span>
                  <div>
                    <p className="text-white font-semibold">4 Protocols</p>
                    <p className="text-gray-400 text-sm">Diversified</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Actions Bar */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlass
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-green/50 transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Funnel size={18} />
              <span>Filters</span>
            </Button>
            <Button variant="secondary" size="sm">
              <ArrowsDownUp size={18} />
              <span>Sort</span>
            </Button>
            <Button variant="primary" size="sm">
              <Plus size={18} weight="bold" />
              <span>Add Asset</span>
            </Button>
            <Button variant="secondary" size="sm">
              <Download size={18} />
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <select className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-green/50">
                <option>All Chains</option>
                <option>Ethereum</option>
                <option>Polygon</option>
                <option>Arbitrum</option>
              </select>
              <select className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-green/50">
                <option>All Protocols</option>
                <option>Lido</option>
                <option>Aave</option>
                <option>Compound</option>
              </select>
              <select className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-green/50">
                <option>All Status</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Unstaking</option>
              </select>
              <select className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-green/50">
                <option>All Risk Levels</option>
                <option>Low Risk</option>
                <option>Medium Risk</option>
                <option>High Risk</option>
              </select>
            </div>
          </div>
        )}
      </Card>

      {/* Tabs */}
      <Tabs tabs={tabs} defaultValue={activeTab} onChange={setActiveTab}>
        {() => <></>}
      </Tabs>

      {/* Assets List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  Asset
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  Protocol
                </th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">
                  Balance
                </th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">
                  Value
                </th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">
                  APY
                </th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">
                  24h Change
                </th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {mockAssets.map((asset) => (
                <tr
                  key={asset.id}
                  className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{asset.logo}</span>
                      <div>
                        <p className="text-white font-medium">{asset.symbol}</p>
                        <p className="text-gray-400 text-sm">{asset.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="purple" size="sm">
                      {asset.protocol}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <p className="text-white font-medium">{asset.balance}</p>
                    <p className="text-gray-400 text-sm">{asset.symbol}</p>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <p className="text-white font-semibold">{asset.value}</p>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Badge variant="success" size="sm">
                      {asset.apy}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <TrendIndicator
                      value={parseFloat(asset.change24h.replace(/[+%]/g, ""))}
                      size="sm"
                    />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Button variant="secondary" size="sm">
                      Manage
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Empty State (show when no assets) */}
      {mockAssets.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Assets Yet</h3>
            <p className="text-gray-400 mb-6">
              Start by depositing assets into yield-generating protocols
            </p>
            <Button variant="primary">
              <Plus size={18} weight="bold" />
              <span>Add First Asset</span>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
