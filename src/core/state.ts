export type State = {
  name: string;
  yaw: number;
  pitch: number;
  hfov: number;
  version: string;
};

export const defaultState: State = {
  name: "html360",
  yaw: 0,
  pitch: 0,
  hfov: 100,
  version: "",
};
