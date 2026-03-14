import os from "node:os";
import { getHtmlChunks } from "./html-chunks";
import { Context, Options } from "./types";

export async function getContext(
  imgPaths: string[],
  options: Options,
): Promise<Context> {
  const htmlChunks = await getHtmlChunks();
  const cpuCount = os.cpus().length;
  const threadCount = Math.max(1, cpuCount - 1);

  return { imgPaths, options, htmlChunks, threadCount };
}
