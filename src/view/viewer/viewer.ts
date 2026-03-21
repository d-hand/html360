import pannellum, { type PannellumViewer } from "../../core/pannellum";
import { Store } from "../store/store";
import { getElementById, getPanoramaElement } from "../utils/document-helper";

export type Viewer = ReturnType<typeof create>;

export const Viewer = {
  create,
};


async function create(
  store: Store,
): Promise<PannellumViewer> {
  const dataElement = getElementById("panorama-data");
  const base64Data = dataElement.textContent.trim();
  const blob = await (await fetch(base64Data)).blob();
  const objectURL = URL.createObjectURL(blob);

  getElementById("loader").style.display = "none";

  const viewer = pannellum.viewer(getPanoramaElement(), {
    type: "equirectangular",
    panorama: objectURL,
    autoLoad: true,
    showControls: false,
    yaw: store.state.yaw,
    pitch: store.state.pitch,
    hfov: store.state.hfov,
  });

  viewer.on("load", () => {
    URL.revokeObjectURL(objectURL);
  });

  viewer.on("mouseup", (e: MouseEvent) => {
    store.update({
      yaw: viewer.getYaw(),
      pitch: viewer.getPitch(),
    });
  });

  viewer.on("touchend", () => {
    store.update({
      yaw: viewer.getYaw(),
      pitch: viewer.getPitch(),
    });
  });

  viewer.on("zoomchange", () => {
    store.update({ hfov: viewer.getHfov() });
  });

  return viewer;
}
