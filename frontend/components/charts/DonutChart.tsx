"use client";

import { useMemo } from "react";

export interface DonutChartData {
  label: string;
  value: number;
  color: string;
  percentage?: number;
}

interface DonutChartProps {
  data: DonutChartData[];
  size?: number;
  thickness?: number;
  showLabels?: boolean;
  showLegend?: boolean;
  centerContent?: React.ReactNode;
  className?: string;
}

export function DonutChart({
  data,
  size = 200,
  thickness = 15,
  showLabels = false,
  showLegend = true,
  centerContent,
  className = "",
}: DonutChartProps) {
  // Calculate percentages and total
  const { chartData, total } = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const chartData = data.map((item) => ({
      ...item,
      percentage: total > 0 ? (item.value / total) * 100 : 0,
    }));
    return { chartData, total };
  }, [data]);

  // Generate SVG paths for donut segments
  const segments = useMemo(() => {
    let currentAngle = 0;
    const radius = 50 - thickness / 2;
    const centerX = 50;
    const centerY = 50;

    return chartData.map((item, index) => {
      const percentage = item.percentage || 0;
      const angle = (percentage / 100) * 360;
      const endAngle = currentAngle + angle;

      // Calculate start and end points
      const startX =
        centerX + radius * Math.cos((currentAngle * Math.PI) / 180);
      const startY =
        centerY + radius * Math.sin((currentAngle * Math.PI) / 180);
      const endX = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
      const endY = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

      // Large arc flag
      const largeArcFlag = angle > 180 ? 1 : 0;

      // SVG path
      const path = `
        M ${centerX} ${centerY}
        L ${startX} ${startY}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
        Z
      `;

      // Calculate label position (middle of segment)
      const labelAngle = currentAngle + angle / 2;
      const labelRadius = radius + 8;
      const labelX =
        centerX + labelRadius * Math.cos((labelAngle * Math.PI) / 180);
      const labelY =
        centerY + labelRadius * Math.sin((labelAngle * Math.PI) / 180);

      currentAngle = endAngle;

      return {
        path,
        color: item.color,
        label: item.label,
        percentage,
        value: item.value,
        labelX,
        labelY,
      };
    });
  }, [chartData, thickness]);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Donut Chart SVG */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          viewBox="0 0 100 100"
          width={size}
          height={size}
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={50 - thickness / 2}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={thickness}
          />

          {/* Segments */}
          {segments.map((segment, index) => (
            <g key={index}>
              <path
                d={segment.path}
                fill={segment.color}
                className="transition-opacity hover:opacity-80 cursor-pointer"
                style={{
                  transformOrigin: "center",
                }}
              />
              {showLabels && segment.percentage > 5 && (
                <text
                  x={segment.labelX}
                  y={segment.labelY}
                  className="text-xs font-semibold fill-white"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    transform: "rotate(90deg)",
                    transformOrigin: `${segment.labelX}% ${segment.labelY}%`,
                  }}
                >
                  {segment.percentage.toFixed(0)}%
                </text>
              )}
            </g>
          ))}
        </svg>

        {/* Center Content */}
        {centerContent && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {centerContent}
          </div>
        )}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="mt-6 w-full space-y-2">
          {chartData.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-300 font-medium">
                  {item.label}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-white font-semibold">
                  {item.percentage?.toFixed(1)}%
                </span>
                <span className="text-xs text-gray-400">
                  ${item.value.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Simple donut chart with just the chart (no legend)
export function SimpleDonutChart({
  data,
  size = 120,
  thickness = 12,
  centerContent,
  className = "",
}: Omit<DonutChartProps, "showLegend" | "showLabels">) {
  return (
    <DonutChart
      data={data}
      size={size}
      thickness={thickness}
      showLegend={false}
      showLabels={false}
      centerContent={centerContent}
      className={className}
    />
  );
}
