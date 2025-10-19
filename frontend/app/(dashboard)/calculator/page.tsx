"use client";

import { useState } from "react";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import {
  Lightning,
  Calculator as CalcIcon,
  TrendUp,
  Calendar,
  ArrowRight,
  Info,
} from "@phosphor-icons/react";

export default function CalculatorPage() {
  const [amount, setAmount] = useState("10000");
  const [duration, setDuration] = useState("365");
  const [apy, setApy] = useState("5.5");
  const [compounding, setCompounding] = useState("daily");

  // Calculate earnings
  const principal = parseFloat(amount) || 0;
  const rate = parseFloat(apy) / 100 || 0;
  const days = parseInt(duration) || 0;
  const periods =
    compounding === "daily"
      ? days
      : compounding === "weekly"
      ? days / 7
      : days / 30;

  const futureValue = principal * Math.pow(1 + rate / periods, periods);
  const earnings = futureValue - principal;
  const dailyEarnings = earnings / days;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Staking Calculator
        </h1>
        <p className="text-gray-400">
          Estimate your potential earnings from staking
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calculator Form */}
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-bold text-white mb-6">
              Calculate Returns
            </h3>

            <div className="space-y-6">
              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Investment Amount ($)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-md text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary-green/50 transition-all"
                  placeholder="10000"
                />
                <p className="text-gray-400 text-sm mt-2">
                  Initial amount to stake
                </p>
              </div>

              {/* APY Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expected APY (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={apy}
                  onChange={(e) => setApy(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-md text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary-green/50 transition-all"
                  placeholder="5.5"
                />
                <p className="text-gray-400 text-sm mt-2">
                  Annual percentage yield
                </p>
              </div>

              {/* Duration Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Staking Duration (days)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-md text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary-green/50 transition-all"
                  placeholder="365"
                />
                <div className="flex items-center space-x-2 mt-2">
                  {[30, 90, 180, 365].map((days) => (
                    <button
                      key={days}
                      onClick={() => setDuration(days.toString())}
                      className="px-3 py-1 bg-gray-800/50 hover:bg-gray-700 rounded-lg text-gray-300 text-sm transition-colors"
                    >
                      {days}d
                    </button>
                  ))}
                </div>
              </div>

              {/* Compounding Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Compounding Frequency
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "daily", label: "Daily" },
                    { value: "weekly", label: "Weekly" },
                    { value: "monthly", label: "Monthly" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setCompounding(option.value)}
                      className={`px-4 py-3 rounded-md font-medium transition-all ${
                        compounding === option.value
                          ? "bg-primary-green text-white"
                          : "bg-gray-800/50 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <Card variant="gradient">
            <div className="text-center">
              <p className="text-white/70 text-sm mb-2">Projected Earnings</p>
              <p className="text-4xl font-bold text-white mb-4">
                $
                {earnings.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </p>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <TrendUp size={20} weight="fill" className="text-success" />
                <span className="text-success font-semibold">
                  +{((earnings / principal) * 100).toFixed(2)}%
                </span>
              </div>
              <div className="pt-4 border-t border-white/10">
                <p className="text-white/70 text-sm mb-1">Total Value</p>
                <p className="text-2xl font-bold text-white">
                  $
                  {futureValue.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h4 className="text-white font-semibold mb-4">Breakdown</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Daily Earnings</span>
                <span className="text-white font-medium">
                  ${dailyEarnings.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Weekly Earnings</span>
                <span className="text-white font-medium">
                  ${(dailyEarnings * 7).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Monthly Earnings</span>
                <span className="text-white font-medium">
                  ${(dailyEarnings * 30).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                <span className="text-gray-400 text-sm">Yearly Earnings</span>
                <span className="text-success font-semibold">
                  ${(dailyEarnings * 365).toFixed(2)}
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-primary-green/20 rounded-md flex items-center justify-center flex-shrink-0">
                <Info size={20} className="text-primary-green" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Note</h4>
                <p className="text-gray-400 text-sm">
                  These calculations are estimates. Actual returns may vary
                  based on market conditions and protocol performance.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Comparison Table */}
      <Card>
        <h3 className="text-lg font-bold text-white mb-6">
          Compare Different Scenarios
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  Duration
                </th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">
                  3% APY
                </th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">
                  5% APY
                </th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">
                  7% APY
                </th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">
                  10% APY
                </th>
              </tr>
            </thead>
            <tbody>
              {[30, 90, 180, 365].map((days) => {
                const calc = (apy: number) => {
                  const rate = apy / 100;
                  const periods = days;
                  const fv = principal * Math.pow(1 + rate / periods, periods);
                  return fv - principal;
                };

                return (
                  <tr key={days} className="border-b border-gray-800/50">
                    <td className="py-3 px-4 text-white font-medium">
                      {days} days
                    </td>
                    <td className="py-3 px-4 text-right text-gray-300">
                      ${calc(3).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-300">
                      ${calc(5).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-300">
                      ${calc(7).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right text-success font-semibold">
                      ${calc(10).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Call to Action */}
      <Card variant="gradient">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/10 rounded-md flex items-center justify-center">
              <Lightning size={24} weight="fill" className="text-white" />
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">
                Ready to start earning?
              </h4>
              <p className="text-white/70 text-sm">
                Browse top staking opportunities and start earning today
              </p>
            </div>
          </div>
          <Button variant="secondary">
            <span>Explore Pools</span>
            <ArrowRight size={18} weight="bold" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
