import { Store } from "../store/store";
import { getElementById, getPanoramaElement } from "../utils/document-helper";
import { capitalizeFirst } from "../utils/string-helper";

export type Hotspot = ReturnType<typeof create>;

export const Hotspot = {
  create,
};

export type HotspotMode = "add" | "edit" | "delete";

function create(store: Store) {
  const hotspot = getElementById("hotspot");
  const actionBtn = getElementById("hotspot-action");
  const closeBtn = getElementById("hotspot-close");
  const panorama = getPanoramaElement();

  const onActionClick = () => {
    hide();
  };

  const onCloseClick = () => {
    hide();
  };

  const onContextMenu = () => {
    hide();
  };

  const show = (mode: HotspotMode) => {
    panorama.addEventListener("contextmenu", onContextMenu);
    actionBtn.addEventListener("click", onActionClick);
    closeBtn.addEventListener("click", onCloseClick);

    actionBtn.innerHTML = capitalizeFirst(mode);
    actionBtn.classList.toggle("danger", mode === "delete");
    hotspot.classList.add(mode);
    hotspot.classList.remove("hidden");
  };

  const hide = () => {
    panorama.removeEventListener("contextmenu", onContextMenu);
    actionBtn.removeEventListener("click", onActionClick);
    closeBtn.removeEventListener("click", onCloseClick);
    hotspot.classList.add("hidden");
  };

  return {
    show,
    hide,
  };
}
