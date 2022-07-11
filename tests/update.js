import { EOL } from "os";
import fsPromise from "fs/promises";
import rimraf from "rimraf";
import { expect } from "chai";
import sinon from "sinon";

import {
  getLocalPackageJson,
  getRemoteDependencies,
  cleanVersion,
  getShouldUpdatePlugins,
  updatePackageJson
} from "../commands/update.js";
import execute from "./utils/execute.js";


describe("Update command", () => {
  const mockPackageJson = {
    name: "test",
    dependencies: {
      "@reactioncommerce/api-core": "^1.0.0"
    }
  };
  beforeEach(async function () {
    this.timeout(10000);
    await rimraf.sync("./myapi");
    await fsPromise.mkdir("./myapi");
    await fsPromise.writeFile("./myapi/package.json", JSON.stringify(mockPackageJson));
  });

  it("should print the correct output", async () => {
    const response = await execute("../index.js", ["update", "--all"], { cwd: "./myapi", agnoreError: true });
    const responseLines = response.trim().split(EOL);
    // eslint-disable-next-line jest/valid-expect
    expect(responseLines[responseLines.length - 1]).to.equal("reaction-cli: The plugins has been updated successfully");
  }).timeout(350000);
});


describe("The getLocalPackageJson function", () => {
  afterEach(() => sinon.restore());

  it("should return the correct values", async () => {
    const mockPackageJson = `{
      "name": "test",
      "dependencies": {
        "plugin": "version"
      }
    }`;
    sinon.stub(fsPromise, "readFile").returns(mockPackageJson);
    expect(await getLocalPackageJson()).eql(JSON.parse(mockPackageJson));
  });

  it("should return the null when parse error", async () => {
    const invalidPackageJson = "{ \"name\": \"test }";
    sinon.stub(fsPromise, "readFile").returns(invalidPackageJson);
    expect(await getLocalPackageJson()).eq(null);
  });
});

describe("The updatePackageJson function", () => {
  it("should update correct package json data when choose a part", () => {
    const answers = {
      plugins: ["plugin-1\t 1 -> 2"]
    };
    const outdatedPackages = [
      { name: "plugin-1", version: "1", remoteVersion: "2" },
      { name: "plugin-2", version: "1", remoteVersion: "2" }
    ];
    const localPacakgeJson = {
      name: "test",
      dependencies: {
        "plugin-1": "1",
        "plugin-2": "1"
      }
    };
    const expectedPackageJson = {
      name: "test",
      dependencies: {
        "plugin-1": "2",
        "plugin-2": "1"
      }
    };

    expect(updatePackageJson({ answers, localPacakgeJson, outdatedPackages })).eql(expectedPackageJson);
  });

  it("should update correct package json data when choose update all", () => {
    const answers = { kind: "update all" };
    const outdatedPackages = [
      { name: "plugin-1", version: "1", remoteVersion: "2" },
      { name: "plugin-2", version: "1", remoteVersion: "2" }
    ];
    const localPacakgeJson = {
      name: "test",
      dependencies: {
        "plugin-1": "1",
        "plugin-2": "1"
      }
    };
    const expectedPackageJson = {
      name: "test",
      dependencies: {
        "plugin-1": "2",
        "plugin-2": "2"
      }
    };

    expect(updatePackageJson({ answers, localPacakgeJson, outdatedPackages })).eql(expectedPackageJson);
  });
});

describe("Update command utils", () => {
  it("The getRemoteDependencies function should return the correct values", async () => {
    expect(await getRemoteDependencies()).not.eq(null);
  });

  it("The cleanVersion function should return cleaned value", () => {
    const expectedVersion = "1.0.0";
    expect(cleanVersion("^1.0.0")).eq(expectedVersion);
    expect(cleanVersion("~1.0.0")).eq(expectedVersion);
    expect(cleanVersion("=1.0.0")).eq(expectedVersion);
    expect(cleanVersion("v1.0.0")).eq(expectedVersion);
  });

  it("The getShouldUpdatePlugins function should return correct chooses list", () => {
    const plugins = [
      { name: "plugin-1", version: "1", remoteVersion: "2" },
      { name: "plugin-2", version: "1", remoteVersion: "2" }
    ];
    const expectedChooses = [
      { name: "plugin-1\t 1 -> 2" },
      { name: "plugin-2\t 1 -> 2" }
    ];
    expect(getShouldUpdatePlugins(plugins)).eql(expectedChooses);
  });
});


