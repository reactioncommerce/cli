import fs from "fs";
import Configstore from "configstore";
import ua from "universal-analytics";
import env from "../config.js";
import Logger from "./logger.js";
import getVersions from "./versions.js";
import constants from "./constants.js";
import getLocation from "./getLocation.js";

const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"));
const config = new Configstore(packageJson.name);
const { GA_TRACKING_ID } = constants;

/**
 * @summary turn version information into custom dimensions for GA
 * @param {Object} visitor - visitor object instantiated from lib
 * @param {Object} versions - The versions object
 * @param {String} countryCode - The country code based on IP
 * @returns {Object} - version information as custom dimensions object to pass to set
 */
function setCustomDimensions(visitor, versions, countryCode) {
  const customDimensions = {
    cd1: versions.os,
    cd2: versions.osVersion,
    cd3: versions.node,
    cd4: versions.npm,
    cd5: versions.docker,
    cd6: versions.ocVersion,
    cd7: countryCode
  };
  const keys = Object.keys(customDimensions);
  for (const dimension of keys) {
    visitor.set(dimension, customDimensions[dimension]);
  }
  return customDimensions;
}


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
  let countryCode;
  // Let's not use the user's bandwidth to get the location every time
  const previousCountryCode = config.get("countryCode");
  if (previousCountryCode && typeof previousCountryCode !== "object") {
    countryCode = previousCountryCode;
  } else {
    countryCode = await getLocation();
    config.set("countryCode", countryCode);
  }
  userData.versions = versions;
  const userId = config.get("userId");
  if (!userId) {
    Logger.error("No user set!!");
  }
  userData.userId = userId;
  const visitor = ua(GA_TRACKING_ID, userId);
  const customDimensions = setCustomDimensions(visitor, versions, countryCode);
  visitor.pageview(command, (error) => {
    if (error !== null && env.SHOW_VERBOSE_TELEMETRY_DATA) Logger.error(error);
  }).send();
  if (env.SHOW_VERBOSE_TELEMETRY_DATA) {
    Logger.success(command, { options, customDimensions, userId });
  }
}
