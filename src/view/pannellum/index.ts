import "@pannellum-proxy";

export type Pannellum = {
  viewer: (
    container: string | HTMLElement,
    config: PannellumConfig,
  ) => PannellumViewer;
};

export type PannellumConfig = {
  panorama: string;
  type: "equirectangular";
  autoLoad?: boolean;
  showControls?: boolean;
  yaw?: number;
  pitch?: number;
  hfov?: number;
  hotSpots?: PannellumHotSpots[];
  draggable?: boolean;
};

export type PannellumViewer = {
  getYaw(): number;
  getPitch(): number;
  getHfov(): number;
  destroy(): void;
  toggleFullscreen(): void;
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
    callBack: (e: any) => void,
  ): void;
};

export type PannellumHotSpots = {
  id?: string;
  cssClass?: string;
  pitch: number;
  yaw: number;
  type: "scene" | "info";
  text: string;
  URL?: string;
  attributes?: Record<string, string>;
  sceneId?: string;
  targetPitch?: number;
  targetYaw?: number;
  targetHfov?: number;
  createTooltipFunc?: () => any;
  createTooltipArgs?: any;
  clickHandlerFunc?: () => any;
  clickHandlerArgs?: any;
  scale?: boolean;
};

const pannellum = (window as any).pannellum as Pannellum;

export default pannellum;
