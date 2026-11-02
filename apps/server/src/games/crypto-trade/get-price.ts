import axios from "axios";

import { Prisma, prisma } from "@/lib/prisma";
import { Now } from "@/utils/date";

export const getPrice = async (last = false) => {
  if (last) {
    return prisma.cryptoPriceHistory.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  const { data } = await axios.get(
    "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
  );

  const price = new Prisma.Decimal(data.price);

  return prisma.cryptoPriceHistory.create({
    data: {
      price,
      createdAt: Now().toISOString(),
    },
  });
};
