# ValueOverTime Component

A comprehensive portfolio value tracking component with interactive time-range selection and data visualization.

## Features

- 📊 **Interactive Chart**: Smooth SVG-based area chart with gradient fills
- ⏰ **Multiple Time Ranges**: 24H, 7D, 1M, 3M, 1Y, ALL
- 📈 **Real-time Stats**: Shows current value, change, high/low, and averages
- 💾 **Data Export**: Export portfolio data as CSV
- 🎨 **Customizable**: Props for colors, height, and styling
- 📱 **Responsive**: Works on all screen sizes

## Usage

### Basic Usage

\`\`\`tsx
import { ValueOverTime } from '@/components/portfolio/ValueOverTime'

export default function PortfolioPage() {
return (
<div>
<ValueOverTime />
</div>
)
}
\`\`\`

### With Custom Data

\`\`\`tsx
import { ValueOverTime } from '@/components/portfolio/ValueOverTime'
import { HistoricalData } from '@/types/portfolio.types'

export default function PortfolioPage() {
const historicalData: HistoricalData[] = [
{ timestamp: 1234567890000, value: 20000, earnings: 20 },
{ timestamp: 1234571490000, value: 21500, earnings: 35 },
// ... more data points
]

return (
<ValueOverTime
      data={historicalData}
      currentValue={24567.89}
      previousValue={21832.45}
      className="mb-6"
    />
)
}
\`\`\`

### With API Data

\`\`\`tsx
'use client'

import { useState, useEffect } from 'react'
import { ValueOverTime } from '@/components/portfolio/ValueOverTime'
import { HistoricalData } from '@/types/portfolio.types'

export default function PortfolioPage() {
const [data, setData] = useState<HistoricalData[]>([])
const [loading, setLoading] = useState(true)

useEffect(() => {
async function fetchData() {
try {
const response = await fetch('/api/portfolio/history?range=7D')
const result = await response.json()
setData(result.data)
} catch (error) {
console.error('Failed to fetch portfolio data:', error)
} finally {
setLoading(false)
}
}
fetchData()
}, [])

if (loading) {
return <div>Loading...</div>
}

return (
<ValueOverTime
      data={data}
      currentValue={24567.89}
      previousValue={21832.45}
    />
)
}
\`\`\`

## Props

| Prop              | Type                 | Default      | Description                            |
| ----------------- | -------------------- | ------------ | -------------------------------------- |
| \`data\`          | \`HistoricalData[]\` | Mock data    | Array of historical value data points  |
| \`currentValue\`  | \`number\`           | \`24567.89\` | Current portfolio value                |
| \`previousValue\` | \`number\`           | \`21832.45\` | Previous period's value for comparison |
| \`className\`     | \`string\`           | \`''\`       | Additional CSS classes                 |

## HistoricalData Type

\`\`\`typescript
interface HistoricalData {
timestamp: number // Unix timestamp in milliseconds
value: number // Portfolio value at that time
earnings?: number // Optional: Total earnings at that time
}
\`\`\`

## Component Structure

### ValueOverTime

The main component that orchestrates the entire value tracking interface.

**Includes:**

- Time range selector (24H, 7D, 1M, 3M, 1Y, ALL)
- Current value and change display
- Export functionality
- Footer statistics (High, Low, Average, Data Points)

### AreaChart

A reusable SVG-based area chart component with:

- Gradient fill
- Smooth rendering
- Grid lines
- Y-axis labels
- Hover effects

## Styling

The component uses Tailwind CSS and supports dark mode by default. It follows the project's design system with:

- **Primary Color**: Purple (`#8B5CF6`)
- **Success Color**: Green (for positive changes)
- **Danger Color**: Red (for negative changes)
- **Background**: Dark card with subtle borders

## Time Range Options

- **24H**: Last 24 hours (hourly data points)
- **7D**: Last 7 days (hourly data points)
- **1M**: Last 30 days (daily data points)
- **3M**: Last 90 days (daily data points)
- **1Y**: Last 365 days (daily data points)
- **ALL**: All available historical data

## Export Functionality

The export button generates a CSV file with:

- Date column (ISO 8601 format)
- Value column (portfolio value)

Example output:
\`\`\`csv
Date,Value
2024-10-16T10:00:00.000Z,24567.89
2024-10-16T11:00:00.000Z,24623.45
...
\`\`\`

## Integration Example

Here's a complete example showing integration with other portfolio components:

\`\`\`tsx
'use client'

import { ValueOverTime } from '@/components/portfolio/ValueOverTime'
import { PortfolioSummary } from '@/components/portfolio/PortfolioSummary'
import { AllocationChart } from '@/components/portfolio/AllocationChart'
import { AssetList } from '@/components/portfolio/AssetList'

export default function PortfolioPage() {
return (
<div className="space-y-6">
{/_ Summary Cards _/}
<PortfolioSummary />

      {/* Value Over Time Chart */}
      <ValueOverTime />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AllocationChart />
        <AssetList />
      </div>
    </div>

)
}
\`\`\`

## Performance Considerations

- The component uses \`useMemo\` to optimize chart calculations
- SVG rendering is efficient for up to ~1000 data points
- For larger datasets, consider:
  - Downsampling data on the backend
  - Using time-based aggregation
  - Implementing virtual scrolling for data points

## Accessibility

- Interactive elements have proper focus states
- Color changes are supplemented with +/- symbols
- Export functionality works with keyboard navigation

## Future Enhancements

Potential improvements:

- [ ] Add zoom and pan functionality
- [ ] Multiple series comparison (earnings vs value)
- [ ] Customizable chart types (area, line, candlestick)
- [ ] Real-time WebSocket updates
- [ ] Annotations for significant events
- [ ] Compare multiple portfolios

## Related Components

- \`AreaChart\`: The chart rendering component
- \`LineChart\`: Alternative line-only visualization
- \`TrendIndicator\`: Shows percentage changes with color
- \`Card\`: Layout wrapper component
