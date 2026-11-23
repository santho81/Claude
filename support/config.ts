export const LIVE_ENDPOINT = "https://testapi.io/api/RMSTest/media";

export interface TestConfig {
  /** "mock" serves fixtures/media.json locally; "live" calls the real API. */
  target: "mock" | "live";
  endpoint: string;
  expectedTrackCount: number;
  /** When set, the now-playing track id is asserted; otherwise only validity is checked. */
  expectedNowPlayingId?: string;
  perfMaxMs: number;
  perfSamples: number;
}

function num(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/**
 * Resolve config from Cucumber worldParameters (set per profile in cucumber.cjs).
 * Environment variables override: MEDIA_ENDPOINT, EXPECTED_TRACK_COUNT,
 * EXPECTED_NOW_PLAYING_ID, PERF_MAX_MS, PERF_SAMPLES.
 */
export function resolveConfig(params: Record<string, unknown> = {}): TestConfig {
  const env = process.env;
  const target = params.target === "live" ? "live" : "mock";
  const nowPlaying = env.EXPECTED_NOW_PLAYING_ID ?? (params.expectedNowPlayingId as string | undefined);

  return {
    target,
    endpoint: env.MEDIA_ENDPOINT ?? LIVE_ENDPOINT,
    expectedTrackCount: num(env.EXPECTED_TRACK_COUNT ?? params.expectedTrackCount, 14),
    expectedNowPlayingId: nowPlaying || undefined,
    perfMaxMs: num(env.PERF_MAX_MS ?? params.perfMaxMs, 1000),
    perfSamples: num(env.PERF_SAMPLES ?? params.perfSamples, 5)
  };
}
