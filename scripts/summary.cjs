// Writes a pass/fail table from reports/cucumber-report.json to $GITHUB_STEP_SUMMARY (or stdout).
const fs = require("fs");
const file = "reports/cucumber-report.json";
const out = [];
if (!fs.existsSync(file)) {
  out.push("### Cucumber results\n\nNo report was produced.");
} else {
  const features = JSON.parse(fs.readFileSync(file, "utf8"));
  const rows = [];
  let passed = 0, failed = 0, other = 0;
  for (const f of features) {
    for (const s of f.elements.filter((e) => e.type === "scenario")) {
      const statuses = s.steps.map((st) => st.result.status);
      const status = statuses.includes("failed") ? "failed" : statuses.every((x) => x === "passed") ? "passed" : "other";
      status === "passed" ? passed++ : status === "failed" ? failed++ : other++;
      const err = s.steps.find((st) => st.result.status === "failed")?.result.error_message?.split("\n")[0] ?? "";
      rows.push(`| ${status === "passed" ? "✅" : status === "failed" ? "❌" : "⚠️"} | ${f.name} | ${s.name} | ${err.replace(/\|/g, "\|")} |`);
    }
  }
  out.push(`### Cucumber results: ${passed} passed, ${failed} failed, ${other} other`, "", "| | Feature | Scenario | Error |", "|---|---|---|---|", ...rows);
}
const text = out.join("\n") + "\n";
process.env.GITHUB_STEP_SUMMARY ? fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, text) : process.stdout.write(text);
