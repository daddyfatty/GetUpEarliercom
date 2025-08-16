import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Simple React initialization without StrictMode to avoid plugin conflicts
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(App());
}
