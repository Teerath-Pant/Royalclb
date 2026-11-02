/* Generated from User/include/footer.php (bottom tab bar). */
import { go } from "./php";

const ITEMS = [
  {
    id: "promotion_link",
    label: "Promotion",
    href: "/promotion",
    matches: ["promotion.php", "referral_bonus.php", "referralLevel_bonus.php", "team.php", "direct.php"],
    center: false,
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01" />
      </svg>
    ),
  },
  {
    id: "activity_link",
    label: "Activity",
    href: "/activity",
    matches: ["activity.php", "attendance.php", "daily_Recharge.php", "rescue_bonus.php", "winning_streak_income.php"],
    center: false,
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: "home_link",
    label: "Home",
    href: "/home",
    matches: ["home.php", "index.php"],
    center: true,
    svg: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" ry="2" />
        <path d="M6 12h4M8 10v4M15 13h.01M18 11h.01" />
      </svg>
    ),
  },
  {
    id: "wallet_link",
    label: "Wallet",
    href: "/wallet",
    matches: ["wallet.php", "wallet2.php", "walletStatement.php", "wallet-details.php", "recharge.php", "withdrawal.php"],
    center: false,
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2" />
        <path d="M22 12h-4a2 2 0 0 1-2-2v0a2 2 0 0 1 2-2h4" />
        <path d="M22 16h-4a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h4" />
      </svg>
    ),
  },
  {
    id: "account_link",
    label: "Account",
    href: "/account",
    matches: ["account.php", "profile.php", "settings.php", "change_password.php"],
    center: false,
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

/** `current` is the PHP file name of the page, e.g. "home.php", which decides the active tab. */
export function LegacyFooter({ current }: { current: string }) {
  return (
    <nav className="custom-bottom-nav" aria-label="Bottom Navigation">
      {ITEMS.map((item) => {
        const active = item.matches.includes(current);
        const classes = ["nav-item", active ? "active" : "", item.center ? "home-center" : ""].filter(Boolean).join(" ");
        return (
          <a
            key={item.id}
            href={active ? "#" : item.href}
            id={item.id}
            className={classes}
            aria-current={active ? "page" : undefined}
            aria-disabled={active ? "true" : undefined}
            onClick={(e) => {
              e.preventDefault();
              if (!active) {
                go(item.href);
              }
            }}
            style={{ textDecoration: "none" }}
          >
            {item.center ? <div className="icon-bg">{item.svg}</div> : item.svg}
            <span>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
