import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

import { env } from "@/env";

import { AppError } from "./app-error";

export const SUPPORT_FILE_DIR =
  env.SUPPORT_FILE_DIR ??
  path.join(import.meta.dirname, "..", "..", "uploads", "SupportFile");

const MAX_FILE_BYTES = 5_000_000;
const MAX_BASE64_LENGTH = Math.ceil(MAX_FILE_BYTES / 3) * 4;
const MAX_IMAGE_PIXELS = 40_000_000;

type ImageFormat = "gif" | "jpeg" | "png" | "webp";

const FORMAT_BY_EXTENSION: Record<string, ImageFormat> = {
  gif: "gif",
  jpeg: "jpeg",
  jpg: "jpeg",
  png: "png",
  webp: "webp",
} as const;

type Options = {
  image: string;
  fileName: string;
  prefix: string;
  allowedExtensions: string[];
  errorMessage: string;
};

export async function saveSupportImage(options: Options) {
  const extension = options.fileName.split(".").pop()?.toLowerCase() ?? "";
  const expectedFormat = FORMAT_BY_EXTENSION[extension];

  if (
    !expectedFormat ||
    !options.allowedExtensions.includes(extension) ||
    options.image.length > MAX_BASE64_LENGTH ||
    !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(options.image)
  ) {
    throw new AppError("BAD_REQUEST", { message: options.errorMessage });
  }

  const bytes = Buffer.from(options.image, "base64");
  if (bytes.length >= MAX_FILE_BYTES) {
    throw new AppError("BAD_REQUEST", { message: options.errorMessage });
  }

  let safeBytes: Buffer;
  try {
    const image = sharp(bytes, {
      animated: true,
      failOn: "warning",
      limitInputPixels: MAX_IMAGE_PIXELS,
    });
    const metadata = await image.metadata();

    if (metadata.format !== expectedFormat) {
      throw new Error("Image format does not match the file extension");
    }

    safeBytes = await image
      .toFormat(expectedFormat, expectedFormat === "jpeg" ? { quality: 90 } : {})
      .toBuffer();
  } catch (cause) {
    throw new AppError("BAD_REQUEST", {
      message: options.errorMessage,
      cause,
    });
  }

  if (safeBytes.length >= MAX_FILE_BYTES) {
    throw new AppError("BAD_REQUEST", { message: options.errorMessage });
  }

  const newFileName = `${options.prefix}${randomUUID()}.${extension}`;

  try {
    await mkdir(SUPPORT_FILE_DIR, { recursive: true });
    await writeFile(path.join(SUPPORT_FILE_DIR, newFileName), safeBytes);
  } catch (cause) {
    throw new AppError("INTERNAL_SERVER_ERROR", {
      message: "Failed to save image file",
      cause,
    });
  }

  return newFileName;
}
