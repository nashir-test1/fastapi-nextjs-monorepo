/**
 * Route browser requests through this Next.js service. The API handler reads
 * API_URL at runtime, so each deployed service can keep its own backend target
 * without exposing it in the client bundle or baking it into the image.
 */
export function apiUrl(path: string): string {
  return `/api/backend${path}`;
}
