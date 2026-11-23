import { After, AfterAll, Before } from "@cucumber/cucumber";
import { CustomWorld } from "./world";
import { resolveConfig } from "./config";
import { startMockServer, stopMockServer } from "./mockServer";

Before(async function (this: CustomWorld) {
  this.apiResponse = undefined;
  this.config = resolveConfig(this.parameters);
  if (this.config.target === "mock") {
    this.config.endpoint = await startMockServer();
  }
});

After(async function (this: CustomWorld) {
  // Attach the captured response so failures can be diagnosed from the report.
  if (this.apiResponse) {
    const { status, headers, durationMs } = this.apiResponse;
    this.attach(JSON.stringify({ endpoint: this.config.endpoint, status, durationMs, headers }, null, 2), "application/json");
  }
});

AfterAll(async function () {
  await stopMockServer();
});
