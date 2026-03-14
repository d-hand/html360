export type Options = {
  raw: boolean;
};

export type HtmlChunks = {
  source: string;
  first: string;
  beforeState: string;
  last: string;
};

export type Context = {
  imgPaths: string[];
  options: Options;
  threadCount: number;
  htmlChunks: HtmlChunks;
};

export type FileError = {
  fileName: string;
  error: any;
};

