import { EOL } from "os";
import { expect } from "chai";
import execute from "./utils/execute.js";


describe("check what node we're using", () => {
  it("should be 14 or 16", async () => {
    const response = await execute(
      "--version",
      []
    );
    // eslint-disable-next-line jest/valid-expect
    expect(response.trim()).to.equal("boo");
  });
});

describe("The create-project-api command", () => {
  it("should print the correct output", async () => {
    const response = await execute(
      "./index.js",
      ["create-project", "api", "mydir"]
    );
    // eslint-disable-next-line jest/valid-expect
    expect(response.trim().split(EOL)).to.have.all.keys(
      "cli: {\"projectName\":\"mydir\",\"options\":{}}: Creating API project",
      "cli: \"Project creation complete. Change to your directory and run `npm install`\": undefined"
    );
  });
});
