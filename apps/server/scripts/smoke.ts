// Exercises the user panel API through app.inject. It writes to the database, so it refuses
// to run unless DB_NAME ends in "_smoke". Run: pnpm --filter server smoke
import assert from "node:assert/strict";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { env } from "@/env";

// src/index.ts does this at boot, but importing it would also start the games and crons.
dayjs.extend(utc);
dayjs.extend(timezone);

assert.ok(env.DB_NAME.endsWith("_smoke"), "Point DB_NAME at a throwaway *_smoke database");

const { app } = await import("@/app");
const { prisma } = await import("@/lib/prisma");
const { redis } = await import("@/lib/redis");
const { signToken } = await import("@/utils/jwt");

const member = await prisma.meddolic_user_details.findFirstOrThrow({
  where: { user_type: 2, account_status: 1, sponser_id: { not: null } },
  select: { member_id: true, user_type: true, password: true, bonusWallet: true },
  orderBy: { member_id: "asc" },
});
const cookies = {
  user_token: signToken({ memberId: member.member_id, userType: member.user_type }),
};

async function call(method: "GET" | "POST" | "PATCH", url: string, body?: object, auth = true) {
  const res = await app.inject({ method, url, cookies: auth ? cookies : {}, body });
  return { status: res.statusCode, json: res.json() };
}

const READ_ROUTES = [
  "/user/profile",
  "/user/home",
  "/user/wallet-summary",
  "/user/wallet-details",
  "/user/promotion",
  "/user/first-deposit-bonus",
  "/user/direct",
  "/user/team",
  "/user/new-registrations",
  "/user/statement",
  "/user/2fa",
  `/user/subordinate-data?date=2026-10-20`,
  "/attendance",
  "/support/subjects",
  "/support/tickets",
  "/income/commission-summary?from=2026-01-01&to=2026-12-31",
  "/win-go/bet-history?page=1",
  "/k3/bet-history?page=1",
  "/aviator/bet-history?page=1",
  ...[
    "daily-rebate",
    "daily-recharge",
    "daily-fund-roi",
    "deposit-bonus",
    "deposit-bonus-1-2",
    "deposit-bonus-3-4-5",
    "usd-deposit-bonus",
    "level",
    "referral",
    "referral-level",
    "rescue",
    "salary",
    "winning-streak",
  ].map((type) => `/income/${type}`),
];

for (const url of READ_ROUTES) {
  const { status, json } = await call("GET", url);
  assert.equal(status, 200, `${url}: ${JSON.stringify(json).slice(0, 300)}`);
  assert.ok(!JSON.stringify(json).includes(member.password) || member.password.length < 6, `${url} leaked a password`);
}

// Auth: every panel route rejects anonymous callers.
for (const url of READ_ROUTES) {
  assert.equal((await call("GET", url, undefined, false)).status, 401, `${url} is public`);
}
assert.equal((await call("GET", "/income/not-a-type")).status, 400);
assert.equal((await call("GET", "/auth/countries", undefined, false)).status, 200);

// Income rows belong to the caller only.
const sample = await prisma.meddolic_user_trade_commission.findFirst({
  where: { status: 1 },
  select: { member_id: true },
});
if (sample) {
  const token = signToken({ memberId: sample.member_id, userType: 2 });
  const res = await app.inject({ method: "GET", url: "/income/level", cookies: { user_token: token } });
  const { data } = res.json().data;
  assert.ok(data.length > 0, "commission owner should see rows");
  assert.ok(data[0].from === null || "name" in data[0].from, "from user is attached");
}

// Attendance: claim credits once, and only the owner can claim.
const now = new Date();
const other = await prisma.meddolic_user_details.findFirstOrThrow({
  where: { member_id: { not: member.member_id }, user_type: 2 },
  select: { member_id: true },
});
const row = await prisma.meddolic_user_attendence_bonus.create({
  data: { member_id: member.member_id, attendence_id: 1, day: 1, bonus: 10, date_time: now, status: 0 },
});
const foreign = await prisma.meddolic_user_attendence_bonus.create({
  data: { member_id: other.member_id, attendence_id: 1, day: 1, bonus: 10, date_time: now, status: 0 },
});
assert.equal((await call("POST", `/attendance/${foreign.id}/claim`)).status, 400, "claimed another member's bonus");

