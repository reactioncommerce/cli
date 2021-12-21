/* eslint-disable jest/valid-expect */
import { EOL } from "os";
import rimraf from "rimraf";
import { expect } from "chai";
import execute from "./utils/execute.js";

beforeEach(async () => {
  await rimraf.sync("./mystore");
});


describe("The create-project-storefront command", () => {
  it("should print the correct output", async () => {
    const response = await execute(
      "./index.js",
      ["create-project", "storefront", "mystore"]
    );
    const responseLines = response.trim().split(EOL);
    // eslint-disable-next-line jest/valid-expect
    expect(responseLines[0]).to.equal("cli: {\"projectName\":\"mystore\",\"options\":{}}: Creating Storefront");
  }).timeout(350000);
});
