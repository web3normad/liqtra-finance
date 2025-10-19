"use client";

import { Card } from "@/components/common/Card";
import { DonutChart } from "@/components/charts/DonutChart";

const allocations = [
  { label: "Aave", value: 8600, color: "#a855f7", percentage: 35 },
  { label: "Compound", value: 6150, color: "#3b82f6", percentage: 25 },
  { label: "Lido", value: 4900, color: "#22c55e", percentage: 20 },
  { label: "Uniswap", value: 3680, color: "#ec4899", percentage: 15 },
  { label: "Other", value: 1237, color: "#6b7280", percentage: 5 },
];

export function AllocationChart() {
  const totalValue = allocations.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-2">
          Portfolio Allocation
        </h3>
        <p className="text-sm text-gray-400">Distribution across protocols</p>
      </div>

      <DonutChart
        data={allocations}
        size={220}
        thickness={18}
        showLegend={true}
        centerContent={
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              ${(totalValue / 1000).toFixed(1)}K
            </p>
            <p className="text-xs text-gray-400">Total Value</p>
          </div>
        }
      />
    </Card>
  );
}
