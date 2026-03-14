import "pannellum";

export interface PannellumConfig {
  panorama: string;
  type: "equirectangular";
  autoLoad?: boolean;
  yaw?: number;
  pitch?: number;
  hfov?: number;
}

export interface PannellumViewer {
  getYaw(): number;
  getPitch(): number;
  getHfov(): number;
  destroy(): void;
  on(
    eventType:
      | "load"
      | "fullscreenchange"
      | "zoomchange"
      | "mousedown"
      | "mouseup"
      | "touchstart"
      | "touchend"
      | "scenechange"
      | "error"
      | "errorcleared"
      | "messageshown"
      | "messagecleared"
      | "animatefinished"
      | "scenechangefadedone",
    callBack: () => void,
  ): void;
}

declare const pannellum: {
  viewer: (
    container: string | HTMLElement,
    config: PannellumConfig,
  ) => PannellumViewer;
};

export default pannellum;
