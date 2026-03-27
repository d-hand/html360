import { Hotspot } from "./hotspot/hotspot";
import { EditModeActions } from "./edit-mode-actions/edit-mode-actions";
import { MainMenu } from "./menu/menu-main";
import { Store } from "./store/store";
import { ViewerAdapter } from "./viewer/viewer-adapter";
import { Crosshair } from "./crosshair/crosshair";

window.addEventListener("load", async () => {
  const store = Store.create();
  const viewer = await ViewerAdapter.create(store);
  const mainMenu = MainMenu.create(store);
  const hotspot = Hotspot.create(store, viewer);
  const editModeActions = EditModeActions.create(store, hotspot);
  
  Crosshair.create(store);

  (window as any).x = { store, viewer, hotspot, mainMenu, editModeActions };
});
