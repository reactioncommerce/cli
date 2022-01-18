import fs from "fs";
import Configstore from "configstore";
import Logger from "../utils/logger.js";

const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"));
const config = new Configstore(packageJson.name);

/**
 * @summary allow use to turn off telemetry
 * @param {String} args - Either "on" or "off"
 * @returns {boolean} - return if successful
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
