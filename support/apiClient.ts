export const MEDIA_ENDPOINT = "https://testapi.io/api/RMSTest/media";

export interface ApiResponse {
  status: number;
  headers: Record<string, string>;
  body: unknown;
  durationMs: number;
}

export async function getMediaResponse(
  endpoint: string = MEDIA_ENDPOINT
): Promise<ApiResponse> {
  const startedAt = performance.now();

  try {
    const response = await fetch(endpoint, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10_000)
    });
    const durationMs = performance.now() - startedAt;
    const body = await response.json();
    const headers = Object.fromEntries(response.headers.entries());

    return {
      status: response.status,
      headers,
      body,
      durationMs
    };
  } catch (error) {
    const durationMs = performance.now() - startedAt;
    throw new Error(
      `GET ${endpoint} failed after ${durationMs.toFixed(0)}ms: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
