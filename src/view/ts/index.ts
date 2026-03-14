import pannellum from "./pannellum";
import { Store } from "./store";

window.addEventListener("load", async () => {
  const dataElement = document.getElementById("panorama-data");
  const base64Data = dataElement!.textContent!.trim();
  const blob = await (await fetch(base64Data)).blob();
  const objectURL = URL.createObjectURL(blob);

  document!.getElementById("loader")!.style.display = "none";

  const store = new Store();

  const viewer = pannellum.viewer("panorama", {
    type: "equirectangular",
    panorama: objectURL,
    autoLoad: true,
    yaw: store.state.yaw,
    pitch: store.state.pitch,
    hfov: store.state.hfov,
  });

  viewer.on("load", () => {
    URL.revokeObjectURL(objectURL);
  });

  viewer.on("mouseup", () => {
    store.update({ yaw: viewer.getYaw(), pitch: viewer.getPitch() });
  });

  viewer.on("touchend", () => {
    store.update({ yaw: viewer.getYaw(), pitch: viewer.getPitch() });
  });

  viewer.on("zoomchange", () => {
    store.update({ hfov: viewer.getHfov() });
  });

  store.subscribe(state => console.log(state));

  (window as any).store = store;
  (window as any).viewer = viewer;
});
