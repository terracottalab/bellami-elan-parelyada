import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

/** Returns the hostname the visitor used, so we can pick the default language. */
export const getRequestHost = createServerFn({ method: "GET" }).handler(() => {
  try {
    const req = getRequest();
    const url = new URL(req.url);
    const forwarded = req.headers.get("x-forwarded-host");
    const host = (url.hostname === "localhost" && forwarded ? forwarded : url.hostname) || "";
    return host.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
});

export function localeForHost(host: string): "ru" | "en" {
  return host.includes("norwichland") ? "en" : "ru";
}
