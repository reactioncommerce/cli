import os from "os";
import { execSync as exec } from "child_process";
import fs from "fs-extra";
import { sync as cmdExists } from "command-exists";

/**
 * @summary get the version of Open Commerce
 * @returns {String} versions objects with open commerce versions added
 */
function getOcVersion() {
  // get Reaction version (if in a Reaction directory)
  let reaction = null;
  try {
    const packageFile = fs.readJSONSync("./package.json");

    if (packageFile.description === "Reaction is a modern reactive, real-time event driven ecommerce platform.") {
      reaction = packageFile.version;
    }
  } catch (error) {
    // swallow this;
  }
  return reaction;
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

  versions.ocVersion = getOcVersion(versions);
  return versions;
}
