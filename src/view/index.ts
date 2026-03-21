import { Hotspot } from "./hotspot/hotspot";
import { HotspotMenu } from "./menu/menu-hotspot";
import { MainMenu } from "./menu/menu-main";
import { Store } from "./store/store";
import { Viewer } from "./viewer/viewer";

window.addEventListener("load", async () => {
  const store = Store.create();
  const viewer = await Viewer.create(store);
  const hotspot = Hotspot.create(store);
  const hotspotMenu = HotspotMenu.create(hotspot);
  const mainMenu = MainMenu.create(store, viewer, hotspotMenu);

  (window as any).x = { store, viewer, hotspotMenu, mainMenu };
});
