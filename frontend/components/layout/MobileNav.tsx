"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SquaresFour, Wallet, TrendUp, GearSix } from "@phosphor-icons/react";

const mobileNavItems = [
  { name: "Dashboard", href: "/", icon: SquaresFour },
  { name: "Assets", href: "/assets", icon: Wallet },
  { name: "Staking", href: "/active-staking", icon: TrendUp },
  { name: "Settings", href: "/settings", icon: GearSix },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-gray-800 px-4 py-3 z-50 lg:hidden">
      <div className="flex items-center justify-around">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex flex-col items-center space-y-1 px-4 py-2 rounded-md
                transition-all duration-200
                ${isActive ? "text-primary-green" : "text-gray-400"}
              `}
            >
              <Icon size={24} weight={isActive ? "fill" : "regular"} />
              <span className="text-xs font-medium">{item.name}</span>

              {isActive && (
                <span className="w-1 h-1 bg-primary-green rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
