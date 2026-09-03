export type Config = {
  author: string;
  authorUrl: string;
  useImageNameAsTitle: boolean;
  useAutoNav: boolean;
};

export const defaultConfig: Config = {
  author: "",
  authorUrl: "",
  useImageNameAsTitle: false,
  useAutoNav: false,
};
