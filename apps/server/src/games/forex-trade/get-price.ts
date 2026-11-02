import axios from "axios";

import { Prisma, prisma } from "@/lib/prisma";
import { Now } from "@/utils/date";

const FROM = "USD";
const TO = "INR";
export const getPrice = async (last = false) => {
  if (last) {
    return prisma.forexPriceHistory.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  const { data } = await axios.get(
    `https://api.apilayer.com/exchangerates_data/convert?to=${TO}&from=${FROM}&amount=1`,
    {
      headers: {
        apikey: "f3sHkdMwHFyej8CMS1sa5wT4GwGPJCTb",
      },
    }
  );

  const price = new Prisma.Decimal(data.result);

  return prisma.forexPriceHistory.create({
    data: {
      price,
      createdAt: Now().toISOString(),
    },
  });
};
