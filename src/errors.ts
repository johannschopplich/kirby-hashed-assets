import consola from "consola";

export function handleError(error: unknown) {
  if (error instanceof Error) {
    consola.error(error.message);
  }

  process.exitCode = 1;
}
