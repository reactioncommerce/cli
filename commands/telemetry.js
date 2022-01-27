import Configstore from "configstore";
import Logger from "../utils/logger.js";
import constants from "../utils/constants.js";

const { PACKAGE_NAME } = constants;
const config = new Configstore(PACKAGE_NAME);

/**
 * @summary allow user to turn off/on telemetry
 * @param {String} args - Either "on" or "off"
 * @returns {boolean} - return true if successful
 */
export default function telemetry(args) {
  if (args === "off") {
    config.set("telemetry", false);
    Logger.success("Telemetry turned off");
  } else {
    config.set("telemetry", true);
    Logger.success("Telemetry turned on");
  }
  return true;
}
