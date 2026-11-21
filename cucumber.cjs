module.exports = {
  default: {
    paths: [
      "features/media_status_and_performance.feature",
      "features/media_data_integrity.feature",
      "features/media_headers.feature",
      "features/media_manual_test_cases.feature"
    ],
    requireModule: ["ts-node/register"],
    require: [
      "support/**/*.ts",
      "step-definitions/**/*.ts"
    ],
    format: [
      "progress",
      "html:reports/cucumber-report.html",
      "json:reports/cucumber-report.json"
    ]
  }
};
