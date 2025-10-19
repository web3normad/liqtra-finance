// components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  SquaresFour,
  Wallet,
  TrendUp,
  Users,
  Calculator,
  GearSix,
  Lightning,
  ChartLineUp,
  Robot,
} from "@phosphor-icons/react";
import { SidebarWalletBalances } from "@/components/wallet/SidebarWalletBalances";

const navItems = [
  { name: "Dashboard", href: "/", icon: SquaresFour },
  { name: "AI Chat", href: "/ai-chat", icon: Robot, badge: "New" },
  { name: "Assets", href: "/assets", icon: Wallet },
  { name: "Staking Providers", href: "/providers", icon: Users },
  { name: "Staking Calculator", href: "/calculator", icon: Calculator },
  { name: "Data API", href: "/api-docs", icon: ChartLineUp, external: true },
  {
    name: "Liquid Staking",
    href: "/liquid-staking",
    icon: Lightning,
    badge: "Beta",
  },
  {
    name: "Active Staking",
    href: "/active-staking",
    icon: TrendUp,
    badge: "6",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-card border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 relative">
            <Image
              src="/logo.svg"
              alt="Liqtra Finance Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-gray-900 dark:text-white font-semibold text-lg">
              Liqtra Finance
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-xs">
              DeFi Portfolio Manager
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-md
                  transition-all duration-200 group relative
                  ${
                    isActive
                      ? "bg-gradient-to-r from-primary-green/20 to-primary-green-light/20 text-primary-green dark:text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50"
                  }
                `}
              >
                <Icon size={20} weight={isActive ? "fill" : "regular"} />
                <span className="font-medium text-sm">{item.name}</span>

                {item.badge && (
                  <span
                    className={`
                    ml-auto text-xs px-2 py-0.5 rounded-full
                    ${
                      item.badge === "Beta"
                        ? "bg-primary-green/20 text-primary-green"
                        : "bg-gray-700 text-gray-300"
                    }
                  `}
                  >
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary-green to-primary-green-light rounded-r-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Wallet Balances */}
      <SidebarWalletBalances />

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-md bg-gradient-to-r from-primary-green to-primary-green-light hover:opacity-90 transition-opacity">
          <Lightning size={20} weight="fill" className="text-white" />
          <span className="text-white font-medium text-sm">Activate Super</span>
        </button>
        <p className="text-xs text-gray-500 text-center mt-2">
          Unlock all features on Floquidity!
        </p>
      </div>

      {/* Settings */}
      <Link
        href="/settings"
        className="p-4 flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors border-t border-gray-200 dark:border-gray-700"
      >
        <GearSix size={20} />
        <span className="font-medium text-sm">Settings</span>
      </Link>
    </aside>
  );
}
