import { defaultState, State } from "../../core/state";
import { Nullable } from "../../core/types";

type Listener = (state: State) => void;

export class Store {
  state: State;
  private stateElement: Nullable<HTMLElement>;
  private listeners: Listener[] = [];

  constructor() {
    try {
      const stateElement = document.getElementById("state");
      this.stateElement = stateElement;
      this.state = JSON.parse(stateElement!.textContent);
    } catch (error) {
      console.log(error);
      this.state = defaultState;
    }
  }

  subscribe(fn: Listener) {
    this.listeners.push(fn);

    fn(this.state);

    return () => {
      this.listeners = this.listeners.filter((x) => x !== fn);
    };
  }

  private notify() {
    this.save();
    this.listeners.forEach((fn) => fn(this.state));
  }

  update = (patch: Partial<State>) => {
    this.state = { ...this.state, ...patch };
    this.notify();
  };

  save = () => {
    if (this.stateElement) {
      this.stateElement.textContent = JSON.stringify(this.state);
    }
  };

  download() {
    this.save();

    const fullHtml = "<!doctype html>\n" + document.documentElement.outerHTML;
    const blob = new Blob([fullHtml], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = this.state.name;
    link.click();
  }
}
