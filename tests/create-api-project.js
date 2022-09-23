import { EOL } from "os";
import { v4 as uuidv4 } from "uuid";
import rimraf from "rimraf";
import { expect } from "chai";
import getConfig from "../utils/getConfig.js";
import execute from "./utils/execute.js";

const config = getConfig();

beforeEach(async () => {
  await rimraf.sync("./myshop");
  // Mock a user is set, to bypass telemetry error complaining no user is set
  config.set("userId", uuidv4());
});

describe("the node used for tests", () => {
  it("should be 14 or 16", async () => {
    const response = await execute("--version", []);
    // eslint-disable-next-line jest/valid-expect
    expect(response.trim().split(".")[0]).to.oneOf(["v15", "v14"]);
  });
});

describe("The create-project-api command", () => {
  it("should print the correct output", async () => {
    const response = await execute("./index.js", ["create-project", "api", "myshop"]);
    const responseLines = response.trim().split(EOL);
    // eslint-disable-next-line jest/valid-expect
    expect(responseLines[1]).to.equal("reaction-cli: Project creation complete. Change to your directory and run `npm install`");
  }).timeout(15000);
});

afterEach(async () => {
  config.set("userId", undefined);
});
