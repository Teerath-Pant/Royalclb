import { Activity, Gamepad2, Tag, User, Wallet } from "lucide-react";
import { Link, useLocation } from "wouter";

import { cn } from "@/utils/cn";

const ITEMS = [
  { label: "Promotion", href: "/promotion", icon: Tag },
  { label: "Activity", href: "/activity", icon: Activity },
  { label: "Home", href: "/home", icon: Gamepad2 },
  { label: "Wallet", href: "/wallet", icon: Wallet },
  { label: "Account", href: "/account", icon: User },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav
      aria-label="Bottom navigation"
      className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-102.5 -translate-x-1/2 justify-around border-t border-border-card bg-bg-header py-2"
    >
      {ITEMS.map(({ label, href, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          aria-current={location === href ? "page" : undefined}
          className={cn(
            "flex flex-col items-center gap-0.5 text-xs",
            location === href ? "text-brand-gold" : "text-text-muted"
          )}
        >
          <Icon className="h-6 w-6" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
