import { PannellumViewer } from "../../core/pannellum";
import { Store } from "../store/store";
import {
  getElementById,
  getPanoramaElement,
} from "../utils/document-helper";
import { HotspotMenu } from "./menu-hotspot";

export type MainMenu = ReturnType<typeof create>;

export const MainMenu = {
  create,
};

function create(
  store: Store,
  viewer: PannellumViewer,
  hotspotMenu: HotspotMenu,
) {
  const menu = getElementById("main-menu");
  const save = getElementById("main-menu-save");
  const fullScreen = getElementById("main-menu-fullscreen");
  const hotspot = getElementById("main-menu-hotspot");
  const panorama = getPanoramaElement();

  const onSaveClick = () => {
    hide();
    store.download();
  };

  const onFullScreenClick = () => {
    hide();
    viewer.toggleFullscreen();
  };

  const onHotspotClick = () => {
    hide();
    setTimeout(() => {
      hotspotMenu.show();
    }, 0);
  };

  const onClickOutside = (e: MouseEvent) => {
    const target = e.target as Node;
    if (!menu.classList.contains("hidden") && !menu.contains(target)) {
      hide();
    }
  };

  const show = () => {
    document.addEventListener("click", onClickOutside);
    save.addEventListener("click", onSaveClick);
    fullScreen.addEventListener("click", onFullScreenClick);
    hotspot.addEventListener("click", onHotspotClick);
    menu.classList.remove("hidden");
  };

  const hide = () => {
    document.removeEventListener("click", onClickOutside);
    save.removeEventListener("click", onSaveClick);
    fullScreen.removeEventListener("click", onFullScreenClick);
    hotspot.removeEventListener("click", onHotspotClick);
    menu.classList.add("hidden");
  };

  const toggle = () => {
    if (menu.classList.contains("hidden")) {
      show();
    } else {
      hide();
    }
  };

  panorama.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    toggle();
  });

  return { show, hide, toggle };
}
