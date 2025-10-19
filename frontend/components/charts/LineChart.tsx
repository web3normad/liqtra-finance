"use client";

import { useState, useMemo } from "react";
import { HistoricalData } from "@/types/portfolio.types";

interface LineChartProps {
  data: HistoricalData[];
  height?: number;
  color?: string;
  strokeWidth?: number;
  showGrid?: boolean;
  showDots?: boolean;
  showTooltip?: boolean;
  className?: string;
}

interface TooltipData {
  x: number;
  y: number;
  value: number;
  timestamp: number;
}

export function LineChart({
  data,
  height = 200,
  color = "rgb(139, 92, 246)",
  strokeWidth = 2,
  showGrid = true,
  showDots = false,
  showTooltip = true,
  className = "",
}: LineChartProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  // Calculate chart dimensions and scales
  const { path, points, minValue, maxValue, yScale } = useMemo(() => {
    if (!data || data.length === 0) {
      return { path: "", points: [], minValue: 0, maxValue: 0, yScale: [] };
    }

    const values = data.map((d) => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue || 1;

    const padding = 10;
    const chartHeight = height - padding * 2;
    const chartWidth = 100; // Using percentages
    const stepX = chartWidth / (data.length - 1);

    // Generate points
    const points = data.map((d, i) => {
      const x = i * stepX;
      const y =
        padding + (chartHeight - ((d.value - minValue) / range) * chartHeight);
      return { x, y, value: d.value, timestamp: d.timestamp };
    });

    // Generate smooth path using cubic bezier curves
    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const cp1x = p0.x + (p1.x - p0.x) / 3;
      const cp1y = p0.y;
      const cp2x = p0.x + (2 * (p1.x - p0.x)) / 3;
      const cp2y = p1.y;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }

    // Generate Y-axis scale
    const yScale = Array.from({ length: 5 }, (_, i) => {
      const value = minValue + (range * (4 - i)) / 4;
      return {
        value,
        y: padding + (chartHeight * i) / 4,
      };
    });

    return { path, points, minValue, maxValue, yScale };
  }, [data, height]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!showTooltip || points.length === 0) return;

    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;

    // Find nearest point
    const nearest = points.reduce((prev, curr) =>
      Math.abs(curr.x - x) < Math.abs(prev.x - x) ? curr : prev
    );

    setTooltip({
      x: (nearest.x / 100) * rect.width,
      y: nearest.y,
      value: nearest.value,
      timestamp: nearest.timestamp,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  if (!data || data.length === 0) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-800/30 rounded-lg ${className}`}
        style={{ height: `${height}px` }}
      >
        <p className="text-gray-500 text-sm">No data available</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ height: `${height}px` }}>
      <svg
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        className="w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          {/* Glow filter for line */}
          <filter id="lineGlow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines */}
        {showGrid && (
          <g className="opacity-5">
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

        {/* Line */}
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#lineGlow)"
          className="transition-all duration-300"
        />

        {/* Dots */}
        {showDots &&
          points.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="1"
              fill={color}
              className="transition-all duration-200"
            />
          ))}

        {/* Hover indicator */}
        {tooltip && (
          <>
            <line
              x1={(tooltip.x / points[points.length - 1].x) * 100}
              y1="0"
              x2={(tooltip.x / points[points.length - 1].x) * 100}
              y2={height}
              stroke={color}
              strokeWidth="1"
              strokeDasharray="4 4"
              className="opacity-50"
            />
            <circle
              cx={(tooltip.x / points[points.length - 1].x) * 100}
              cy={tooltip.y}
              r="2"
              fill={color}
              stroke="white"
              strokeWidth="1"
            />
          </>
        )}
      </svg>

      {/* Tooltip */}
      {tooltip && showTooltip && (
        <div
          className="absolute bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 shadow-xl pointer-events-none z-10"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y - 60}px`,
            transform: "translateX(-50%)",
          }}
        >
          <p className="text-white font-semibold text-sm">
            $
            {tooltip.value.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-gray-400 text-xs">
            {new Date(tooltip.timestamp).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      )}
    </div>
  );
}
