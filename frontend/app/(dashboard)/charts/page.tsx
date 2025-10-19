"use client";

import { DonutChart, SimpleDonutChart } from "@/components/charts/DonutChart";
import { Card } from "@/components/common/Card";

/**
 * DonutChart Examples Page
 *
 * Demonstrates various configurations of the DonutChart component
 */
export default function DonutChartExamplesPage() {
  // Example 1: Portfolio Allocation
  const portfolioData = [
    { label: "Aave", value: 8600, color: "#a855f7" },
    { label: "Compound", value: 6150, color: "#3b82f6" },
    { label: "Lido", value: 4900, color: "#22c55e" },
    { label: "Uniswap", value: 3680, color: "#ec4899" },
    { label: "Other", value: 1237, color: "#6b7280" },
  ];

  // Example 2: Risk Distribution
  const riskData = [
    { label: "Low Risk", value: 60, color: "#22c55e" },
    { label: "Medium Risk", value: 30, color: "#f59e0b" },
    { label: "High Risk", value: 10, color: "#ef4444" },
  ];

  // Example 3: Chain Distribution
  const chainData = [
    { label: "Ethereum", value: 45000, color: "#627eea" },
    { label: "Polygon", value: 25000, color: "#8247e5" },
    { label: "Arbitrum", value: 15000, color: "#28a0f0" },
    { label: "Optimism", value: 10000, color: "#ff0420" },
    { label: "Base", value: 5000, color: "#0052ff" },
  ];

  // Example 4: Asset Types
  const assetData = [
    { label: "Stablecoins", value: 40, color: "#22c55e" },
    { label: "ETH", value: 30, color: "#627eea" },
    { label: "BTC", value: 20, color: "#f7931a" },
    { label: "Altcoins", value: 10, color: "#8b5cf6" },
  ];

  const totalPortfolio = portfolioData.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const totalChains = chainData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          DonutChart Examples
        </h1>
        <p className="text-gray-400">
          Various configurations and use cases for the DonutChart component
        </p>
      </div>

      {/* Grid of Examples */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Example 1: Full Featured */}
        <Card>
          <h3 className="text-lg font-bold text-white mb-4">
            Portfolio Allocation
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            Full-featured chart with legend and center content
          </p>
          <DonutChart
            data={portfolioData}
            size={240}
            thickness={20}
            showLegend={true}
            centerContent={
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  ${(totalPortfolio / 1000).toFixed(1)}K
                </p>
                <p className="text-xs text-gray-400">Total Value</p>
              </div>
            }
          />
        </Card>

        {/* Example 2: With Labels */}
        <Card>
          <h3 className="text-lg font-bold text-white mb-4">
            Risk Distribution
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            Shows percentage labels on segments
          </p>
          <DonutChart
            data={riskData}
            size={240}
            thickness={25}
            showLabels={true}
            showLegend={true}
            centerContent={
              <div className="text-center">
                <p className="text-xl font-bold text-white">Risk</p>
                <p className="text-xs text-gray-400">Profile</p>
              </div>
            }
          />
        </Card>

        {/* Example 3: Chain Distribution */}
        <Card>
          <h3 className="text-lg font-bold text-white mb-4">
            Multi-Chain Distribution
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            5 chains with detailed breakdown
          </p>
          <DonutChart
            data={chainData}
            size={240}
            thickness={18}
            centerContent={
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  ${(totalChains / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-gray-400">5 Chains</p>
              </div>
            }
          />
        </Card>

        {/* Example 4: Simple (No Legend) */}
        <Card>
          <h3 className="text-lg font-bold text-white mb-4">
            Asset Distribution
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            Compact version without legend
          </p>
          <div className="flex flex-col items-center">
            <SimpleDonutChart
              data={assetData}
              size={200}
              thickness={20}
              centerContent={
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">100%</p>
                  <p className="text-xs text-gray-400">Allocated</p>
                </div>
              }
            />
            <div className="mt-6 grid grid-cols-2 gap-3 w-full">
              {assetData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-2 bg-gray-800/30 rounded-lg"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-300">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Customization Examples */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Small */}
        <Card>
          <h4 className="text-md font-semibold text-white mb-4">
            Small (150px)
          </h4>
          <div className="flex justify-center">
            <SimpleDonutChart
              data={riskData}
              size={150}
              thickness={15}
              centerContent={
                <span className="text-white text-lg font-bold">100%</span>
              }
            />
          </div>
        </Card>

        {/* Medium */}
        <Card>
          <h4 className="text-md font-semibold text-white mb-4">
            Medium (200px)
          </h4>
          <div className="flex justify-center">
            <SimpleDonutChart
              data={assetData}
              size={200}
              thickness={18}
              centerContent={
                <span className="text-white text-xl font-bold">4</span>
              }
            />
          </div>
        </Card>

        {/* Large */}
        <Card>
          <h4 className="text-md font-semibold text-white mb-4">
            Large (250px)
          </h4>
          <div className="flex justify-center">
            <SimpleDonutChart
              data={chainData}
              size={250}
              thickness={22}
              centerContent={
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">$100K</p>
                  <p className="text-xs text-gray-400">Total</p>
                </div>
              }
            />
          </div>
        </Card>
      </div>

      {/* Usage Code */}
      <Card>
        <h3 className="text-lg font-bold text-white mb-4">Usage Example</h3>
        <pre className="bg-gray-800/50 p-4 rounded-lg overflow-x-auto text-sm text-gray-300">
          {`import { DonutChart } from '@/components/charts/DonutChart'

const data = [
  { label: 'Aave', value: 8600, color: '#a855f7' },
  { label: 'Compound', value: 6150, color: '#3b82f6' },
  { label: 'Lido', value: 4900, color: '#22c55e' },
]

<DonutChart
  data={data}
  size={240}
  thickness={20}
  showLegend={true}
  centerContent={
    <div className="text-center">
      <p className="text-2xl font-bold text-white">$24.5K</p>
      <p className="text-xs text-gray-400">Total</p>
    </div>
  }
/>`}
        </pre>
      </Card>
    </div>
  );
}
