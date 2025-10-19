"use client";

import { PositionCard } from "./PositionCard";
import { Position } from "@/types/portfolio.types";

interface ActivePositionsProps {
  positions: Position[];
}

export function ActivePositions({ positions }: ActivePositionsProps) {
  if (!positions || positions.length === 0) {
    return (
      <div className="bg-white dark:bg-card border border-gray-200 dark:border-gray-800 rounded-md p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          No active positions yet
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
          Start staking to see your positions here
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Active Positions
        </h2>
        <span className="text-gray-600 dark:text-gray-400 text-sm">
          {positions.length} position{positions.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {positions.map((position) => (
          <PositionCard key={position.id} {...position} />
        ))}
      </div>
    </div>
  );
}
