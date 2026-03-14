import { State } from "../../core/state";

type Listener = (state: State) => void;

export class Store {
  state: State;
  private stateElement: HTMLElement;
  private listeners: Listener[] = [];

  constructor() {
    const stateElement = document.getElementById("panorama-state");
    if (!stateElement) {
      throw new Error("Can't find #panorama-state");
    }

    this.stateElement = stateElement;
    this.state = JSON.parse(stateElement.textContent);

    if (!this.state.version) {
      throw new Error("version isn't defined");
    }
  }

  subscribe(fn: Listener) {
    this.listeners.push(fn);

    fn(this.state);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
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
    this.stateElement.textContent = JSON.stringify(this.state);
  };

  downloadUpdatedHtml() {
    this.save();

    const fullHtml = "<!doctype html>\n" + document.documentElement.outerHTML;
    const blob = new Blob([fullHtml], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = this.state.name;
    link.click();
  }
}
