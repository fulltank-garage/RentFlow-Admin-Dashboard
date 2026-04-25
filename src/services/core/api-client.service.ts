import axios from "axios";

import type { ApiResponse } from "../types/types";

export function getAdminApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(
    /\/$/,
    ""
  );
}

export function resolveAdminAssetUrl(value?: string | null) {
  const rawValue = value?.trim() || "";
  if (
    !rawValue ||
    rawValue.startsWith("data:") ||
    rawValue.startsWith("blob:") ||
    rawValue.startsWith("//")
  ) {
    return rawValue;
  }

  if (/^https?:\/\//i.test(rawValue)) {
    return rawValue;
  }

  return new URL(rawValue.startsWith("/") ? rawValue : `/${rawValue}`, getAdminApiBaseUrl()).toString();
}

const adminApiClient = axios.create({
  baseURL: getAdminApiBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-RentFlow-App": "admin",
  },
});

export async function requestAdmin<T>(
  path: string,
  init?: {
    method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
    data?: unknown;
    headers?: Record<string, string>;
  }
) {
  try {
    const response = await adminApiClient.request<ApiResponse<T>>({
      url: path,
      method: init?.method || "GET",
      data: init?.data,
      headers: {
        "X-RentFlow-App": "admin",
        ...init?.headers,
      },
    });

    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const payload = error.response?.data as
        | { message?: string }
        | undefined;
      throw new Error(payload?.message || "เชื่อมต่อ API ไม่สำเร็จ");
    }

    throw error;
  }
}
