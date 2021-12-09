import os from "os";
import { execSync as exec } from "child_process";
import fs from "fs-extra";
import { sync as cmdExists } from "command-exists";

/**
 * @summary get the version of Open Commerce
 * @param {Object} versions - versions object
 * @returns {Object} versions objects with open commerce versions added
 */
function getMocVersion(versions) {
  // get Reaction version (if in a Reaction directory)
  try {
    const packageFile = fs.readJSONSync("./package.json");

    if (packageFile.name === "reaction") {
      versions.reaction = packageFile.version;

      // get Reaction git branch name
      const reactionBranch = exec("git rev-parse --abbrev-ref HEAD").toString().replace(/\r?\n|\r/g, "");
      versions.reactionBranch = reactionBranch.indexOf("fatal") === -1 ? reactionBranch : null;
    }
  } catch (error) {
    versions.reaction = null;
  }
  return versions;
}

/**
 * @summary return various OS version info
 * @param {Object} versions - The versions object
 * @returns {Object} The mutated versions object
 */
function getOsVersion(versions) {
  const osType = os.platform();

  if (osType === "darwin") {
    const release = exec("sw_vers -productVersion").toString().replace(/\r?\n|\r/g, "");
    versions.os = "macOS";
    versions.osVersion = release;
  } else if (osType === "win32") {
    versions.os = "Windows";
    versions.osVersion = os.release();
  } else {
    versions.os = osType;
    versions.osVersion = os.release();
  }
  return versions;
}

/**
 * @summary report various version numbers
 * @returns {Object} - An object with all the various version
 */
export default function getVersions() {
  const versions = {};
  getOsVersion(versions);
  // get Node version
  versions.node = process.version.substring(1);

  // get NPM version
  versions.npm = exec("npm -v").toString().replace(/\r?\n|\r/g, "");

  // get Docker version
  if (cmdExists("docker")) {
    const dockerVer = exec("docker -v").toString().replace(/Docker version /g, "");
    versions.docker = dockerVer ? dockerVer.substring(0, dockerVer.indexOf(",")) : null;
  }

  versions.mocVersion = getMocVersion(versions);
  return versions;
}
