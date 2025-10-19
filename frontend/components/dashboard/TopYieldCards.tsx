"use client";

import { YieldCard } from "./YieldCard";
import { YieldOpportunity } from "@/types/protocol.types";

interface TopYieldCardsProps {
  opportunities: YieldOpportunity[];
  maxDisplay?: number;
  onStakeClick?: (opportunity: YieldOpportunity) => void;
}

export function TopYieldCards({
  opportunities,
  maxDisplay = 6,
  onStakeClick,
}: TopYieldCardsProps) {
  const displayOpportunities = opportunities.slice(0, maxDisplay);

  if (!opportunities || opportunities.length === 0) {
    return (
      <div className="bg-white dark:bg-card border border-gray-200 dark:border-gray-800 rounded-md p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          No yield opportunities available
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
          Check back later for new opportunities
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Top Yield Opportunities
        </h2>
        <button className="text-primary-green text-sm font-medium hover:text-primary-green-light transition-colors">
          View All →
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {displayOpportunities.map((opportunity) => (
          <YieldCard
            key={opportunity.id}
            protocol={opportunity.protocol.name}
            protocolLogo={opportunity.protocol.logo}
            pool={opportunity.pool.name}
            token={opportunity.pool.token.symbol}
            tokenLogo={opportunity.pool.token.logo}
            chain={opportunity.protocol.chain.name}
            chainLogo={opportunity.protocol.chain.logo}
            apy={opportunity.apy}
            apyBreakdown={opportunity.apyBreakdown}
            tvl={opportunity.tvl}
            risk={opportunity.risk}
            trending={opportunity.trending}
            featured={opportunity.featured}
            onStake={() => onStakeClick?.(opportunity)}
          />
        ))}
      </div>
    </div>
  );
}
