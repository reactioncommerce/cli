import { spawn } from "child_process";
import { sync as cmdExists } from "command-exists";
import Logger from "./logger.js";

const supportedNodeVersions = ["v14", "v15"];

/**
 * @summary validate that we are using a supported version of node
 * @returns {Promise<Boolean>} returns true or throws
 */
async function checkNodeVersion() {
  const nodeVersion = await spawn("node", ["--version"]);
  let nodeOk = false;
  const checkPromise = new Promise((resolve) => {
    nodeVersion.stdout.on("data", (data) => {
      const [majorVersion, minorVersion] = data.toString().trim().split(".");
      if (!supportedNodeVersions.includes(majorVersion)) {
        Logger.error(`Your node version must be one of: [ ${supportedNodeVersions.join(", ")} ]`);
        resolve(nodeOk);
      }
      if (majorVersion === "v14" && minorVersion < "18") {
        Logger.error("Your node version must be greater or equal to 14.18.1 and less than 16");
        resolve(nodeOk);
      }
      nodeOk = true;
      resolve(nodeOk);
    });
  });

  return checkPromise;
}

/**
 * @summary check if dependencies are installed
 * @returns {Promise<boolean>} - whether all dependencies are available
 * @param {Array<string>} additionalDependencies - any project specific dependencies
 */
export default async function checkDependencies(additionalDependencies = []) {
  const nodeOk = await checkNodeVersion();
  if (!nodeOk) {
    return false;
  }

  const requiredApps = [
    "git",
    "docker",
    "docker-compose"
  ];

  requiredApps.push(...additionalDependencies);

  const errorMessages = [];
  for (const app of requiredApps) {
    // eslint-disable-next-line no-await-in-loop
    const exists = await cmdExists(app);
    if (!exists) {
      errorMessages.push(`${app} must be installed for this app to run`);
    }
  }

  if (errorMessages.length) {
    errorMessages.forEach((message) => Logger.error(message));
    return false;
  }
  return true;
}
