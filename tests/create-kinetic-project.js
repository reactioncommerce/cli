/* eslint-disable jest/valid-expect */
import { EOL } from "os";
import { spawn } from "child_process";
import rimraf from "rimraf";
import { expect } from "chai";
import { sync as cmdExists } from "command-exists";
import getConfig from "../utils/getConfig.js";
import execute from "./utils/execute.js";

const config = getConfig();

beforeEach(async () => {
  await rimraf.sync("./mykinetic");
  // Mock that we have alredy used the command to bypass telemetry logs
  config.set("runOnce", true);
  if (!cmdExists("pnpm")) {
    spawn("npm", ["install", "pnpm", "-g"]);
  }
});

describe("The create-project-kinetic command", () => {
  it("should print the correct output", async () => {
    const response = await execute("./index.js", ["create-project", "kinetic", "mykinetic"]);
    // eslint-disable-next-line no-console
    console.log(response);
    const responseLines = response.trim().split(EOL);
    // eslint-disable-next-line jest/valid-expect
    expect(responseLines[0]).to.equal('reaction-cli: Creating kinetic: {"projectName":"mykinetic"}');
  }).timeout(350000); // cloning the admin takes a long time
});

afterEach(async () => {
  config.set("runOnce", false);
});
