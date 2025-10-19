"use client";

import { Card } from "@/components/common/Card";
import {
  Plus,
  ArrowsDownUp,
  ArrowLineUp,
  Robot,
  Lightning,
  ChartLine,
} from "@phosphor-icons/react";

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
  gradient?: boolean;
}

function QuickActionButton({
  icon,
  title,
  description,
  onClick,
  gradient,
}: QuickActionProps) {
  return (
    <Card
      className={`cursor-pointer hover:scale-[1.02] transition-transform ${
        gradient
          ? "bg-gradient-to-br from-primary-green/20 to-primary-green-light/20 border-primary-green/40"
          : ""
      }`}
      onClick={onClick}
      hoverable
    >
      <div className="flex items-start gap-4">
        <div
          className={`${
            gradient
              ? "bg-gradient-to-br from-primary-green to-primary-green-light"
              : "bg-gray-100 dark:bg-gray-800"
          } p-3 rounded-md`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h3
            className={`font-semibold mb-1 ${
              gradient ? "gradient-text" : "text-gray-900 dark:text-white"
            }`}
          >
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}

interface QuickActionsProps {
  onDeposit?: () => void;
  onSwap?: () => void;
  onWithdraw?: () => void;
  onAIOptimize?: () => void;
  onAutomate?: () => void;
  onAnalytics?: () => void;
}

export function QuickActions({
  onDeposit,
  onSwap,
  onWithdraw,
  onAIOptimize,
  onAutomate,
  onAnalytics,
}: QuickActionsProps) {
  const actions = [
    {
      icon: <Plus size={24} weight="bold" className="text-white" />,
      title: "Deposit Funds",
      description: "Add funds to start earning yield",
      onClick: onDeposit,
      gradient: true,
    },
    {
      icon: (
        <ArrowsDownUp
          size={24}
          weight="bold"
          className="text-gray-700 dark:text-white"
        />
      ),
      title: "Swap Tokens",
      description: "Exchange tokens at best rates",
      onClick: onSwap,
    },
    {
      icon: (
        <ArrowLineUp
          size={24}
          weight="bold"
          className="text-gray-700 dark:text-white"
        />
      ),
      title: "Withdraw",
      description: "Unstake and withdraw your funds",
      onClick: onWithdraw,
    },
    {
      icon: <Robot size={24} weight="bold" className="text-white" />,
      title: "AI Optimize",
      description: "Let AI optimize your portfolio",
      onClick: onAIOptimize,
      gradient: true,
    },
    {
      icon: (
        <Lightning
          size={24}
          weight="bold"
          className="text-gray-700 dark:text-white"
        />
      ),
      title: "Automate",
      description: "Set up automatic compounding",
      onClick: onAutomate,
    },
    {
      icon: (
        <ChartLine
          size={24}
          weight="bold"
          className="text-gray-700 dark:text-white"
        />
      ),
      title: "Analytics",
      description: "View detailed performance",
      onClick: onAnalytics,
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <QuickActionButton key={index} {...action} />
        ))}
      </div>
    </div>
  );
}
