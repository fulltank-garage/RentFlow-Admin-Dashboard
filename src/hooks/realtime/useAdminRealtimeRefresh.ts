"use client";

import * as React from "react";
import { subscribeAdminRealtime } from "@/src/services/realtime/realtime.service";
import type {
  AdminRealtimeEvent,
  AdminRealtimeEventType,
} from "@/src/services/realtime/realtime.types";

type Options = {
  events: AdminRealtimeEventType[];
  onRefresh: (event: AdminRealtimeEvent) => void;
  enabled?: boolean;
  fallbackIntervalMs?: number;
};

export function useAdminRealtimeRefresh({
  events,
  onRefresh,
  enabled = true,
  fallbackIntervalMs = 15000,
}: Options) {
  const eventKey = events.join("|");
  const onRefreshRef = React.useRef(onRefresh);
  const lastEventAtRef = React.useRef(0);
  const [socketReady, setSocketReady] = React.useState(false);

  React.useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  React.useEffect(() => {
    if (!enabled) return;
    const allowedEvents = new Set(eventKey.split("|").filter(Boolean));
    return subscribeAdminRealtime({
      onEvent(event) {
        if (allowedEvents.has(event.type as AdminRealtimeEventType)) {
          lastEventAtRef.current = Date.now();
          onRefreshRef.current(event);
        }
      },
      onStatus(status) {
        setSocketReady(status === "open");
      },
    });
  }, [enabled, eventKey]);

  React.useEffect(() => {
    if (!enabled || socketReady || fallbackIntervalMs <= 0) return;

    const timer = window.setInterval(() => {
      if (Date.now() - lastEventAtRef.current < fallbackIntervalMs) return;
      onRefreshRef.current({
        type: "tenant.updated",
        createdAt: new Date().toISOString(),
        data: { fallback: true },
      });
    }, fallbackIntervalMs);

    return () => window.clearInterval(timer);
  }, [enabled, fallbackIntervalMs, socketReady]);
}
