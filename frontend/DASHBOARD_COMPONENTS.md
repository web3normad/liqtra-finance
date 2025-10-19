# Dashboard Components Documentation

## Overview

Complete dashboard component implementation for Liqtra Finance DeFi platform with modern UI/UX inspired by the dashboard.webp design reference.

## Created Components

### 📊 Stats Overview (`components/dashboard/StatsOverview.tsx`)

Displays key portfolio metrics in a 4-card grid:

- Total Portfolio Value with trend indicator
- Total Earnings with percentage change
- Active Positions count
- Average APY across all positions

**Features:**

- Responsive grid layout (1/2/4 columns)
- Animated trend indicators
- Icon-based visual hierarchy
- Color-coded categories

### 🎯 Quick Actions (`components/dashboard/QuickActions.tsx`)

Six quick-access action buttons for common operations:

- Deposit Funds (gradient highlight)
- Swap Tokens
- Withdraw
- AI Optimize (gradient highlight)
- Automate
- Analytics

**Features:**

- Hover scale animations
- Icon + description layout
- Gradient variants for featured actions
- Callback props for all actions

### 💼 Active Positions (`components/dashboard/ActivePositions.tsx`)

Grid of current staking positions with detailed information.

**Features:**

- 3-column responsive grid (1/2/3)
- Empty state handling
- Position count display

### 📈 Position Card (`components/dashboard/PositionCard.tsx`)

Individual position display with comprehensive data:

- Protocol name & logo
- Chain indicator (badge)
- Status badges (Active/Pending/Unstaking)
- Risk level badges
- Staked amount & current value
- APY with trend arrow
- Earned rewards in token & USD
- Auto-compound indicator
- Actions menu

**Features:**

- Hover effects
- Multi-badge support
- Image optimization with Next.js Image
- Number formatting utilities
- Color-coded risk levels

### 🌟 Top Yield Cards (`components/dashboard/TopYieldCards.tsx`)

Showcases highest APY opportunities across protocols.

**Features:**

- Configurable display limit
- Empty state handling
- "View All" navigation

### 💎 Yield Card (`components/dashboard/YieldCard.tsx`)

Individual yield opportunity with staking details:

- Protocol & chain info
- Featured/Trending indicators
- Large APY display with gradient background
- APY breakdown (base/rewards/trading fees)
- Token info with logo
- TVL (Total Value Locked)
- Risk assessment badge
- "Stake Now" CTA button

**Features:**

- Gradient APY highlight section
- Hover group animations
- TVL formatting (K/M/B)
- Color-coded risk levels
- Interactive stake button

## 📁 Supporting Components

### Trend Indicator (`components/charts/TrendIndicator.tsx`)

Reusable component for displaying percentage changes:

- Up/down arrows
- Color-coded (green/red)
- Configurable size (sm/md/lg)
- Show/hide icon or value

### Card (`components/common/Card.tsx`)

Base card component with variants:

- Default: solid background
- Glass: glassmorphism effect
- Gradient: purple/blue gradient

### Badge (`components/common/Badge.tsx`)

Status/category indicators:

- Variants: default, success, danger, warning, purple, blue
- Sizes: sm, md, lg

## 🎨 Type Definitions

### Protocol Types (`types/protocol.types.ts`)

- `Protocol`: Protocol metadata
- `StakingPool`: Pool configuration
- `Token`: Token information
- `Chain`: Blockchain data
- `YieldOpportunity`: Combined yield data

### Portfolio Types (`types/portfolio.types.ts`)

- `Portfolio`: Overall portfolio state
- `Position`: Individual staking position
- `PortfolioMetrics`: Performance metrics
- `AllocationData`: Asset distribution
- `HistoricalData`: Time-series data

## 📄 Main Dashboard Page

### `app/(dashboard)/page.tsx`

Complete dashboard implementation with:

- Stats overview with calculated metrics
- Quick actions grid
- Active positions list (3 mock positions)
- Top yield opportunities (4 mock protocols)
- AI recommendation card

**Mock Data Included:**

- 3 active positions (Lido, Rocket Pool, Aave)
- 4 yield opportunities (different protocols and chains)
- Calculated stats from position data

## 🎨 Design System

### Colors

```javascript
background: '#1a1d2e'
card: '#252837'
primary-purple: '#b794f6'
primary-blue: '#667eea'
success: '#48bb78'
danger: '#f56565'
warning: '#ed8936'
```

### Fonts

- Primary: Plus Jakarta Sans
- Alternative: Inter

### Effects

- Glass: backdrop-blur with transparency
- Gradient text: purple to blue
- Glow: purple/blue shadows
- Hover: scale transforms and border highlights

## 🖼️ Icons & Assets

Created placeholder SVG icons for:

- **Protocols:** Lido, Rocket Pool, Aave, Uniswap
- **Chains:** Ethereum, Polygon
- **Tokens:** ETH, USDC

All icons use brand-appropriate colors and simple geometric designs.

## 🚀 Usage Example

```tsx
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { ActivePositions } from "@/components/dashboard/ActivePositions";
import { TopYieldCards } from "@/components/dashboard/TopYieldCards";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <StatsOverview
        totalValue={35749.25}
        totalChange={3.45}
        totalEarnings={752.9}
        earningsChange={12.5}
        activePositions={3}
        avgApy={4.5}
      />

      <ActivePositions positions={positions} />

      <TopYieldCards opportunities={opportunities} maxDisplay={6} />
    </div>
  );
}
```

## 🔄 Next Steps

### Replace Mock Data

1. Create API hooks in `hooks/` folder:

   - `usePortfolio()` - fetch user positions
   - `useYieldData()` - fetch yield opportunities
   - `useProtocolData()` - fetch protocol info

2. Connect to real blockchain data:
   - Use wagmi hooks for wallet connection
   - Fetch on-chain position data
   - Query protocol APIs for APY data

### Add Interactions

1. Position actions (compound, withdraw, manage)
2. Stake flow from yield cards
3. AI optimization modal
4. Real-time data updates with WebSocket
5. Filtering and sorting

### Enhanced Features

1. Portfolio charts (line, donut, area)
2. Transaction history
3. Notification system
4. Advanced analytics
5. Multi-wallet support

## 📱 Responsive Design

All components are fully responsive:

- **Mobile (< 768px):** Single column, mobile nav
- **Tablet (768px - 1024px):** 2-column grids
- **Desktop (> 1024px):** Full layout with sidebar, 3-4 column grids

## 🎯 Performance Considerations

- Next.js Image optimization for all logos
- Lazy loading for position lists
- Memoized calculations
- Optimistic UI updates
- Skeleton loading states (available in common components)

## 🔧 Configuration

All components accept optional className props for customization.
Colors and styles follow Tailwind theme in `tailwind.config.js`.

---

Built with Next.js 15, React 19, TypeScript, and Tailwind CSS.
