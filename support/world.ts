import { setWorldConstructor, World as CucumberWorld } from "@cucumber/cucumber";
import { ApiResponse } from "./apiClient";

export class CustomWorld extends CucumberWorld {
  public apiResponse?: ApiResponse;
}

setWorldConstructor(CustomWorld);
