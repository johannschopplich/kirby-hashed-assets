import { readFile } from "fs/promises";
import { createHash } from "crypto";

export const hashedFilenameRE = /[.-]\w{8}\.\w+$/;

/**
 * Returns a 8-digit hash for a given file
 */
export async function getHash(path: string) {
  const buffer = await readFile(path);
  const sum = createHash("sha256").update(buffer);
  const hex = sum.digest("hex");
  return hex.substr(0, 8);
}
