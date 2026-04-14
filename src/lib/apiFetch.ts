import { API_BASE_URL } from "./config";

type ApiFetchOptions = RequestInit & {
  token?: string | null;
};

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Something went wrong",
    }));
    throw new Error(error.message || `HTTP error ${response.status}`);
  }

  // Handle 204 No Content (DELETE responses)
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
