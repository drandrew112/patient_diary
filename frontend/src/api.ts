const API_URL = import.meta.env.VITE_API_URL || "http://localhost/betegnaplo/backend";

type ApiOptions = RequestInit & {
  rawBody?: boolean;
};

export async function api<T = any>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const headers = options.rawBody
    ? options.headers
    : {
        "Content-Type": "application/json",
        ...(options.headers || {})
      };

  const res = await fetch(`${API_URL}/${path}`, {
    ...options,
    credentials: "include",
    headers
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || "API error");
  }

  return data;
}

export function fileUrl(relativePath: string) {
  return `${API_URL}/${relativePath.replace(/^\/+/, "")}`;
}
