import pannellum from "./pannellum";
import { Store } from "./store/store";

window.addEventListener("load", async () => {
  const dataElement = document.getElementById("panorama-data");
  const base64Data = dataElement!.textContent!.trim();
  const blob = await (await fetch(base64Data)).blob();
  const objectURL = URL.createObjectURL(blob);

  document!.getElementById("loader")!.style.display = "none";

  const panorama = document.getElementById("panorama");
  const menu = document.getElementById("menu");
  const menuSaveBtn = document.getElementById("menu-save");
  const menuFullScreenBtn = document.getElementById("menu-fullscreen");

  const store = new Store();

  const viewer = pannellum.viewer("panorama", {
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
    document!.getElementById("loader")!.style.display = "none";
  });

  viewer.on("mouseup", (e: MouseEvent) => {
    store.update({ yaw: viewer.getYaw(), pitch: viewer.getPitch() });
  });

  viewer.on("touchend", () => {
    store.update({ yaw: viewer.getYaw(), pitch: viewer.getPitch() });
  });

  viewer.on("zoomchange", () => {
    store.update({ hfov: viewer.getHfov() });
  });

  if (IS_DEV) {
    store.subscribe((state) => console.log(state));
  }

  document.addEventListener("click", (event: Event) => {
    const isClickInside = menu?.contains(event.target as Node);

    if (!isClickInside && !menu?.classList.contains("hidden")) {
      menu?.classList?.add("hidden");
    }
  });

  panorama?.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    menu?.classList?.toggle("hidden");
  });

  menuSaveBtn?.addEventListener("click", () => {
    menu?.classList?.add("hidden");
    store.download();
  });

  menuFullScreenBtn?.addEventListener("click", () => {
    menu?.classList?.add("hidden");
    viewer.toggleFullscreen();
  });

  (window as any).store = store;
  (window as any).viewer = viewer;
});
