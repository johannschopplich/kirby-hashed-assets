// @ts-check

const path = require("path");
const fs = require("fs");
const glob = require("tiny-glob");
const crypto = require("crypto");
const colorette = require("colorette");

const indexPath = fs.existsSync("public") ? "public/" : "";
const assetsDir = `${indexPath}assets`;
const hashedFilenameRE = /\w{8}\.(?:css|js)$/;

/**
 * Returns a 8-digit hash for a given file
 *
 * @param {string} path Path of the file
 * @returns {string} Generated hash
 */
function getHash(path) {
  const buffer = fs.readFileSync(path);
  const sum = crypto.createHash("sha256").update(buffer);
  const hex = sum.digest("hex");
  return hex.substr(0, 8);
}

/**
 * Trims the index dir from a given path
 *
 * @param {string} i Path of the file
 * @returns {string} Cleaned path
 */
function trimIndex(i) {
  return i.slice(indexPath.length);
}

/**
 * Main entry point
 */
async function main() {
  const assetFiles = await glob(`${assetsDir}/{css,js}/**/*.{css,js}`);
  const manifest = Object.create(null);

  console.log(colorette.green("Hashing build assets..."));

  for (const filePath of assetFiles) {
    const parsedPath = path.parse(filePath);

    // Make sure file hasn't been hashed already
    if (hashedFilenameRE.test(parsedPath.base)) continue;

    const hash = getHash(filePath);
    const newFilePath = path.format({
      ...parsedPath,
      base: undefined,
      ext: "." + hash + parsedPath.ext,
    });

    fs.renameSync(filePath, newFilePath);

    manifest[trimIndex(filePath)] = trimIndex(newFilePath);
  }

  fs.writeFileSync(
    `${assetsDir}/manifest.json`,
    JSON.stringify(manifest, null, 2)
  );

  console.log(
    `${colorette.green("✓")} Hashed ${assetFiles.length} asset files.`
  );
}

main().catch((err) => console.error(err));
