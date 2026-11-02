import type { animal, animalBets } from "@/lib/prisma";

type GetMultiplierParams = {
  result: NonNullable<animal["result"]>;
  betOn: animalBets["betOn"];
};

export const getMultipliers = ({ result, betOn }: GetMultiplierParams) => {
  if (result === betOn) {
    if (betOn === "TIGER") {
      return 2;
    }
    if (betOn === "SNAKE") {
      return 3;
    }
    if (betOn === "SHARK") {
      return 4;
    }
    if (betOn === "FOX") {
      return 6;
    }
    if (betOn === "CHEETAH") {
      return 8;
    }
    if (betOn === "BEAR") {
      return 10;
    }
    if (betOn === "WHALE") {
      return 12;
    }
    if (betOn === "LION") {
      return 20;
    }
  }
  return 0;
};
