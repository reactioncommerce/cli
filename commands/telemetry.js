import Logger from "../utils/logger.js";
import getConfig from "../utils/getConfig.js";
import checkDependencies from "../utils/checkDependencies.js";

/**
 * @summary allow user to turn off/on telemetry
 * @param {String} args - Either "on" or "off"
 * @returns {boolean} - return true if successful
 */
export default async function telemetry(args) {
  const dependenciesOk = await checkDependencies();
  if (!dependenciesOk) return false;
  const config = getConfig();
  if (args === "off") {
    config.set("telemetry", false);
    Logger.success("Telemetry turned off");
  } else {
    config.set("telemetry", true);
    Logger.success("Telemetry turned on");
  }
  return true;
}
