import Logger from "../utils/logger.js";
import getConfig from "../utils/getConfig.js";

/**
 * @summary allow user to turn off/on telemetry
 * @param {String} args - Either "on" or "off"
 * @returns {boolean} - return true if successful
 */
export default function telemetry(args) {
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
