import {
  PannellumHotSpot,
  PannellumHotSpotType,
} from "../../core/pannellum/pannellum";
import { CanBeUndefined, Nullable } from "../../core/types";
import { Store } from "../store/store";
import { getElementById, getPanoramaElement } from "../utils/document";
import { createEventEmitter } from "../utils/event-emitter";
import { generateId } from "../utils/utils";
import { type ViewerAdapter } from "../viewer/viewer-adapter";

export type Hotspot = ReturnType<typeof create>;

export const Hotspot = {
  create,
};

type HotspotEvents = {
  visibilityChange: (isVisible: boolean) => void;
};

function create(store: Store, viewer: ViewerAdapter) {
  let type: CanBeUndefined<PannellumHotSpotType>;
  let hotspot: CanBeUndefined<PannellumHotSpot>;
  const hotspotElm = getElementById("hotspot");
  const hotspotHeader = getElementById<HTMLDivElement>("hotspot-header");
  const textElm = getElementById<HTMLInputElement>("hotspot-text");
  const urlElm = getElementById<HTMLInputElement>("hotspot-url");
  const urlsElm = getElementById<HTMLDataListElement>("hotspot-urls");
  const openInNewTabElm = getElementById<HTMLInputElement>(
    "hotspot-open-new-tab",
  );
  const saveBtn = getElementById("hotspot-save");
  const closeBtn = getElementById("hotspot-close");
  const deleteBtn = getElementById("hotspot-delete");
  const panoramaElm = getPanoramaElement();

  const event = createEventEmitter<HotspotEvents>();
  const on = event.on;
  const off = event.off;

  const onSaveClick = () => {
    if (hotspot?.id) {
      viewer.removeHotspot(hotspot.id);
    }

    const id = hotspot?.id ?? generateId();

    viewer.addHotspot(
      {
        id,
        text: textElm.value.trim(),
        yaw: hotspot?.yaw ?? store.state.yaw,
        pitch: hotspot?.pitch ?? store.state.pitch,
        type: type as PannellumHotSpotType,
        URL: urlElm.value,
      },
      openInNewTabElm.checked,
    );

    hide();
  };

  const onCloseClick = () => {
    hide();
  };

  const onContextMenu = () => {
    hide();
  };

  const onDelete = () => {
    if (hotspot?.id) {
      viewer.removeHotspot(hotspot.id);
    }

    hide();
  };

  const onClickOutside = (e: MouseEvent) => {
    const target = e.target as Node;
    if (
      !hotspotElm.classList.contains("hidden") &&
      !hotspotElm.contains(target)
    ) {
      hide();
    }
  };

  const show = async (props: { id?: string; type?: PannellumHotSpotType }) => {
    hotspot = store.state.hotspots.find((x) => x.id === props.id);
    type = hotspot?.type ?? props.type;

    if (!type) {
      throw new Error("Argument 'type' is required.");
    }

    if (!hotspotElm.classList.contains("hidden")) {
      hide();
    }

    if (hotspot) {
      await viewer.lookAt(hotspot.pitch, hotspot.yaw, undefined, 300);
      textElm.value = hotspot.text;
      urlElm.value = hotspot.URL ?? "";
      deleteBtn.classList.remove("hidden");
    } else {
      textElm.value = "";
      urlElm.value = "";
      deleteBtn.classList.add("hidden");
    }

    urlsElm.innerHTML =
      type === "scene"
        ? store.state.tourCandidatesUrls
            .map((url) => `<option value="${url}">`)
            .join("")
        : "";

    hotspotHeader.innerHTML = type === "scene" ? "Panorama" : "Information";

    openInNewTabElm.checked = type === "scene" ? false : true;

    openInNewTabElm.classList.toggle("hidden", type === "scene");

    document.addEventListener("click", onClickOutside);
    panoramaElm.addEventListener("contextmenu", onContextMenu);
    saveBtn.addEventListener("click", onSaveClick);
    closeBtn.addEventListener("click", onCloseClick);
    deleteBtn.addEventListener("click", onDelete);
    hotspotElm.classList.remove("hidden");
    event.emit("visibilityChange", true);
  };

  const hide = () => {
    hotspot = undefined;
    document.removeEventListener("click", onClickOutside);
    panoramaElm.removeEventListener("contextmenu", onContextMenu);
    saveBtn.removeEventListener("click", onSaveClick);
    closeBtn.removeEventListener("click", onCloseClick);
    deleteBtn.removeEventListener("click", onDelete);
    hotspotElm.classList.add("hidden");
    event.emit("visibilityChange", false);
  };

  viewer.on("hotspotClick", (id) => show({ id }));

  return {
    show,
    hide,
    on,
    off,
  };
}
