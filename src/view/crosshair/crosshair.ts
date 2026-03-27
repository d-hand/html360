import { Store } from "../store/store";
import { getElementById } from "../utils/document";

export type Crosshair = ReturnType<typeof create>;

export const Crosshair = {
  create,
};

function create(store: Store) {
  const crosshair = getElementById("crosshair");

  store.on("setIsEditMode", (isVisible) => {
    crosshair.classList.toggle("hidden", !isVisible);
  });
}
