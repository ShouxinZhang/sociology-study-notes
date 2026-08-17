export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className = "",
  text = "",
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) {
    node.className = className;
  }
  if (text) {
    node.textContent = text;
  }
  return node;
}

export function button(label: string, onClick: () => void): HTMLButtonElement {
  const node = el("button", "ghost-btn", label);
  node.type = "button";
  node.addEventListener("click", onClick);
  return node;
}

export async function copyText(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}
