import path from "node:path";

export const UPLOAD_DIR = path.join(import.meta.dirname, "..", "..", "..", "uploads", "support");

// Checked against the file's own bytes, so a renamed script can't get in.
export const FILE_TYPES = [
  { ext: "png", mime: "image/png", magic: [0x89, 0x50, 0x4e, 0x47] },
  { ext: "jpg", mime: "image/jpeg", magic: [0xff, 0xd8, 0xff] },
  { ext: "gif", mime: "image/gif", magic: [0x47, 0x49, 0x46, 0x38] },
  { ext: "pdf", mime: "application/pdf", magic: [0x25, 0x50, 0x44, 0x46] },
];

export function detectFileType(bytes: Buffer) {
  return FILE_TYPES.find((type) => type.magic.every((b, i) => bytes[i] === b));
}
