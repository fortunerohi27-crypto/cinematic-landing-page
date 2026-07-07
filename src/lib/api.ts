// Tiny client-side fetch wrapper. Throws on non-2xx with the server's error message.
// Usage: `const data = await apiFetch<{ id: string }>("/api/public/contact", { method: "POST", json: {...} })`

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

interface ApiFetchOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  json?: unknown;
  signal?: AbortSignal;
}

export async function apiFetch<T = unknown>(
  url: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { method = "GET", json, signal } = options;

  const init: RequestInit = {
    method,
    headers: json ? { "Content-Type": "application/json" } : undefined,
    body: json !== undefined ? JSON.stringify(json) : undefined,
    signal,
    credentials: "include", // send session cookie
  };

  const res = await fetch(url, init);
  const text = await res.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!res.ok) {
    const message =
      (body && typeof body === "object" && "error" in body && typeof (body as { error: unknown }).error === "string"
        ? (body as { error: string }).error
        : null) ?? `Request failed (${res.status})`;
    throw new ApiError(res.status, message, body);
  }

  return body as T;
}
