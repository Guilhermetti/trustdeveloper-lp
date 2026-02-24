import { useEffect } from "react";

const HEALTH_URL =
  import.meta.env.VITE_API_HEALTH_URL ?? "https://trustautomation-api.onrender.com/health";

function pingHealth(timeoutMs = 2500) {
  const controller = new AbortController();
  const t = window.setTimeout(() => controller.abort(), timeoutMs);

  fetch(HEALTH_URL, { method: "GET", cache: "no-store", signal: controller.signal })
    .catch(() => {})
    .finally(() => window.clearTimeout(t));
}

export function useApiWarmup() {
  useEffect(() => {
    pingHealth();

    const intervalMs = 12 * 60 * 1000; // 12 min
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") pingHealth();
    }, intervalMs);

    return () => window.clearInterval(id);
  }, []);
}