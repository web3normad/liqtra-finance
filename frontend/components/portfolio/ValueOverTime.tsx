"use client";

import { useState } from "react";
import { Card } from "@/components/common/Card";
import { AreaChart } from "@/components/charts/AreaChart";
import { TrendIndicator } from "@/components/charts/TrendIndicator";
import { CalendarBlank, Download } from "@phosphor-icons/react";
import { HistoricalData } from "@/types/portfolio.types";

type TimeRange = "24H" | "7D" | "1M" | "3M" | "1Y" | "ALL";

interface ValueOverTimeProps {
  data?: HistoricalData[];
  currentValue?: number;
  previousValue?: number;
  className?: string;
}

export function ValueOverTime({
  data = generateMockData("7D"),
  currentValue = 24567.89,
  previousValue = 21832.45,
  className = "",
}: ValueOverTimeProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("7D");

  const timeRanges: TimeRange[] = ["24H", "7D", "1M", "3M", "1Y", "ALL"];

  // Calculate change
  const change = currentValue - previousValue;
  const changePercent = (change / previousValue) * 100;

  // Handle time range selection
  const handleRangeChange = (range: TimeRange) => {
    setSelectedRange(range);
    // In a real app, this would fetch new data
    // setData(fetchDataForRange(range))
  };

  // Export data function
  const handleExport = () => {
    const csv =
      "Date,Value\n" +
      data
        .map((d) => `${new Date(d.timestamp).toISOString()},${d.value}`)
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio-value-${selectedRange}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className={className}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h2 className="text-xl font-bold text-white">
              Portfolio Value Over Time
            </h2>
            <TrendIndicator value={changePercent} showValue />
          </div>
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-gray-400 text-sm">Current Value</p>
              <p className="text-2xl font-bold text-white">
                $
                {currentValue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="h-10 w-px bg-gray-700" />
            <div>
              <p className="text-gray-400 text-sm">Change ({selectedRange})</p>
              <p
                className={`text-lg font-semibold ${
                  change >= 0 ? "text-success" : "text-danger"
                }`}
              >
                {change >= 0 ? "+" : ""}$
                {change.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700 rounded-lg transition-colors text-sm text-gray-300"
          >
            <Download size={16} weight="bold" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
        <CalendarBlank size={20} className="text-gray-400 flex-shrink-0" />
        <div className="flex space-x-2">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => handleRangeChange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0 ${
                selectedRange === range
                  ? "bg-primary-green text-white"
                  : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <AreaChart
          data={data}
          height={300}
          color="rgb(139, 92, 246)"
          gradientFrom="rgba(139, 92, 246, 0.3)"
          gradientTo="rgba(139, 92, 246, 0.01)"
        />
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-800">
        <div>
          <p className="text-gray-400 text-xs mb-1">24h High</p>
          <p className="text-white font-semibold">
            $
            {Math.max(...data.map((d) => d.value)).toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-1">24h Low</p>
          <p className="text-white font-semibold">
            $
            {Math.min(...data.map((d) => d.value)).toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-1">Average</p>
          <p className="text-white font-semibold">
            $
            {(
              data.reduce((sum, d) => sum + d.value, 0) / data.length
            ).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-1">Data Points</p>
          <p className="text-white font-semibold">{data.length}</p>
        </div>
      </div>
    </Card>
  );
}

// Generate mock historical data
function generateMockData(range: TimeRange): HistoricalData[] {
  const now = Date.now();
  let points: number;
  let interval: number;

  switch (range) {
    case "24H":
      points = 24;
      interval = 60 * 60 * 1000; // 1 hour
      break;
    case "7D":
      points = 168;
      interval = 60 * 60 * 1000; // 1 hour
      break;
    case "1M":
      points = 30;
      interval = 24 * 60 * 60 * 1000; // 1 day
      break;
    case "3M":
      points = 90;
      interval = 24 * 60 * 60 * 1000; // 1 day
      break;
    case "1Y":
      points = 365;
      interval = 24 * 60 * 60 * 1000; // 1 day
      break;
    case "ALL":
      points = 730;
      interval = 24 * 60 * 60 * 1000; // 1 day
      break;
  }

  const data: HistoricalData[] = [];
  let baseValue = 20000;

  for (let i = points; i >= 0; i--) {
    const timestamp = now - i * interval;
    // Add some realistic variation
    const randomChange = (Math.random() - 0.5) * 1000;
    const trend = (points - i) * 20; // Upward trend
    baseValue = Math.max(15000, baseValue + randomChange + trend / points);

    data.push({
      timestamp,
      value: baseValue,
      earnings: baseValue * 0.001, // Mock earnings
    });
  }

  return data;
}
