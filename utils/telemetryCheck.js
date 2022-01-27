import { v4 as uuidv4 } from "uuid";
import Configstore from "configstore";
import Logger from "./logger.js";
import constants from "./constants.js";

const { PACKAGE_NAME } = constants;

const config = new Configstore(PACKAGE_NAME);

/**
 * @summary check if telemetry info has already been shown, if not show it
 * @returns {Promise<boolean>} - true if successful
 */
export default async function telemetryCheck() {
  const runOnce = config.get("runOnce");
  if (runOnce) {
    // we've already displayed telemetry message at startup, just keep moving
    return true;
  }
  Logger.info("// The Open Commerce CLI collects anonymous statistics in order to");
  Logger.info("// improve the product. We do not collect any personally identifiable information");
  Logger.info("// To opt out just do `reaction telemetry off` at the command prompt");
  config.set("runOnce", true);
  config.set("telemetry", true);
  const userId = uuidv4();
  config.set("userId", userId);
  return true;
}
