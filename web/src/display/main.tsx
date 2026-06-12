import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Display } from "./Display.js";
import "../styles/display.css";

let lastReloadVersion: number | null = null;
let sawReloadEndpoint = false;

setInterval(async () => {
  try {
    const r = await fetch("/api/reload-version", { cache: "no-store" });
    if (!r.ok) return;

    const data = await r.json();
    const version = Number(data.reloadVersion);

    if (!Number.isFinite(version)) return;

    if (lastReloadVersion === null) {
      lastReloadVersion = version;
      sawReloadEndpoint = true;
      return;
    }

    if (sawReloadEndpoint && version !== lastReloadVersion) {
      setTimeout(() => window.location.reload(), 10000);
    }

    lastReloadVersion = version;
    sawReloadEndpoint = true;
  } catch {
    // Server may be restarting; try again on next interval.
  }
}, 10000);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Display />
  </StrictMode>,
);
