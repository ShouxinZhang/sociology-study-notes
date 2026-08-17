import { startApp } from "./app.ts";
import "./styles/tokens.css";
import "./styles/layout.css";
import "./styles/chat.css";
import "./styles/tree.css";

const root = document.getElementById("app");
if (!root) {
  throw new Error("#app missing");
}
void startApp(root);
