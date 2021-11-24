import { cac } from "cac";
import { name, version } from "../package.json";
import { build, assetsDir } from "./index";
import { handleError } from "./errors";

async function main() {
  const cli = cac(name);

  cli.command("[dir]", "Assets dir").action(async (dir: string, flags) => {
    await build({
      ...flags,
      assetsDir: dir ?? assetsDir,
    });
  });

  cli.help();

  cli.version(version);

  // Parse CLI args without running the command to
  // handle command errors globally
  cli.parse(process.argv, { run: false });
  await cli.runMatchedCommand();
}

main().catch(handleError);
