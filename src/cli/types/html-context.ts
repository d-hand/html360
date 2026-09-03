import { Config } from "./config";
import { HtmlChunks } from "./html-chunks";
import { HtmlOptions } from "./html-options";

export type HtmlContext = {
  imgPaths: string[];
  options: HtmlOptions;
  threadCount: number;
  htmlChunks: HtmlChunks;
  config: Config;
};

