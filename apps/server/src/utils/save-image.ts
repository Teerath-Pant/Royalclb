import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { env } from "@/env";

import { AppError } from "./app-error";

export const SUPPORT_FILE_DIR =
  env.SUPPORT_FILE_DIR ??
  path.join(import.meta.dirname, "..", "..", "uploads", "SupportFile");

const MAX_FILE_BYTES = 5_000_000;

const IMAGE_SIGNATURES = [
  (b: Buffer) => [0x89, 0x50, 0x4e, 0x47].every((x, i) => b[i] === x),
  (b: Buffer) => [0xff, 0xd8, 0xff].every((x, i) => b[i] === x),
  (b: Buffer) => [0x47, 0x49, 0x46, 0x38].every((x, i) => b[i] === x),
  (b: Buffer) =>
    b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP",
];

type Options = {
  image: string;
  fileName: string;
  prefix: string;
  allowedExtensions: string[];
  errorMessage: string;
};

export async function saveSupportImage(options: Options) {
  const bytes = Buffer.from(options.image, "base64");
  const extension = options.fileName.split(".").pop()?.toLowerCase() ?? "";

  const valid =
    bytes.length < MAX_FILE_BYTES &&
    options.allowedExtensions.includes(extension) &&
    IMAGE_SIGNATURES.some((matches) => matches(bytes));

  if (!valid) {
    throw new AppError("BAD_REQUEST", { message: options.errorMessage });
  }

  const newFileName = `${options.prefix}${randomUUID()}.${extension}`;

  try {
    await mkdir(SUPPORT_FILE_DIR, { recursive: true });
    await writeFile(path.join(SUPPORT_FILE_DIR, newFileName), bytes);
  } catch (cause) {
    throw new AppError("INTERNAL_SERVER_ERROR", {
      message: "Failed to save image file",
      cause,
    });
  }

  return newFileName;
}
