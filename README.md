# Media API Automation Framework

## Project

This repository contains Cucumber/TypeScript automated tests and three Gherkin manual test cases for `https://testapi.io/api/RMSTest/media`.

## Automated coverage

- HTTP status is `200`.
- Client-side response time is below `1000 ms`.
- The `data` array contains 14 tracks.
- Every track has a non-null, non-empty `id`.
- Exactly one track has `offset.now_playing` set to `true`.
- The response contains a `Date` header in valid HTTP-date format.

## Prerequisites

- Node.js 18 or later
- npm
- Network access to `testapi.io`

## Install and run

```bash
npm ci
npm run build       # typecheck
npm test            # deterministic mock suite (fixtures/media.json), no network
npm run test:live   # real API, including the @performance scenario
npm run summary     # pass/fail table from the last report
```

HTML and JSON reports are written to `reports/` (git-ignored).

### Configuration (environment variables)

| Variable | Default | Purpose |
|---|---|---|
| `MEDIA_ENDPOINT` | live URL | Endpoint used by `test:live` |
| `EXPECTED_TRACK_COUNT` | 14 | Expected number of tracks |
| `EXPECTED_NOW_PLAYING_ID` | unset live / `p002d7bc` mock | If set, asserts the now-playing track id |
| `PERF_MAX_MS` | 1000 | Median response-time threshold |
| `PERF_SAMPLES` | 5 | Requests measured after one warm-up request |

## Continuous integration

- **API tests** (`test.yml`): on push, PR and manual dispatch. Typecheck, then the mock suite, then a results summary on the run page and the `cucumber-reports` artifact. Never calls the live API.
- **Live API smoke** (`live-smoke.yml`): daily schedule and manual dispatch only. Runs `npm run test:live` so third-party latency or outages cannot block PRs.

## Project structure

- `features/`: Cucumber feature files, including three manual Gherkin cases
- `step-definitions/`: Cucumber step implementations
- `support/apiClient.ts`: HTTP client and response timing
- `support/world.ts`: Scenario state
- `cucumber.cjs`: Cucumber runner configuration
- `tsconfig.json`: TypeScript configuration

## Assumptions

- The `data` array contains the track collection.
- The expected track count (default 14) is configurable via `EXPECTED_TRACK_COUNT`.
- `offset.now_playing` identifies the active track.
- Response time is the median of `PERF_SAMPLES` requests after a warm-up, measured with `performance.now()`, and only checked against the live API (`@live @performance`). It varies with network distance.
- The `Date` header is validated as an IMF-fixdate in GMT rather than against an exact server timestamp.
- TC2 checks the now-playing track is valid; the exact id is asserted only in mock mode (or when `EXPECTED_NOW_PLAYING_ID` is set) because live data changes.
# Claude