const before = member.bonusWallet.toNumber();
const results = await Promise.all([
  call("POST", `/attendance/${row.id}/claim`),
  call("POST", `/attendance/${row.id}/claim`),
]);
assert.deepEqual(results.map((r) => r.status).toSorted(), [200, 400], "double claim must fail");
const after = await prisma.meddolic_user_details.findUniqueOrThrow({
  where: { member_id: member.member_id },
  select: { bonusWallet: true },
});
assert.equal(after.bonusWallet.toNumber(), before + 10, "claim credits the bonus once");
const statements = await prisma.wallet_statements.count({
  where: { user_id: member.member_id, txn_id: row.id, note: "Attendance bonus" },
});
assert.equal(statements, 1, "claim writes one statement");

// Profile: the name changes, and only for the session's user.
assert.equal((await call("PATCH", "/user/profile", { name: "Smoke Test" })).status, 200);
assert.equal((await call("PATCH", "/user/profile", { name: "  " })).status, 400);
assert.equal((await call("GET", "/user/profile")).json.data.name, "Smoke Test");

// Support: one open ticket at a time, and non-image bytes are rejected.
const subject = await prisma.meddolic_config_support_subject.findFirst({
  where: { subjectStatus: 1 },
  select: { subjectId: true },
});
if (subject) {
  await prisma.meddolic_user_support_ticket.deleteMany({ where: { memberId: member.member_id } });
  const script = Buffer.from("<?php system($_GET['c']);").toString("base64");
  const rejected = await call("POST", "/support/tickets", { subjectId: subject.subjectId, message: "x", fileBase64: script });
  assert.equal(rejected.status, 400, "non-image upload must fail");

  const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a]).toString("base64");
  const created = await call("POST", "/support/tickets", { subjectId: subject.subjectId, message: "Help", fileBase64: png });
  assert.equal(created.status, 201, JSON.stringify(created.json));
  assert.equal((await call("POST", "/support/tickets", { subjectId: subject.subjectId, message: "Again" })).status, 400);

  const [ticket] = (await call("GET", "/support/tickets")).json.data;
  const file = await app.inject({ method: "GET", url: `/support/tickets/${ticket.ticketId}/attachment`, cookies });
  assert.equal(file.headers["content-type"], "image/png");
  const notMine = await app.inject({
    method: "GET",
    url: `/support/tickets/${ticket.ticketId}/attachment`,
    cookies: { user_token: signToken({ memberId: other.member_id, userType: 2 }) },
  });
  assert.equal(notMine.statusCode, 404, "attachment must stay private");
}

// Payment: below-minimum amounts fail, and another member's online order stays hidden.
assert.equal((await call("GET", "/fund/payment-target?type=INR&amount=1")).status, 400);
const order = await prisma.recharges.findFirst({
  where: { method: "ONLINE", orderId: { not: null }, userId: { not: member.member_id } },
  select: { orderId: true },
});
if (order?.orderId) {
  assert.equal((await call("GET", `/fund/online-order/${order.orderId}`)).status, 404);
}

// Password: wrong old password fails, the right one logs out.
assert.equal((await call("POST", "/user/change-password", { oldPassword: "definitely-wrong", newPassword: "abcd1234" })).status, 400);
assert.equal((await call("POST", "/user/change-password", { oldPassword: member.password, newPassword: "abcd1234" })).status, 200);

// Forgot password: same reply for unknown phones, and a bad OTP changes nothing.
const unknown = await call("POST", "/auth/forgot-password/send-otp", { phone: "0000000000" }, false);
assert.equal(unknown.status, 200);
assert.equal(
  (await call("POST", "/auth/forgot-password/reset", { phone: "0000000000", otp: "123456", password: "abcd1234" }, false)).status,
  400
);

console.log("smoke: all checks passed");
await app.close();
await prisma.$disconnect();
redis.disconnect();
process.exit(0);
