export type AdminRealtimeEventType =
  | "connection.ready"
  | "booking.created"
  | "booking.updated"
  | "booking.cancelled"
  | "payment.created"
  | "payment.updated"
  | "notification.new"
  | "car.changed"
  | "branch.changed"
  | "availability.changed"
  | "support.changed"
  | "tenant.updated";

export type AdminRealtimeEvent = {
  type: AdminRealtimeEventType | string;
  tenantId?: string;
  entityId?: string;
  data?: Record<string, unknown>;
  createdAt?: string;
};

