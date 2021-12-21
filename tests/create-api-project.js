/* eslint-disable jest/valid-expect */
import { EOL } from "os";
import rimraf from "rimraf";
import { expect } from "chai";
import execute from "./utils/execute.js";

beforeEach(async () => {
  await rimraf.sync("./myshop");
});


describe("the node used for tests", () => {
  it("should be 14 or 16", async () => {
    const response = await execute(
      "--version",
      []
    );
    // eslint-disable-next-line jest/valid-expect
    expect(response.trim().split(".")[0]).to.oneOf(["v16", "v14"]);
  });
});

describe("The create-project-api command", () => {
  it("should print the correct output", async () => {
    const response = await execute(
      "./index.js",
      ["create-project", "api", "myshop"]
    );
    const responseLines = response.trim().split(EOL);
    // eslint-disable-next-line jest/valid-expect
    expect(responseLines[0]).to.equal("cli: {\"projectName\":\"myshop\",\"options\":{}}: Creating API project");
    expect(responseLines[1]).to.equal("cli: \"Project creation complete. Change to your directory and run `npm install`\": undefined");
  }).timeout(5000);
});
