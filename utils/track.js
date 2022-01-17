import fs from "fs";
import Configstore from "configstore";
import ua from "universal-analytics";
import env from "../config.js";
import Logger from "./logger.js";
import getVersions from "./versions.js";
import constants from "./constants.js";

const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"));
const config = new Configstore(packageJson.name);
const { GA_TRACKING_ID } = constants;


/**
 * @summary send anonymous usage information to GA
 * @param {String} command - The command executed
 * @param {Object} args - Arguments passed to command
 * @param {Object} options - Any options passed
 * @param {Object} userData - Any data about the user (excluding any PII)
 * @returns {Promise<void>} undefined
 */
export default async function track(command, args, options, userData = {}) {
  const versions = getVersions();
  userData.versions = versions;
  const userId = config.get("userId");
  console.log("userId", userId);
  userData.userId = userId;
  const visitor = ua(GA_TRACKING_ID, userId);
  visitor.pageview(command, (error) => {
    if (error !== null && env.SHOW_VERBOSE_TELEMETRY_DATA) Logger.error(error);
  }).send();
  if (env.SHOW_VERBOSE_TELEMETRY_DATA) {
    Logger.success(command, { options, userData });
  }
}
