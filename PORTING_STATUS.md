# Admin panel porting status

Source: `royalclub.zip` → `apps/www/Admin/`. UI in `apps/admin`, API in `apps/server`.
`UI` = React page built, `API` = endpoint ready, `wired` = page uses React Query + API.
API column: `exists` = already in the original Node server (copied as is), `new` = ported from PHP, `todo` = not looked at yet.

## Done

| Module | Pages | API | Status |
| --- | --- | --- | --- |
| Shell | layout, sidebar, topbar, menu | — | UI done (mock-free) |
| Dashboard | `dashboard.php` | `GET /user/admin/dashboard` (new, same 3 SQL queries) | UI + API + wired. **Not run against a DB yet** |
| View Member | `viewMember.php` | `GET /user/admin/members`, `POST /user/admin/members/status` (new); `POST /auth/admin/impersonate` (exists) | UI + API + wired. **Not run against a DB yet** |
| View Member Details | `viewMemberDetails.php`, `personal-details-update.php` | `GET`, `POST /user/admin/members/details` (new) | UI + API + wired. **Not run against a DB yet.** Bank and password tabs are hidden in the original, not ported |
| Search Member | `searchMember.php`, `ajax_calls/search-all-ajax.php` | `GET /user/admin/members/search` (new, Prisma) | UI + API + wired. **Not run against a DB yet.** See differences below |
| Win Go | `winGo.php`, `winGoBets.php` | `GET /win-go/game-history-admin`, `/win-go/bet-history-admin`, `PUT /game-settings/mode` (exist); `GET /game-settings/mode` (new) | UI + API + wired. **Not run against a DB yet** |
| K3 | `gameHistoryK3.php`, `betHistoryK3.php` | `GET /k3/game-history-admin`, `PUT /k3/settings/mode` (exist); `GET /k3/settings/mode`, `GET /k3/bet-history-admin` (new) | UI + API + wired. **Not run against a DB yet** |
| Dragon Tiger | `gameHistoryDT.php`, `betHistoryDT.php` | `GET /dragon-tiger/game-history-admin`, `/dragon-tiger/bet-history-admin`, `/game-settings/mode` (all exist or done earlier) | UI + wired. **Not run against a DB yet** |
| Animal Roulette | `animal.php`, `animalBets.php` | `GET /animal/game-history-admin`, `/animal/bet-history-admin`, `/game-settings/mode` (exist) | UI + wired. **Not run against a DB yet** |
| Aviator | `gameHistoryAviator.php`, `betHistoryAviator.php`, `resetBucket.php` | `GET /aviator/admin/games`, `POST /aviator/admin/reset-bucket`, `GET /aviator/admin/bets` (new, Prisma) | UI + API + wired. **Not run against a DB yet** |
| Fund Request Details | `recharges.php` | `GET`, `POST /fund/recharge-admin` (exist) | UI + wired. **Not run against a DB yet** |
| Online Deposit History | `funddepositHistory.php` | `GET /fund/online-deposit-admin` (new, Prisma) | UI + API + wired. **Not run against a DB yet** |
| Gift Codes | `gift-codes.php` | `GET`, `POST /gift-codes/admin`, `DELETE /gift-codes/admin/:id` (exist) | UI + wired. **Not run against a DB yet.** Original JS called `/gift-codes/` (no `/admin`), which has no route |
| Fund Transfer | `fundTransfer.php`, `ajax_calls/get_sponser_name.php` | `POST /fund/transfer-admin` (exists); `GET /user/admin/sponser-name` (new) | UI + API + wired. **Not run against a DB yet** |
| Fund Transfer History | `fundTransferHistory.php` | `GET /fund/transfer-history-admin` (new, Prisma) | UI + API + wired. **Not run against a DB yet** |
| Wallet Deduction | `walletDeduct.php` | `GET /fund/user-wallet-admin`, `POST /fund/wallet-deduct-admin` (exist) | UI + wired. **Not run against a DB yet** |
| Withdrawals | `withdrawals.php` | `GET /withdrawal/admin`, `POST /withdrawal/admin/:id/approve`, `/reject` (exist) | UI + wired. **Not run against a DB yet** |
| App Banner | `bannerUpdate.php`, `addBannerProcess.php`, `newsUpdate.php` | `GET`, `POST /settings/admin/banners`, `DELETE /settings/admin/banners/:id`, `GET`, `POST /settings/admin/news`, `DELETE /settings/admin/news/:id` (new, Prisma) | UI + API + wired. **Not run against a DB yet.** Banner files go to `SUPPORT_FILE_DIR` |
| Wallet Statement | `walletStatement.php` | `GET /user/admin/wallet-statements` (new, Prisma) | UI + API + wired. **Not run against a DB yet** |
| Settings: Upi, Wallet Address | `upi.php`, `wallet-address.php` | `GET`, `POST /upi`, `PATCH`, `DELETE /upi/:id`; same for `/wallet-address` (exist) | UI + wired. **Not run against a DB yet** |
| Settings: Popup Update, Links Settings | `popupUpdate.php`, `popupUpdateBack.php`, `ajax_calls/updateImageStatus.php`, `linksSettings.php` | `GET`, `POST /settings/admin/popup...` (new); `GET /links` (new), `PUT /links` (exists) | UI + API + wired. **Not run against a DB yet** |
| Change Password | `changePassword.php`, `changePasswordProcess.php` | `POST /auth/admin/change-password` (new, Prisma) | UI + API + wired. **Not run against a DB yet.** Current password is checked (original did not check it; changed on request) |
| Dashboard card pages | `viewActiveMember.php`, `viewInActiveMember.php`, `activeIncomeUserMember.php`, `walletOutstanding.php` | `GET /user/admin/members/active`, `/inactive`, `/by-join-date`, `/user/admin/wallet-outstanding` (new, Prisma) | UI + API + wired. **Not run against a DB yet** |
| Dashboard link `walletWithdrawStatus.php` | does not exist in the original Admin folder (404 there too) | — | not ported |
| Support | `newSupportTicket.php`, `supportTicket.php`, `ticketRemarkProcess.php`, `ajax_calls/ticketRemarkAjax.php` | `GET /support/admin/subjects`, `GET /support/admin/tickets`, `POST /support/admin/tickets/:id`, `GET /support/admin/tickets/:id/attachment` (new, Prisma) | UI + API + wired. **Not run against a DB yet.** Attachments read from `uploads/support` (how new user tickets are saved); old tickets with `assets/SupportFile` paths are not served |
| Auth | `index.php` (login + OTP), `signOut.php`, `login-check.php`, header/menu user name | `POST /auth/admin/login`, `/auth/admin/login/verify-otp`, `/auth/admin/logout` (exist); `GET /auth/admin/me` (new) | UI + API + wired. **Not run against a DB yet** |

## Todo (menu order)

| Menu | PHP page | API |
| --- | --- | --- |
| Settings: Other Settings | `otherSettings.php`, `otherSettingsBack.php` | **skipped** — writes `meddolic_config_payment_details`, which nothing outside the Admin page reads | not ported |

Admin pages not in the menu (income reports, salary, ROI, etc.) are skipped for now. They are dead links in `menu.php`.
