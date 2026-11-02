# User panel: PHP to React + Fastify

Source: `royalclub.zip`, `apps/www/User/`. Scope is the user panel only. Game pages (`WINGO/`, `k3/`, `aviator/`, ...) and `Admin/` are separate.

## Setup

1. Copy `.env.example` to `.env` at the repo root and fill it in.
2. `pnpm install`, then `pnpm --filter server db:gen`. The Prisma client is generated, not committed.
3. `pnpm dev` runs web on 5173, admin on 5174 and the API on 3000.

`pnpm dev` runs `apps/server/src/index.ts`, which starts the game loops and cron jobs. These write to the database, including payouts, so never point a local `.env` at the live database.

## Going live

- The reverse proxy must send `/api/*` to Fastify with the `/api` prefix removed. Vite only does this in dev.
- Serve the game pages and admin-uploaded files (`/assets/SupportFile/*`, used by home banners) from the PHP app on the same domain. On a different origin, set `VITE_LEGACY_URL`.
- The landing page at `/` is a prebuilt bundle (`apps/web/public/landing.html`, source is not in the zip). Vite serves it at `/` in dev. In production, make `/` serve `landing.html` and everything else fall back to the app's `index.html`. Its Play Now and Sign Up links were patched from the live site to `/login` and `/register`.
- **Stop serving `www/User/*.php` and `get_sponser_name.php`.** They keep the SQL injection and account-takeover bugs listed below.

## How the pages were converted

The target was the same look as the PHP pages, pixel for pixel, so the pages were not redrawn. Each PHP template was compiled to a React component with its original markup, class names and stylesheets, and checked against the running PHP site.

- `apps/web/src/legacy/pages/` holds the generated components and their `<style>` blocks. They come from `User/*.php`, and the original CSS and images are served from `apps/web/public/User/`.
- `apps/web/src/legacy/screens.tsx`, `auth.tsx`, `pay.tsx` and `alpine-pages.tsx` give each page its data (from the Fastify API) and the behaviour its inline scripts had. Every page loads as its own chunk.
- Each page loads its own stylesheets while it is mounted and removes them after (`legacy/use-legacy.tsx`), so pages with different CSS never affect each other. Pages that ran a Preact script in PHP also get the Tailwind build, as they did there.
- Register and bet report keep their rendered HTML and run on Alpine.js, as the originals did.
- The recharge, safe, withdrawal, withdrawal-methods, p2p and wallet-details pages were already Preact + Tailwind in the zip; they were ported to React with their markup unchanged.

The compiler itself is not in the repo. Re-running it would overwrite hand-wired pages, so change the generated files directly from now on.

## Checks run

- Every page was screenshotted at 410x860 against the PHP original (PHP 8.0 with a patched copy of `conection.php`, same database, same login) and compared pixel by pixel.
  - Identical or under 0.1% different: about, settings, activity, vip, account, profile, change-password, wallet, wallet-details, safe, withdrawal, p2p, withdrawal-methods, promotion, first-deposit-bonus, home (0.14%, the admin-uploaded banner), team, team-report, commission, attendance, gift-redeem, bet-report, support, login (0.11%), recharge (0.03%), and all 13 income pages plus direct and wallet statement.
  - Not comparable: new-registrations (the PHP page crashes with an SQL error, `t1.date_time` does not exist), forgot-password and register (the PHP reference renders half-broken in this setup, so these were checked by eye only), and the three payment pages (dynamic QR and countdown differ by 2%).
- `pnpm --filter server smoke` against a throwaway copy of `royalclub.sql` on MariaDB 10.4 (production is 12.3): every panel read route, anonymous access rejected, double claim, claiming another member's bonus, file type checks, and private attachments and orders. The script refuses any database whose name does not end in `_smoke`.
- Not tested: real email delivery, the Faradpay gateway, gift code redemption, P2P transfer and withdrawal submission, and screens other than 410px wide.

## Differences from the PHP pages

Security fixes:

| Area | PHP | Now |
| --- | --- | --- |
| Profile, password, support | Member ID taken from the form, so anyone could change any account | Member ID comes from the login cookie |
| Attendance claim | Any row ID could be claimed, by anyone, and twice if timed | Owner only, and a double claim fails |
| Online order | Any `orderId` could be viewed | Owner only |
| All queries | Values pasted into SQL strings | Prisma or parameterised queries |
| Team page | Query read member passwords | Passwords not selected |
| Support upload | Type taken from the browser, files saved in a web folder | Type checked from the file's bytes, saved outside the web root, served only to the owner |
| Forgot password | Told callers whether a phone was registered | Same reply either way |

