"use client";

import { TrendUp, TrendDown } from "@phosphor-icons/react";

interface TrendIndicatorProps {
  value: number;
  showValue?: boolean;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function TrendIndicator({
  value,
  showValue = true,
  showIcon = true,
  size = "md",
  className = "",
}: TrendIndicatorProps) {
  const isPositive = value >= 0;

  const sizes = {
    sm: { icon: 14, text: "text-xs" },
    md: { icon: 16, text: "text-sm" },
    lg: { icon: 18, text: "text-base" },
  };

  const colorClass = isPositive ? "text-success" : "text-danger";

  return (
    <div className={`flex items-center gap-1 ${colorClass} ${className}`}>
      {showIcon &&
        (isPositive ? (
          <TrendUp size={sizes[size].icon} weight="bold" />
        ) : (
          <TrendDown size={sizes[size].icon} weight="bold" />
        ))}
      {showValue && (
        <span className={`font-semibold ${sizes[size].text}`}>
          {isPositive ? "+" : ""}
          {value.toFixed(2)}%
        </span>
      )}
    </div>
  );
}
