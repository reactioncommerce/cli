/* eslint-disable jest/valid-expect */
import { EOL } from "os";
import { v4 as uuidv4 } from "uuid";
import rimraf from "rimraf";
import { expect } from "chai";
import getConfig from "../utils/getConfig.js";
import execute from "./utils/execute.js";

const config = getConfig();

beforeEach(async () => {
  await rimraf.sync("./mystore");
  // Mock a user is set, to bypass telemetry error complaining no user is set
  config.set("userId", uuidv4());
});

describe("The create-project-storefront command", () => {
  it("should print the correct output", async () => {
    const response = await execute("./index.js", ["create-project", "storefront", "mystore"]);
    const responseLines = response.trim().split(EOL);
    // eslint-disable-next-line jest/valid-expect
    expect(responseLines[0]).to.equal('reaction-cli: Creating Storefront: {"projectName":"mystore","options":{}})');
  }).timeout(350000);
});

afterEach(async () => {
  config.set("userId", undefined);
});
