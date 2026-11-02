// oxlint-disable unicorn/no-array-for-each typescript/no-non-null-assertion
import axios from "axios";
import * as v from "valibot";

import { logger } from "@/lib/logger";
import type { trx } from "@/lib/prisma";
import { prisma } from "@/lib/prisma";

import { handleWinAndLose } from "./handle-win-lose";

type CalculateResult = {
  ids: trx["id"][];
};

const blockSchema = v.object({
  number: v.pipe(v.number(), v.integer(), v.minValue(0)),
  hash: v.string(),
  size: v.pipe(v.number(), v.integer(), v.gtValue(0)),
  timestamp: v.pipe(v.number(), v.integer(), v.minValue(0)),
  txTrieRoot: v.string(),
  parentHash: v.string(),
  witnessId: v.pipe(v.number(), v.integer(), v.minValue(0)),
  witnessAddress: v.string(),
  nrOfTrx: v.pipe(v.number(), v.integer(), v.minValue(0)),
  witnessName: v.string(),
  version: v.string(),
  fee: v.pipe(v.number(), v.minValue(0)),
  confirmed: v.boolean(),
  confirmations: v.pipe(v.number(), v.integer(), v.minValue(0)),
  netUsage: v.pipe(v.number(), v.integer(), v.minValue(0)),
  energyUsage: v.pipe(v.number(), v.integer(), v.minValue(0)),
  blockReward: v.pipe(v.number(), v.integer(), v.minValue(0)),
  voteReward: v.pipe(v.number(), v.integer(), v.minValue(0)),
  revert: v.boolean(),
});

export const calculateResult = ({ ids }: CalculateResult) => {
  ids.forEach(async (id) => {
    try {
      const { data } = await axios.get(
        "https://apilist.tronscanapi.com/api/block?limit=1"
      );

      // oxlint-disable-next-line prefer-destructuring
      const block = data.data[0];

      const blockData = v.parse(blockSchema, block);

      // last 5 characters of the hash
      const subHash = blockData.hash.slice(-5);

      // travese from reverse and find the first number
      let winNumber = 0;

      for (let i = subHash.length - 1; i >= 0; i -= 1) {
        if (!Number.isNaN(Number.parseInt(subHash[i]!, 10))) {
          winNumber = Number.parseInt(subHash[i]!, 10);
          break;
        }
      }

      const { id: blockId } = await prisma.trxBlocks.create({
        data: blockData,
      });

      await handleWinAndLose({ id, winNumber, subHash, blockId });
    } catch (error) {
      logger.error(error);
    }
  });
};
