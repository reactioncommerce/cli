/* eslint-disable jest/valid-expect */
import { EOL } from "os";
import rimraf from "rimraf";
import { expect } from "chai";
import execute from "./utils/execute.js";

beforeEach(async () => {
  await rimraf.sync("./myadmin");
});


describe("The create-project-admin command", () => {
  it("should print the correct output", async () => {
    const response = await execute(
      "./index.js",
      ["create-project", "admin", "myadmin"]
    );
    const responseLines = response.trim().split(EOL);
    // eslint-disable-next-line jest/valid-expect
    expect(responseLines[0]).to.equal("cli: {\"projectName\":\"myadmin\",\"options\":{}}: Creating admin");
  }).timeout(5000);
});
