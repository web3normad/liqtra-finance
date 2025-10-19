'use client'

import { Card } from '@/components/common/Card'
import { Tabs } from '@/components/common/Tabs'
import { TrendUp } from '@phosphor-icons/react'
import { Badge } from '@/components/common/Badge'

const timeframes = [
  { label: '24H', value: '24h' },
  { label: '7D', value: '7d' },
  { label: '1M', value: '1m' },
  { label: '1Y', value: '1y' },
  { label: 'All', value: 'all' }
]

// Mock data points
const generateDataPoints = () => {
  const points = []
  for (let i = 0; i < 30; i++) {
    points.push({
      x: i,
      y: 20000 + Math.random() * 5000 + i * 100
    })
  }
  return points
}

export function PerformanceGraph() {
  const dataPoints = generateDataPoints()
  const maxValue = Math.max(...dataPoints.map(p => p.y))
  const minValue = Math.min(...dataPoints.map(p => p.y))
  const range = maxValue - minValue

  // Convert data points to SVG path
  const pathData = dataPoints.map((point, idx) => {
    const x = (point.x / (dataPoints.length - 1)) * 100
    const y = 100 - ((point.y - minValue) / range) * 100
    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')

  const currentValue = dataPoints[dataPoints.length - 1].y
  const previousValue = dataPoints[0].y
  const change = currentValue - previousValue
  const changePercent = ((change / previousValue) * 100).toFixed(2)

  return (
    <Card>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Portfolio Value</h3>
            <div className="flex items-center space-x-2">
              <p className="text-3xl font-bold text-white">
                ${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <Badge variant="success" size="sm">
                <span className="flex items-center space-x-1">
                  <TrendUp size={12} weight="bold" />
                  <span>+{changePercent}%</span>
                </span>
              </Badge>
            </div>
          </div>
        </div>

        {/* Timeframe Tabs */}
        <div className="flex items-center space-x-2">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors bg-gray-800 text-gray-400 hover:text-white"
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64 bg-gray-900/50 rounded-md p-4 overflow-hidden">
        {/* Grid Lines */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#b794f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#b794f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={`${y}%`}
              x2="100%"
              y2={`${y}%`}
              stroke="#374151"
              strokeWidth="1"
              strokeDasharray="4"
            />
          ))}

          {/* Area under curve */}
          <path
            d={`${pathData} L 100 100 L 0 100 Z`}
            fill="url(#areaGradient)"
          />

          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="#b794f6"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />

          {/* Data points */}
          {dataPoints.map((point, idx) => {
            const x = (point.x / (dataPoints.length - 1)) * 100
            const y = 100 - ((point.y - minValue) / range) * 100
            return (
              <circle
                key={idx}
                cx={`${x}%`}
                cy={`${y}%`}
                r="3"
                fill="#b794f6"
                className="opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
              />
            )
          })}
        </svg>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-800">
        <div>
          <p className="text-xs text-gray-500 mb-1">Period Gain</p>
          <p className="text-success font-bold">${change.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Highest</p>
          <p className="text-white font-bold">${maxValue.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Lowest</p>
          <p className="text-white font-bold">${minValue.toFixed(2)}</p>
        </div>
      </div>
    </Card>
  )
}