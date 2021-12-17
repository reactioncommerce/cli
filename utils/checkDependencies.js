import { sync as cmdExists } from "command-exists";
import Logger from "./logger.js";

/**
 * @summary check if dependencies are installed
 * @returns {Promise<boolean>} - whether all dependencies are available
 */
export default async function checkDependencies() {
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
