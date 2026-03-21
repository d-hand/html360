import { defaultState, State } from "../../core/state";
import { getElementById } from "../utils/document-helper";

export type Store = ReturnType<typeof create>;

export const Store = {
  create,
};

type Listener = (state: State) => void;

function create() {
  const stateElement = getElementById("state");
  let listeners: Set<Listener> = new Set();
  let state = getState(stateElement);

  const update = (patch: Partial<State>) => {
    const nextState = { ...state, ...patch };

    if (JSON.stringify(nextState) === JSON.stringify(state)) {
      return;
    }

    state = nextState;

    save();

    listeners.forEach((fn) => fn(state));

    if (IS_DEV) {
      console.log(state);
    }
  };

  const subscribe = (fn: Listener) => {
    listeners.add(fn);

    fn(state);

    return () => {
      listeners.delete(fn);
    };
  };

  const save = () => {
    stateElement.textContent = JSON.stringify(state);
  };

  const download = () => {
    save();

    const fullHtml = "<!doctype html>\n" + document.documentElement.outerHTML;
    const blob = new Blob([fullHtml], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = state.name;
    link.click();
  };

  return {
    get state() {
      return state;
    },
    update,
    subscribe,
    save,
    download,
  };
}

const getState = (stateElement: HTMLElement) => {
  try {
    return JSON.parse(stateElement.textContent);
  } catch (error) {
    console.log(error);
    return defaultState;
  }
};
