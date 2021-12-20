import { spawn } from "child_process";
import { sync as cmdExists } from "command-exists";
import Logger from "./logger.js";

const supportedNodeVersions = ["v14", "v16", "v17"];

/**
 * @summary validate that we are using a supported version of node
 * @returns {Promise<Boolean>} returns true or throws
 */
async function checkNodeVersion() {
  const nodeVersion = spawn("node", ["--version"]);
  let nodeOk = false;
  nodeVersion.stdout.on("data", (data) => {
    // eslint-disable-next-line no-console
    const [majorVersion] = data.toString().trim().split(".");
    if (!supportedNodeVersions.includes(majorVersion)) {
      Logger.error(`Your node version must be one of: ${supportedNodeVersions}`);
    }
    nodeOk = true;
  });
  return nodeOk;
}

/**
 * @summary check if dependencies are installed
 * @returns {Promise<boolean>} - whether all dependencies are available
 */
export default async function checkDependencies() {
  const nodeOk = await checkNodeVersion();
  if (!nodeOk) {
    return false;
  }
  const requiredApps = [
    "git",
    "docker",
    "docker-compose"
  ];

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
