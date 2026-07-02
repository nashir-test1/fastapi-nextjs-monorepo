const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8765";

/** Build a full URL to a backend endpoint, e.g. apiUrl("/health"). */
export function apiUrl(path: string): string {
  return `${API_URL}${path}`;
}
