"use client";

import { useState } from "react";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import {
  MagnifyingGlass,
  ShieldCheck,
  TrendUp,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
} from "@phosphor-icons/react";
import { TrendIndicator } from "@/components/charts/TrendIndicator";

const mockProviders = [
  {
    id: "1",
    name: "Lido",
    logo: "🌊",
    description: "Leading liquid staking protocol",
    tvl: "$14.8B",
    apy: "4.2%",
    validators: 29,
    uptime: "99.9%",
    rating: 4.9,
    verified: true,
    risk: "low" as const,
  },
  {
    id: "2",
    name: "Rocket Pool",
    logo: "🚀",
    description: "Decentralized Ethereum staking",
    tvl: "$2.1B",
    apy: "3.8%",
    validators: 2847,
    uptime: "99.8%",
    rating: 4.8,
    verified: true,
    risk: "low" as const,
  },
  {
    id: "3",
    name: "Frax Finance",
    logo: "❄️",
    description: "Algorithmic liquid staking",
    tvl: "$856M",
    apy: "5.1%",
    validators: 12,
    uptime: "99.7%",
    rating: 4.6,
    verified: true,
    risk: "medium" as const,
  },
  {
    id: "4",
    name: "StakeWise",
    logo: "🧙",
    description: "Non-custodial staking platform",
    tvl: "$241M",
    apy: "3.9%",
    validators: 8,
    uptime: "99.6%",
    rating: 4.5,
    verified: true,
    risk: "low" as const,
  },
];

export default function ProvidersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRisk, setSelectedRisk] = useState("all");

  const filteredProviders = mockProviders.filter((provider) => {
    const matchesSearch = provider.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesRisk =
      selectedRisk === "all" || provider.risk === selectedRisk;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Staking Providers
        </h1>
        <p className="text-gray-400">
          Compare and choose trusted staking providers
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Providers</span>
            <Users size={20} className="text-primary-green" />
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {mockProviders.length}
          </p>
          <p className="text-sm text-gray-400">Verified protocols</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total TVL</span>
            <TrendUp size={20} weight="fill" className="text-success" />
          </div>
          <p className="text-2xl font-bold text-white mb-1">$17.9B</p>
          <TrendIndicator value={12.3} size="sm" showIcon={false} />
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Avg APY</span>
            <Star size={20} weight="fill" className="text-warning" />
          </div>
          <p className="text-2xl font-bold text-white mb-1">4.2%</p>
          <p className="text-sm text-gray-400">Weighted average</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Avg Uptime</span>
            <ShieldCheck size={20} weight="fill" className="text-success" />
          </div>
          <p className="text-2xl font-bold text-white mb-1">99.8%</p>
          <p className="text-sm text-gray-400">Last 30 days</p>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <MagnifyingGlass
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-green/50 transition-all"
            />
          </div>

          {/* Risk Filter */}
          <div className="flex items-center space-x-2">
            {[
              { value: "all", label: "All Risk" },
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedRisk(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedRisk === option.value
                    ? "bg-primary-green text-white"
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Providers List */}
      <div className="space-y-4">
        {filteredProviders.map((provider, index) => (
          <Card key={provider.id}>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Left: Provider Info */}
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-16 h-16 bg-gray-800 rounded-md flex items-center justify-center text-3xl flex-shrink-0">
                  {provider.logo}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-bold text-white">
                      {provider.name}
                    </h3>
                    {provider.verified && (
                      <CheckCircle
                        size={18}
                        weight="fill"
                        className="text-primary-green-light"
                      />
                    )}
                    <Badge
                      variant={provider.risk === "low" ? "success" : "warning"}
                      size="sm"
                    >
                      {provider.risk === "low" ? "Low Risk" : "Med Risk"}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">
                    {provider.description}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">TVL</p>
                      <p className="text-white font-semibold">{provider.tvl}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">APY</p>
                      <p className="text-success font-semibold">
                        {provider.apy}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Validators</p>
                      <p className="text-white font-semibold">
                        {provider.validators.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Uptime</p>
                      <p className="text-white font-semibold">
                        {provider.uptime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Rating & Action */}
              <div className="flex md:flex-col items-center md:items-end gap-4">
                <div className="text-center md:text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    <Star size={20} weight="fill" className="text-warning" />
                    <span className="text-white font-bold text-lg">
                      {provider.rating}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs">Rating</p>
                </div>
                <Button variant="primary">
                  <span>View Details</span>
                  <ArrowRight size={18} weight="bold" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProviders.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <MagnifyingGlass size={32} className="text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No providers found
            </h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search or filters
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                setSearchQuery("");
                setSelectedRisk("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </Card>
      )}

      {/* Info Card */}
      <Card>
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-primary-green/20 rounded-md flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={24} className="text-primary-green" />
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">
              Choosing a Provider
            </h4>
            <p className="text-gray-400 text-sm mb-3">
              When selecting a staking provider, consider factors like TVL
              (Total Value Locked), APY (Annual Percentage Yield), number of
              validators, uptime, and risk level. Verified providers have been
              audited and meet our security standards.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="purple">Audited</Badge>
              <Badge variant="blue">Decentralized</Badge>
              <Badge variant="success">High Uptime</Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
