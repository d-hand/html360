import { PannellumHotSpotType } from "../../core/pannellum/pannellum";
import { Hotspot } from "../hotspot/hotspot";
import { Store } from "../store/store";
import { getElementById } from "../utils/document";

export type EditModeActions = ReturnType<typeof create>;

export const EditModeActions = {
  create,
};

function create(store: Store, hotspot: Hotspot) {
  const menu = getElementById("edit-mode-actinos");
  const addPanoramaBtm = getElementById("edit-mode-actinos-add-panorama");
  const addInfoBtm = getElementById("edit-mode-actinos-add-info");

  const addHotspot = (type: PannellumHotSpotType) => {
    setTimeout(() => {
      hotspot.show({ type });
    }, 0);
  };

  const onAddPanorama = () => addHotspot("scene");

  const onAddInfo = () => addHotspot("info");

  const show = () => {
    addPanoramaBtm.addEventListener("click", onAddPanorama);
    addInfoBtm.addEventListener("click", onAddInfo);
    menu.classList.remove("hidden");
  };

  const hide = () => {
    addPanoramaBtm.removeEventListener("click", onAddPanorama);
    addInfoBtm.removeEventListener("click", onAddInfo);
    menu.classList.add("hidden");
  };

  const toggle = (isVisible: boolean) => isVisible ? show() : hide();

  store.on("setIsEditMode", toggle);
  
  return { show, hide };
}
