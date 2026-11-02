// oxlint-disable unicorn/no-empty-file
// import { pool } from "@/lib/db";
// import { incomeEntry } from "./wallet";

// type VipConfig = {
//   id: number;
//   level: number;
//   exp_need: number;
//   maintenance_need: number;
//   level_up_reward: number;
//   monthly_reward: number;
//   rebate_rate: string;
// };

// export const addExp = async (
//   memberId: any,
//   exp: number,
//   dt: string,
//   from: string
// ) => {
//   await Promise.all([
//     pool.query(
//       `UPDATE
//       meddolic_user_details
//     SET
//       exp = exp + ?
//     WHERE
//       member_id = ?
//     `,
//       [exp, memberId]
//     ),
//     pool.query(
//       `INSERT INTO meddolic_user_exp_details (
//         member_id,
//         exp,
//         type,
//         reason,
//         date_time
//       )
//       VALUES (?, ?, ?, ?, ?)
//       `,
//       [memberId, exp, 1, `BET (${from})`, dt]
//     ),
//   ]);

//   await handleVip(memberId, dt);
// };

// const handleVip = async (memberId: string, dt: string) => {
//   const [[user]] = await pool.query<any>(
//     `SELECT
//       vip,
//       exp
//     FROM
//       meddolic_user_details
//     WHERE
//       member_id = ?
//     `,
//     [memberId]
//   );

//   const { vip, exp } = user as { vip: number; exp: number };
//   const nextVip = vip + 1;

//   const vipConfig = await getVipConfig(nextVip);

//   if (!vipConfig) return;

//   const {
//     id,
//     exp_need,
//     level_up_reward,
//     monthly_reward,
//     maintenance_need,
//     rebate_rate,
//   } = vipConfig;

//   if (exp < exp_need) return;

//   const [queryResult] = await pool.query<any>(
//     `INSERT INTO meddolic_user_vip_achievers (
//       member_id,
//       current_exp,
//       vip_id,
//       date_time
//     )
//     VALUES (?, ?, ?, ?)
//     `,
//     [memberId, exp, id, dt]
//   );

//   const vipAchieverId = queryResult.insertId;

//   await pool.query(
//     `UPDATE
//       meddolic_user_vip_monthly_reward_summary
//     SET
//       status = ?
//     WHERE
//       member_id = ?
//     `,
//     [2, memberId]
//   );

//   const [[result]] = await Promise.all([
//     pool.query<any>(
//       `INSERT INTO meddolic_user_vip_level_up_reward (
//         vip_achiever_id,
//         member_id,
//         reward,
//         date_time
//       )
//       VALUES (?, ?, ?, ?)
//       `,
//       [vipAchieverId, memberId, level_up_reward, dt]
//     ),
//     pool.query<any>(
//       `INSERT INTO meddolic_user_vip_monthly_reward_summary (
//         vip_achiever_id,
//         member_id,
//         reward,
//         maintenance_need,
//         date_time
//       )
//       VALUES (?, ?, ?, ?, ?)
//       `,
//       [vipAchieverId, memberId, monthly_reward, maintenance_need, dt]
//     ),
//     pool.query(
//       `UPDATE
//         meddolic_user_details
//       SET
//         vip = ?,
//         rebate_rate = ?
//       WHERE
//         member_id = ?
//       `,
//       [nextVip, rebate_rate, memberId]
//     ),
//   ]);
//   const txnId = result.insertId;

//   await incomeEntry({
//     db: pool,
//     memberId,
//     txnId,
//     amount: level_up_reward,
//     statementId: 26,
//     dateTime: dt,
//     walletType: "bonusWallet",
//   });

//   await handleVip(memberId, dt);
// };

// const getVipConfig = async (level: number) => {
//   const [configs] = await pool.query<any>(
//     "SELECT * FROM meddolic_config_vip WHERE level = ?",
//     [level]
//   );

//   return configs[0] as VipConfig | undefined;
// };
