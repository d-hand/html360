import { Hotspot, HotspotMode } from "../hotspot/hotspot";
import { getElementById, getPanoramaElement } from "../utils/document-helper";

export type HotspotMenu = ReturnType<typeof create>;

export const HotspotMenu = {
  create,
};

function create(hotspot: Hotspot) {
  const menu = getElementById("hotspot-menu");
  const add = getElementById("hotspot-menu-add");
  const edit = getElementById("hotspot-menu-edit");
  const del = getElementById("hotspot-menu-delete");
  const panorama = getPanoramaElement();

  const onContextMenu = () => {
    hide();
  };

  const onAddClick = () => handleAction("add");

  const onEditClick = () => handleAction("edit");

  const onDeleteClick = () => handleAction("delete");

  const handleAction = (mode: HotspotMode) => {
    hide();
    setTimeout(() => {
      hotspot.show(mode);
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
    panorama.addEventListener("contextmenu", onContextMenu);
    add.addEventListener("click", onAddClick);
    edit.addEventListener("click", onEditClick);
    del.addEventListener("click", onDeleteClick);
    menu.classList.remove("hidden");
  };

  const hide = () => {
    document.removeEventListener("click", onClickOutside);
    panorama.removeEventListener("contextmenu", onContextMenu);
    add.removeEventListener("click", onAddClick);
    edit.removeEventListener("click", onEditClick);
    del.removeEventListener("click", onDeleteClick);
    menu.classList.add("hidden");
  };

  return {
    show,
    hide,
  };
}
