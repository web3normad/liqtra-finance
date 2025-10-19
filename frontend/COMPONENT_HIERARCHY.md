# Component Structure

## Dashboard Page Hierarchy

```
app/(dashboard)/page.tsx
├── StatsOverview
│   └── StatCard (x4)
│       ├── Icon (Wallet, TrendUp, Coins, ChartLineUp)
│       ├── Title
│       ├── Value
│       └── TrendIndicator
│
├── QuickActions
│   └── QuickActionButton (x6)
│       ├── Icon
│       ├── Title
│       └── Description
│
├── ActivePositions
│   └── PositionCard (x3)
│       ├── Protocol Header
│       │   ├── Logo + Chain Badge
│       │   └── Actions Menu
│       ├── Status Badges
│       │   ├── Active/Pending/Unstaking
│       │   ├── Risk Level
│       │   └── Auto-compound
│       ├── Amount & Value Grid
│       └── APY & Earnings Grid
│
├── TopYieldCards
│   └── YieldCard (x4)
│       ├── Protocol Header
│       │   ├── Logo + Chain Badge
│       │   └── Trending/Featured Icons
│       ├── APY Section (Gradient Box)
│       │   ├── Large APY Display
│       │   └── APY Breakdown
│       ├── Token & TVL Grid
│       └── Risk Badge + Stake Button
│
└── AI Recommendation Card
    ├── AI Icon
    ├── Recommendation Text
    └── Action Buttons
```

## Key Features by Component

### StatsOverview

- 4 key metrics in responsive grid
- Real-time trend indicators
- Icon-based visual categories
- Currency formatting

### QuickActions

- 6 common operations
- Gradient highlights for primary actions
- Hover scale animations
- Callback-based interactions

### PositionCard

- Complete position details
- Multi-badge status system
- Formatted numbers and currency
- Chain indicator overlay
- Hover effects

### YieldCard

- Prominent APY display
- APY breakdown details
- Risk assessment
- Trending indicators
- Interactive stake button

## Data Flow

```
Mock Data (page.tsx)
    ↓
Component Props
    ↓
Formatting Utilities
    ↓
Rendered UI
```

### Future Data Flow (with API)

```
API/Blockchain
    ↓
Custom Hooks (usePortfolio, useYieldData)
    ↓
Component Props
    ↓
Formatted Display
```

## Styling Patterns

All components use consistent patterns:

1. **Card Wrapper**: `<Card>` component with variants
2. **Grid Layouts**: Tailwind responsive grids
3. **Icon Colors**: Semantic (purple/blue for primary, green for success)
4. **Hover States**: Border color + shadow changes
5. **Text Hierarchy**:
   - Titles: `text-white font-semibold`
   - Values: `text-white font-bold text-2xl/3xl`
   - Labels: `text-gray-400 text-sm/xs`

## Responsive Breakpoints

- **Mobile** (<768px): 1 column, compact spacing
- **Tablet** (768-1024px): 2 columns
- **Desktop** (>1024px): 3-4 columns, full sidebar

## Color Semantics

- **Purple** (`#b794f6`): Primary actions, highlights
- **Blue** (`#667eea`): Secondary actions, info
- **Green** (`#48bb78`): Success, positive trends, earnings
- **Red** (`#f56565`): Danger, negative trends, high risk
- **Yellow** (`#ed8936`): Warning, medium risk, features
- **Gray**: Background, borders, secondary text
