import { relative, parse, format } from "pathe";
import { existsSync } from "fs";
import { writeFile, rename } from "fs/promises";
import { getHash, hashedFilenameRE } from "./utils";
import consola from "consola";
import { cyan, green } from "colorette";
import { name, version } from "../package.json";
import glob from "tiny-glob";

export const indexPath = existsSync("public") ? "public/" : "";
export const assetsDir = `${indexPath}assets`;

export type CliOptions = {
  assetsDir: string;
};

export async function generate(options: CliOptions) {
  const assetFiles = await glob(`${options.assetsDir}/{css,js}/**/*.{css,js}`);
  const manifest = Object.create(null);

  for (const filePath of assetFiles) {
    const parsedPath = parse(filePath);

    // Make sure file hasn't been hashed already
    if (hashedFilenameRE.test(parsedPath.base)) {
      consola.info(`${cyan(filePath)} seems to be hashed already`);
    }

    const hash = await getHash(filePath);
    const newFilePath = format({
      ...parsedPath,
      base: undefined,
      ext: "." + hash + parsedPath.ext,
    });

    await rename(filePath, newFilePath);

    manifest[filePath.slice(indexPath.length)] = newFilePath.slice(
      indexPath.length
    );
  }

  writeFile(
    `${assetsDir}/manifest.json`,
    JSON.stringify(manifest, null, 2),
    "utf-8"
  );

  consola.success(
    `${assetFiles.length} asset files hashed in ${cyan(
      relative(process.cwd(), assetsDir)
    )}\n`
  );
}

export async function build(options: CliOptions) {
  consola.log(green(`${name} v${version}`));
  consola.start("hashing build assets...");

  await generate(options);
}
