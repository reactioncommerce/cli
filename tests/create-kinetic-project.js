/* eslint-disable jest/valid-expect */
import { EOL } from "os";
import rimraf from "rimraf";
import { expect } from "chai";
import getConfig from "../utils/getConfig.js";
import execute from "./utils/execute.js";

const config = getConfig();

beforeEach(async () => {
  await rimraf.sync("./mykinetic");
  // Mock that we have alredy used the command to bypass telemetry logs
  config.set("runOnce", true);
});

describe("The create-project-kinetic command", () => {
  it("should print the correct output", async () => {
    const response = await execute("./index.js", ["create-project", "kinetic", "mykinetic"]);
    const responseLines = response.trim().split(EOL);
    // eslint-disable-next-line jest/valid-expect
    expect(responseLines[0]).to.equal('reaction-cli: Creating kinetic: {"projectName":"mykinetic","options":{}}');
  }).timeout(350000); // cloning the admin takes a long time
});

afterEach(async () => {
  config.set("runOnce", false);
});
