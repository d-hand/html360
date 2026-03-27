import { Store } from "../store/store";
import { getElementById, getPanoramaElement } from "../utils/document";

export type MainMenu = ReturnType<typeof create>;

export const MainMenu = {
  create,
};

function create(store: Store) {
  const menu = getElementById("main-menu");
  const saveBtm = getElementById("main-menu-save");
  const fullScreenBtn = getElementById("main-menu-fullscreen");
  const editModeBtn = getElementById("main-menu-edit-mode");
  const uiLayer = getElementById("ui-layer");
  const panorama = getPanoramaElement();

  const onSaveClick = () => {
    hide();
    store.save();
  };

  const onFullScreenClick = () => {
    hide();

    if (!document.fullscreenElement) {
      uiLayer.requestFullscreen().catch((err) => {
        console.error(err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const onEditModeClick = () => {
    hide();
    store.setIsEditMode(!store.state.isEditMode);
  };

  const onClickOutside = (e: MouseEvent) => {
    const target = e.target as Node;
    if (!menu.classList.contains("hidden") && !menu.contains(target)) {
      hide();
    }
  };

  const show = () => {
    const isEditMode = store.state.isEditMode;
    editModeBtn.textContent = `Switch to ${isEditMode ? "Preview" : "Editor"}`;

    document.addEventListener("click", onClickOutside);
    saveBtm.addEventListener("click", onSaveClick);
    fullScreenBtn.addEventListener("click", onFullScreenClick);
    editModeBtn.addEventListener("click", onEditModeClick);
    menu.classList.remove("hidden");
  };

  const hide = () => {
    document.removeEventListener("click", onClickOutside);
    saveBtm.removeEventListener("click", onSaveClick);
    fullScreenBtn.removeEventListener("click", onFullScreenClick);
    editModeBtn.removeEventListener("click", onEditModeClick);
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
