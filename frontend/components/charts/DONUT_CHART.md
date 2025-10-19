# DonutChart Component

A customizable, SVG-based donut chart component for displaying data distribution with legend and center content support.

## Features

- ✨ **Pure SVG**: No external chart libraries required
- 🎨 **Fully Customizable**: Colors, size, thickness, labels
- 📊 **Interactive Legend**: Hover effects and detailed data
- 🎯 **Center Content**: Display custom content in the center
- 📱 **Responsive**: Works on all screen sizes
- 🔧 **TypeScript**: Full type safety

## Usage

### Basic Usage

```tsx
import { DonutChart } from "@/components/charts/DonutChart";

const data = [
  { label: "Ethereum", value: 15000, color: "#3b82f6" },
  { label: "Bitcoin", value: 12000, color: "#f59e0b" },
  { label: "Solana", value: 8000, color: "#8b5cf6" },
];

export function MyChart() {
  return <DonutChart data={data} />;
}
```

### With Center Content

```tsx
<DonutChart
  data={data}
  size={250}
  thickness={20}
  centerContent={
    <div className="text-center">
      <p className="text-3xl font-bold text-white">$35K</p>
      <p className="text-xs text-gray-400">Total</p>
    </div>
  }
/>
```

### Simple Donut (No Legend)

```tsx
import { SimpleDonutChart } from "@/components/charts/DonutChart";

<SimpleDonutChart
  data={data}
  size={150}
  thickness={15}
  centerContent={<span className="text-white text-2xl">100%</span>}
/>;
```

### With Labels on Segments

```tsx
<DonutChart data={data} showLabels={true} showLegend={true} />
```

## Props

### DonutChart Props

| Prop            | Type               | Default      | Description                        |
| --------------- | ------------------ | ------------ | ---------------------------------- |
| `data`          | `DonutChartData[]` | **required** | Array of data points               |
| `size`          | `number`           | `200`        | Chart size in pixels               |
| `thickness`     | `number`           | `15`         | Donut thickness                    |
| `showLabels`    | `boolean`          | `false`      | Show percentage labels on segments |
| `showLegend`    | `boolean`          | `true`       | Show legend below chart            |
| `centerContent` | `ReactNode`        | `undefined`  | Content to display in center       |
| `className`     | `string`           | `''`         | Additional CSS classes             |

### DonutChartData Interface

```typescript
interface DonutChartData {
  label: string; // Display name
  value: number; // Numeric value
  color: string; // Hex color (#rgb or rgb())
  percentage?: number; // Auto-calculated if not provided
}
```

## Examples

### Portfolio Allocation

```tsx
const allocations = [
  { label: 'Aave', value: 8600, color: '#a855f7' },
  { label: 'Compound', value: 6150, color: '#3b82f6' },
  { label: 'Lido', value: 4900, color: '#22c55e' },
  { label: 'Uniswap', value: 3680, color: '#ec4899' },
]

<DonutChart
  data={allocations}
  size={220}
  thickness={18}
  centerContent={
    <div className="text-center">
      <p className="text-2xl font-bold text-white">$24.3K</p>
      <p className="text-xs text-gray-400">Total</p>
    </div>
  }
/>
```

### Risk Distribution

```tsx
const riskData = [
  { label: 'Low Risk', value: 60, color: '#22c55e' },
  { label: 'Medium Risk', value: 30, color: '#f59e0b' },
  { label: 'High Risk', value: 10, color: '#ef4444' },
]

<DonutChart
  data={riskData}
  size={180}
  thickness={20}
  showLabels={true}
  centerContent={
    <div className="text-center">
      <p className="text-lg font-bold text-white">Risk</p>
      <p className="text-xs text-gray-400">Profile</p>
    </div>
  }
/>
```

### Chain Distribution

```tsx
const chains = [
  { label: 'Ethereum', value: 45000, color: '#627eea' },
  { label: 'Polygon', value: 25000, color: '#8247e5' },
  { label: 'Arbitrum', value: 15000, color: '#28a0f0' },
  { label: 'Optimism', value: 10000, color: '#ff0420' },
]

<DonutChart data={chains} />
```

## Integration with AllocationChart

The `AllocationChart` component now uses `DonutChart`:

```tsx
"use client";

import { Card } from "@/components/common/Card";
import { DonutChart } from "@/components/charts/DonutChart";

export function AllocationChart() {
  const allocations = [
    { label: "Aave", value: 8600, color: "#a855f7" },
    { label: "Compound", value: 6150, color: "#3b82f6" },
    { label: "Lido", value: 4900, color: "#22c55e" },
  ];

  const totalValue = allocations.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <h3 className="text-lg font-bold text-white mb-6">
        Portfolio Allocation
      </h3>
      <DonutChart
        data={allocations}
        size={220}
        thickness={18}
        centerContent={
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              ${(totalValue / 1000).toFixed(1)}K
            </p>
            <p className="text-xs text-gray-400">Total Value</p>
          </div>
        }
      />
    </Card>
  );
}
```

## Styling

The component uses Tailwind CSS classes and can be customized:

```tsx
<DonutChart data={data} className="my-custom-class" />
```

Legend items have hover effects:

- `hover:bg-gray-800/50` - Background change on hover
- `transition-colors` - Smooth transitions

Chart segments:

- `hover:opacity-80` - Slight transparency on hover
- `cursor-pointer` - Pointer cursor

## Performance

- Uses `useMemo` for expensive calculations
- SVG rendering is efficient for up to 20-30 segments
- Percentages are auto-calculated from values
- Smooth animations via CSS transitions

## Accessibility

- Semantic HTML structure
- Color-coded with text labels
- Hover states for interactivity
- Screen reader friendly legend

## Advanced Usage

### Dynamic Data

```tsx
"use client";

import { useState, useEffect } from "react";
import { DonutChart } from "@/components/charts/DonutChart";

export function DynamicChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch from API
    fetch("/api/allocations")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return <DonutChart data={data} />;
}
```

### Conditional Rendering

```tsx
<DonutChart
  data={allocations}
  showLegend={allocations.length < 10}
  showLabels={allocations.length < 6}
/>
```

## Color Palettes

Recommended color schemes:

```tsx
// Purple/Blue Gradient
const purpleBlue = ["#8b5cf6", "#6366f1", "#3b82f6", "#0ea5e9"];

// Rainbow
const rainbow = ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#8b5cf6"];

// Monochrome
const monochrome = ["#ffffff", "#d1d5db", "#9ca3af", "#6b7280", "#374151"];

// DeFi Protocols
const protocols = {
  aave: "#a855f7",
  compound: "#00d395",
  lido: "#00a3ff",
  uniswap: "#ff007a",
  curve: "#40444f",
};
```

## Related Components

- **AreaChart**: Time-series data visualization
- **LineChart**: Simple line charts
- **AllocationChart**: Portfolio distribution using DonutChart
- **TrendIndicator**: Percentage change display

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

SVG is supported in all modern browsers.
