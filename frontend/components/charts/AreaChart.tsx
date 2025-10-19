"use client";

import { useMemo } from "react";
import { HistoricalData } from "@/types/portfolio.types";

interface AreaChartProps {
  data: HistoricalData[];
  height?: number;
  color?: string;
  gradientFrom?: string;
  gradientTo?: string;
  showGrid?: boolean;
  showTooltip?: boolean;
  className?: string;
}

export function AreaChart({
  data,
  height = 300,
  color = "rgb(139, 92, 246)",
  gradientFrom = "rgba(139, 92, 246, 0.3)",
  gradientTo = "rgba(139, 92, 246, 0.01)",
  showGrid = true,
  className = "",
}: AreaChartProps) {
  // Calculate chart dimensions and scales
  const { path, areaPath, points, minValue, maxValue, yScale } = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        path: "",
        areaPath: "",
        points: [],
        minValue: 0,
        maxValue: 0,
        yScale: [],
      };
    }

    const values = data.map((d) => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue || 1;

    const padding = 20;
    const chartHeight = height - padding * 2;
    const chartWidth = 100; // Using percentages
    const stepX = chartWidth / (data.length - 1);

    // Generate SVG path
    const points = data.map((d, i) => {
      const x = i * stepX;
      const y =
        padding + (chartHeight - ((d.value - minValue) / range) * chartHeight);
      return { x, y, value: d.value, timestamp: d.timestamp };
    });

    // Line path
    const path = points
      .map((p, i) => {
        const command = i === 0 ? "M" : "L";
        return `${command} ${p.x} ${p.y}`;
      })
      .join(" ");

    // Area path (includes bottom)
    const areaPath =
      path + ` L ${points[points.length - 1].x} ${height} L 0 ${height} Z`;

    // Generate Y-axis scale
    const yScale = Array.from({ length: 5 }, (_, i) => {
      const value = minValue + (range * (4 - i)) / 4;
      return {
        value,
        y: padding + (chartHeight * i) / 4,
      };
    });

    return { path, areaPath, points, minValue, maxValue, yScale };
  }, [data, height]);

  if (!data || data.length === 0) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-800/30 rounded-md ${className}`}
        style={{ height: `${height}px` }}
      >
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ height: `${height}px` }}>
      <svg
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          {/* Gradient for area fill */}
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={gradientFrom} />
            <stop offset="100%" stopColor={gradientTo} />
          </linearGradient>

          {/* Glow filter for line */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines */}
        {showGrid && (
          <g className="opacity-10">
            {yScale.map((scale, i) => (
              <line
                key={i}
                x1="0"
                y1={scale.y}
                x2="100"
                y2={scale.y}
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-gray-400"
              />
            ))}
          </g>
        )}

        {/* Area */}
        <path
          d={areaPath}
          fill="url(#areaGradient)"
          className="transition-all duration-300"
        />

        {/* Line */}
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
          className="transition-all duration-300"
        />

        {/* Points (optional, shown on hover) */}
        <g className="opacity-0 hover:opacity-100 transition-opacity duration-200">
          {points.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="0.8"
              fill={color}
              className="transition-all duration-200"
            />
          ))}
        </g>
      </svg>

      {/* Y-axis labels */}
      {showGrid && (
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-5 pointer-events-none">
          {yScale.map((scale, i) => (
            <span key={i} className="text-xs text-gray-500">
              ${(scale.value / 1000).toFixed(1)}k
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
