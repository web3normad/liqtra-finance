# 🗺️ Application Routing Structure

## Route Structure

The application uses Next.js 15 App Router with route groups for clean organization.

### Root Layout

```
app/
├── layout.tsx          # Root layout (providers, fonts)
├── providers.tsx       # Wagmi & React Query providers
└── globals.css         # Global styles
```

### Dashboard Routes (Route Group)

The `(dashboard)` folder is a **route group** - the parentheses mean it doesn't add a URL segment.

```
app/(dashboard)/
├── layout.tsx          # Dashboard layout (sidebar, header)
└── page.tsx            # Dashboard home → serves "/"
```

**All dashboard pages:**

| Route             | File                                  | Description                           |
| ----------------- | ------------------------------------- | ------------------------------------- |
| `/`               | `(dashboard)/page.tsx`                | Dashboard home with stats & positions |
| `/assets`         | `(dashboard)/assets/page.tsx`         | Asset management & portfolio          |
| `/portfolio`      | `(dashboard)/portfolio/page.tsx`      | Portfolio analytics & charts          |
| `/active-staking` | `(dashboard)/active-staking/page.tsx` | Active staking positions              |
| `/liquid-staking` | `(dashboard)/liquid-staking/page.tsx` | Liquid staking options                |
| `/providers`      | `(dashboard)/providers/page.tsx`      | Staking provider comparison           |
| `/strategies`     | `(dashboard)/strategies/page.tsx`     | AI-powered strategies                 |
| `/calculator`     | `(dashboard)/calculator/page.tsx`     | Staking rewards calculator            |
| `/charts`         | `(dashboard)/charts/page.tsx`         | Chart component examples              |
| `/settings`       | `(dashboard)/settings/page.tsx`       | User settings & preferences           |

### API Routes

```
app/api/
├── ai/              # AI agent endpoints
├── portfolio/       # Portfolio data
├── protocols/       # Protocol information
└── transactions/    # Transaction history
```

## Understanding Route Groups

### Why `(dashboard)` and not just `dashboard`?

**Without route group:**

```
app/dashboard/page.tsx → /dashboard
app/dashboard/assets/page.tsx → /dashboard/assets
```

**With route group:**

```
app/(dashboard)/page.tsx → /
app/(dashboard)/assets/page.tsx → /assets
```

### Benefits

1. **Clean URLs**: No `/dashboard` prefix
2. **Shared Layout**: All pages use DashboardLayout
3. **Organization**: Grouped related pages
4. **No URL Impact**: Parentheses = no URL segment

## Layout Hierarchy

```
RootLayout (app/layout.tsx)
├── Providers (Wagmi, React Query)
├── Fonts (Plus Jakarta Sans, Inter)
└── DashboardLayout (app/(dashboard)/layout.tsx)
    ├── Sidebar
    ├── Header
    ├── MobileNav
    └── Page Content
```

## Navigation Structure

### Sidebar Navigation

```tsx
const navItems = [
  { name: "Dashboard", href: "/", icon: SquaresFour },
  { name: "Assets", href: "/assets", icon: Wallet },
  { name: "Staking Providers", href: "/providers", icon: Users },
  { name: "Staking Calculator", href: "/calculator", icon: Calculator },
  { name: "Liquid Staking", href: "/liquid-staking", icon: Lightning },
  { name: "Active Staking", href: "/active-staking", icon: TrendUp },
];
```

### Mobile Navigation

```tsx
const mobileNavItems = [
  { name: "Dashboard", href: "/", icon: SquaresFour },
  { name: "Assets", href: "/assets", icon: Wallet },
  { name: "Staking", href: "/active-staking", icon: TrendUp },
  { name: "Settings", href: "/settings", icon: GearSix },
];
```

## File Structure

```
app/
├── layout.tsx                    # Root layout
├── providers.tsx                 # Client providers
├── globals.css                   # Global styles
│
├── (dashboard)/                  # Route group (no URL segment)
│   ├── layout.tsx               # Dashboard layout
│   ├── page.tsx                 # Home (/)
│   ├── assets/page.tsx          # /assets
│   ├── portfolio/page.tsx       # /portfolio
│   ├── active-staking/page.tsx  # /active-staking
│   ├── liquid-staking/page.tsx  # /liquid-staking
│   ├── providers/page.tsx       # /providers
│   ├── strategies/page.tsx      # /strategies
│   ├── calculator/page.tsx      # /calculator
│   ├── charts/page.tsx          # /charts
│   └── settings/page.tsx        # /settings
│
└── api/                          # API routes
    ├── ai/
    ├── portfolio/
    ├── protocols/
    └── transactions/
```

## Dynamic Routes (Future)

When you need dynamic routes, add them like this:

```
app/(dashboard)/
├── positions/[id]/page.tsx      # /positions/:id
├── protocols/[slug]/page.tsx    # /protocols/:slug
└── strategies/[id]/page.tsx     # /strategies/:id
```

## Route Organization Best Practices

### ✅ Current Structure (Good)

- Clean URLs without prefixes
- Shared layout via route group
- Organized by feature
- Easy to navigate

### ❌ Alternative (Not Used)

```
app/
├── dashboard/
│   └── page.tsx                 # Would be /dashboard
└── assets/page.tsx              # Would be /assets (no shared layout)
```

## Testing Routes

Run the dev server and test each route:

```bash
npm run dev
```

Visit:

- http://localhost:3000 (Dashboard home)
- http://localhost:3000/assets
- http://localhost:3000/portfolio
- http://localhost:3000/active-staking
- http://localhost:3000/calculator
- http://localhost:3000/settings

All routes should:

1. ✅ Show sidebar navigation
2. ✅ Show header with search and wallet
3. ✅ Highlight active nav item
4. ✅ Be responsive (mobile nav on small screens)

## Adding New Pages

To add a new dashboard page:

1. Create file in `app/(dashboard)/your-page/page.tsx`
2. Add navigation item to `components/layout/Sidebar.tsx`
3. Add to mobile nav in `components/layout/MobileNav.tsx`
4. Page will automatically use DashboardLayout

Example:

```tsx
// app/(dashboard)/analytics/page.tsx
"use client";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Analytics</h1>
      {/* Your content */}
    </div>
  );
}
```

The route will be available at `/analytics` automatically!

## Summary

✅ **Root path (`/`)** → `app/(dashboard)/page.tsx` (Dashboard home)
✅ **All dashboard pages** → Use shared DashboardLayout
✅ **Clean URLs** → No `/dashboard` prefix needed
✅ **Organized** → Related pages grouped together
✅ **Scalable** → Easy to add new pages

The route group pattern keeps URLs clean while maintaining organized code structure!