Behaviour changes:

- Forgot password sends the OTP by email using the existing OTP service. PHP used SMS with credentials hardcoded in `sendOtpAjax.php`.
- Registering sends you to `/login` afterwards. PHP went to `success.php`, which is not migrated.
- Attendance claims write to `wallet_statements` through `createWalletEntry`. PHP wrote to the old `meddolic_user_wallet_statement`.
- The profile page edits the name only. PHP also overwrote bank and crypto fields the form never sent, blanking them.
- Pages load every row, in pages of 100 from the API, as the PHP pages listed every row.

Bugs kept so the pages match the PHP originals. Fix them separately:

- Wallet statement shows every line as "Credit" in red, because the template compares the stored `DEBIT`/`CREDIT` with lowercase words. Debits are shown as credits.
- The vip page is static: a hardcoded member name and 0 EXP for everyone.
- Home and about show the hardcoded winners list, "odds of winning" numbers and the investor claims (Gala Games, Nakamoto Games, Robinhood, KuCoin) from the PHP pages. The live random "winning information" stream from the PHP script is not carried over, because it invents wins that never happened. The investor claims are unverified; remove them unless they are true.

## Open issues

Existing problems, not fixed in this migration:

- Passwords are stored and compared in plaintext (`auth/login.ts`, and the new change-password route to match). Hashing needs one migration across all of these routes.
- `games/forex-trade/get-price.ts` has a hardcoded API key. Rotate it and move it to `.env`. The game is switched off, but the key will be in git once this is committed.
- OTP checks have no attempt limit, so a 6-digit code can be brute-forced within its 5 minutes. Forgot password makes this an account-takeover path.
- `spin/post-spin.ts` credits whatever `wonAmount` the client sends. It is switched off in `config.ts`; do not enable it as is.
- New support attachments live in `apps/server/uploads/support`, so the PHP admin can't show them, and attachments on older tickets stay in `www/assets/SupportFile`, so the new route can't serve them. Move the old files when the admin panel migrates.

## Count

| Group | Files |
| --- | --- |
| PHP files in `User/` | 61 |
| Backend-only (become API routes or get dropped) | 11 |
| UI pages | 50 |
| UI pages not worth converting | 5 |
| UI pages to convert | 45 |
| Registration page from outside `User/` (`www/register.php`) | +1 |
| **Total React pages to build** | **46** |

Status: `todo`, `done` (React page and API both finished), `skip`.

## UI pages

