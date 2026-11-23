# Media API Automation Framework

## Project

This repository contains Cucumber/TypeScript automated tests and three additional functional Gherkin scenarios for `https://testapi.io/api/RMSTest/media`. All scenarios are included in the Cucumber run.

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
npm test
npm run build
```

HTML and JSON reports are written to `reports/cucumber-report.html` and `reports/cucumber-report.json`.

## Continuous integration

GitHub Actions runs the tests and TypeScript build on pushes, pull requests, and manual dispatches. Each run uses a GitHub-hosted Ubuntu runner and uploads the Cucumber HTML and JSON reports as the `cucumber-reports` artifact, retained for 7 days.

## Project structure

- `features/`: Cucumber feature files, including three additional functional scenarios
- `step-definitions/`: Cucumber step implementations
- `support/apiClient.ts`: HTTP client and response timing
- `support/world.ts`: Scenario state
- `cucumber.cjs`: Cucumber runner configuration
- `tsconfig.json`: TypeScript configuration

## Assumptions

- The `data` array contains the track collection.
- The track count is currently fixed at 14 and may be adjusted only if the API contract changes.
- `offset.now_playing` identifies the active track.
- Response time is measured from request start to response receipt using `performance.now()` and can vary with network conditions.
- The `Date` header is validated as an IMF-fixdate in GMT rather than against an exact server timestamp.
- Functional scenario TC2 records the currently live now-playing track (`p002d7bc`); a data fixture or contract change may require updating this expectation.
# Claude
