"use client";

export function deleteClientCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${encodeURIComponent(
    name
  )}=; path=/; max-age=0; SameSite=Strict`;
}