| # | PHP page | React route | API | Status |
| --- | --- | --- | --- | --- |
| 1 | `login.php` | `/login` | `POST /auth/login`, `/auth/verify-login-otp` (exists) | done |
| 2 | `register.php` (`www/`) | `/register` | `POST /auth/register`, `/auth/send-otp` (exists) | done |
| 3 | `forgot_password.php` | `/forgot-password` | `POST /auth/forgot-password/*` (new) | done |
| 4 | `home.php` | `/home` | `GET /user/home` (new) | done |
| 5 | `account.php` | `/account` | `GET /user/profile` (new) | done |
| 6 | `profile.php` | `/profile` | `GET`, `PATCH /user/profile` (new) | done |
| 7 | `change_password.php` | `/change-password` | `POST /user/change-password` (new) | done |
| 8 | `settings.php` | `/settings` | `GET`, `PUT /user/2fa` (exists) | done |
| 9 | `about.php` | `/about` | none | done |
| 10 | `wallet.php` | `/wallet` | `GET /user/wallet-summary` (new) | done |
| 11 | `wallet-details.php` | `/wallet-details` | `GET /user/wallet-details` (exists) | done |
| 12 | `walletStatement.php` | `/wallet-statement` | `GET /user/statement` (new) | done |
| 13 | `recharge.php` | `/recharge` | `/fund/*` (exists) | done |
| 14 | `pay-online.php` | `/pay-online` | `/fund/*` (exists) | done |
| 15 | `UPIPay.php` | `/upi-pay` | `/fund/*` (exists) | done |
| 16 | `USDTPay.php` | `/usdt-pay` | `/fund/*` (exists) | done |
| 17 | `withdrawal.php` | `/withdrawal` | `/withdrawal/*` (exists) | done |
| 18 | `withdrawal-methods.php` | `/withdrawal-methods` | `/withdrawal-methods/*` (exists) | done |
| 19 | `safe.php` | `/safe` | `/safe/*` (exists) | done |
| 20 | `p2p.php` | `/p2p` | `/fund/transfer` (exists) | done |
| 21 | `gift-redeem.php` | `/gift-redeem` | `/gift-codes/*` (exists) | done |
| 22 | `promotion.php` | `/promotion` | `GET /user/promotion` (new) | done |
| 23 | `team.php` | `/team` | `GET /user/team` (new) | done |
| 24 | `direct.php` | `/direct` | `GET /user/direct` (new) | done |
| 25 | `new_registration.php` | `/new-registrations` | `GET /user/new-registrations` (new) | done |
| 26 | `TeamReport.php` | `/team-report` | `GET /user/subordinate-data` (exists) | done |
| 27 | `viewCommission.php` | `/commission` | `GET /income/commission-summary` (new) | done |
| 28 | `vip.php` | `/vip` | `GET /user/vip` (new) | done |
| 29 | `activity.php` | `/activity` | none | done |
| 30 | `attendance.php` | `/attendance` | `GET /attendance`, `POST /attendance/:id/claim` (new) | done |
| 31 | `first-deposit-bonus.php` | `/first-deposit-bonus` | `GET /user/first-deposit-bonus` (new) | done |
| 32 | `support.php` | `/support` | `/support/*` (new) | done |
| 33 | `bet_report.php` | `/bet-report` | game bet-history routes (exists) | done |
| 34 | `daily_rebate.php` | `/income/daily-rebate` | `GET /income/:type` (new) | done |
| 35 | `daily_Recharge.php` | `/income/daily-recharge` | `GET /income/:type` (new) | done |
| 36 | `daily_fund_roi.php` | `/income/daily-fund-roi` | `GET /income/:type` (new) | done |
| 37 | `depositBonus.php` | `/income/deposit-bonus` | `GET /income/:type` (new) | done |
| 38 | `depositBonus1_2.php` | `/income/deposit-bonus-1-2` | `GET /income/:type` (new) | done |
| 39 | `depositBonus3_4_5.php` | `/income/deposit-bonus-3-4-5` | `GET /income/:type` (new) | done |
| 40 | `usdDepositBonus.php` | `/income/usd-deposit-bonus` | `GET /income/:type` (new) | done |
| 41 | `level_income.php` | `/income/level` | `GET /income/:type` (new) | done |
| 42 | `referral_bonus.php` | `/income/referral` | `GET /income/:type` (new) | done |
| 43 | `referralLevel_bonus.php` | `/income/referral-level` | `GET /income/:type` (new) | done |
| 44 | `rescue_bonus.php` | `/income/rescue` | `GET /income/:type` (new) | done |
| 45 | `salary_income.php` | `/income/salary` | `GET /income/:type` (new) | done |
| 46 | `winning_streak_income.php` | `/income/winning-streak` | `GET /income/:type` (new) | done |

## Skipped UI pages

| PHP page | Reason |
| --- | --- |
| `gift-redeem copy.php` | Backup copy of `gift-redeem.php` |
| `coming-soon.php` | Placeholder |
| `spin.php` | Dead: no page links to it, and its six AJAX helpers are missing from the zip |
| `spinn.php` | Dead: no page links to it, and the lottery spin game is switched off in `apps/server/src/index.ts` |
| `bet_income.php` | Dead: reads `meddolic_user_game_bet_details`, which is not in `royalclub.sql` or the Prisma schema |

## Backend-only PHP files

| PHP file | Replaced by |
| --- | --- |
| `loginCheck.php`, `authSignDash.php` | `authenticate` middleware |
| `changePassBack.php` | `POST /user/change-password` |
| `forgotPasswordBack.php`, `sendOtpAjax.php` | `POST /auth/forgot-password/*` |
| `updateProfileBack.php` | `PATCH /user/profile` |
| `claimAttendenceBack.php`, `userIncomeFunction.php` | `POST /attendance/:id/claim` |
| `SupportProcess.php` | `POST /support/tickets` |
| `get_attendance_sum.php` | Dropped: debug script with a hardcoded member ID |
| `setSessionAdvice.php` | Dropped: old session flow, login now uses a JWT cookie |
