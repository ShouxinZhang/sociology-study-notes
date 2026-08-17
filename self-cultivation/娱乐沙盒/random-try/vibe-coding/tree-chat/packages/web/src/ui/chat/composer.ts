import { el } from "../dom.ts";

export function renderComposer(opts: {
  disabled: boolean;
  onSubmit: (text: string) => void;
}): HTMLElement {
  const wrap = el("form", "composer");
  const input = el("textarea");
  input.rows = 3;
  input.placeholder = "Type something";
  input.setAttribute("aria-label", "Type something");
  input.disabled = opts.disabled;

  const run = el("button", "run-button", "Run");
  run.type = "submit";
  run.disabled = opts.disabled;

  wrap.append(input, run);
  wrap.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (text) {
      input.value = "";
      opts.onSubmit(text);
    }
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      wrap.requestSubmit();
    }
  });
  return wrap;
}
