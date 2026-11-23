import { IWorldOptions, setWorldConstructor, World as CucumberWorld } from "@cucumber/cucumber";
import { ApiResponse } from "./apiClient";
import { resolveConfig, TestConfig } from "./config";

export class CustomWorld extends CucumberWorld {
  public apiResponse?: ApiResponse;
  public config: TestConfig;

  constructor(options: IWorldOptions) {
    super(options);
    this.config = resolveConfig(options.parameters as Record<string, unknown>);
  }
}

setWorldConstructor(CustomWorld);
