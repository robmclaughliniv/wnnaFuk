"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let reloaded = false;

    const reloadOnce = () => {
      if (reloaded) return;
      reloaded = true;
      window.location.reload();
    };

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        registration.update();

        if (registration.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }

        registration.addEventListener("updatefound", () => {
          const installing = registration.installing;
          if (!installing) return;

          installing.addEventListener("statechange", () => {
            if (
              installing.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              installing.postMessage({ type: "SKIP_WAITING" });
            }
          });
        });
      })
      .catch((err) => {
        console.error("Service worker registration failed:", err);
      });

    navigator.serviceWorker.addEventListener("controllerchange", reloadOnce);

    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        reloadOnce,
      );
    };
  }, []);

  return null;
}
