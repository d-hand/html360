export function getElementById<T = HTMLElement>(id: string): T {
  const result = document.getElementById(id) as T;
  if (!result) {
    throw new Error(`Cann't find element by id: ${id}`);
  }

  return result;
}

export function getPanoramaElement(): HTMLDivElement {
  return getElementById("panorama") as HTMLDivElement;
}
