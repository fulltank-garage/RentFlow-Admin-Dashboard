"use client";

import { getAdminApiBaseUrl } from "@/src/services/core/api-client.service";
import type { AdminRealtimeEvent } from "./realtime.types";

type SubscribeOptions = {
  onEvent: (event: AdminRealtimeEvent) => void;
  onError?: () => void;
  onStatus?: (status: "connecting" | "open" | "closed" | "error") => void;
};

function adminRealtimeUrl() {
  const url = new URL(getAdminApiBaseUrl());
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = "/ws/realtime";
  url.search = "";
  url.searchParams.set("app", "admin");
  return url.toString();
}

export function subscribeAdminRealtime(options: SubscribeOptions) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  let socket: WebSocket | null = null;
  let closed = false;
  let reconnectTimer: number | undefined;
  let attempts = 0;

  const connect = () => {
    if (closed) return;
    options.onStatus?.("connecting");
    socket = new WebSocket(adminRealtimeUrl());
    socket.onmessage = (message) => {
      try {
        options.onEvent(JSON.parse(message.data) as AdminRealtimeEvent);
      } catch {
        // Ignore malformed realtime payloads.
      }
    };
    socket.onopen = () => {
      attempts = 0;
      options.onStatus?.("open");
    };
    socket.onerror = () => {
      options.onStatus?.("error");
      options.onError?.();
    };
    socket.onclose = () => {
      options.onStatus?.("closed");
      if (closed) return;
      attempts += 1;
      reconnectTimer = window.setTimeout(
        connect,
        Math.min(1000 + attempts * 700, 5000)
      );
    };
  };

  connect();

  return () => {
    closed = true;
    if (reconnectTimer) window.clearTimeout(reconnectTimer);
    socket?.close();
  };
}
