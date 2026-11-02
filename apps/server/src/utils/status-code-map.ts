import { StatusCodes } from "http-status-codes";

import type { ErrorCode } from "@/utils/app-error";

const STATUS_CODE_TO_ERROR_CODE: Record<number, ErrorCode> = {};

for (const [key, value] of Object.entries(StatusCodes)) {
  if (typeof value === "number") {
    STATUS_CODE_TO_ERROR_CODE[value] = key as ErrorCode;
  }
}

export function codeFromStatus(
  statusCode: number,
  fallback: ErrorCode
): ErrorCode {
  return STATUS_CODE_TO_ERROR_CODE[statusCode] ?? fallback;
}
