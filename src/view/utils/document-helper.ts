export function getElementById(id: string): HTMLElement {
  const result = document.getElementById(id);
  if (!result) {
    throw new Error(`Cann't find element by id: ${id}`);
  }

  return result;
}

export function getPanoramaElement(): HTMLDivElement {
  return getElementById("panorama") as HTMLDivElement;
}
