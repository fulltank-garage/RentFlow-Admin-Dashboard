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
};

export function useAdminRealtimeRefresh({
  events,
  onRefresh,
  enabled = true,
}: Options) {
  const eventKey = events.join("|");

  React.useEffect(() => {
    if (!enabled) return;
    const allowedEvents = new Set(eventKey.split("|").filter(Boolean));
    return subscribeAdminRealtime({
      onEvent(event) {
        if (allowedEvents.has(event.type as AdminRealtimeEventType)) {
          onRefresh(event);
        }
      },
    });
  }, [enabled, eventKey, onRefresh]);
}

