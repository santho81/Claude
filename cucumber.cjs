const base = {
  paths: [
    "features/media_status_and_performance.feature",
    "features/media_data_integrity.feature",
    "features/media_headers.feature",
    "features/media_manual_test_cases.feature"
  ],
  requireModule: ["ts-node/register"],
  require: ["support/**/*.ts", "step-definitions/**/*.ts"],
  format: [
    "progress",
    "html:reports/cucumber-report.html",
    "json:reports/cucumber-report.json"
  ]
};

module.exports = {
  // Deterministic PR gate: runs against fixtures/media.json via a local mock server.
  default: {
    ...base,
    tags: "not @live",
    worldParameters: { target: "mock", expectedTrackCount: 14, expectedNowPlayingId: "p002d7bc" }
  },
  // Live smoke: calls the real API (rate limit 60 requests/window), includes @performance.
  live: {
    ...base,
    worldParameters: { target: "live", expectedTrackCount: 14 }
  }
};
