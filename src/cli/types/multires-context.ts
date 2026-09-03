import { Config } from "./config";
import { MultiresOptions } from "./multires-options";

export type MultiresContext = {
  imgPaths: string[];
  options: MultiresOptions;
  templateHtml: string;
  config: Config;
};
