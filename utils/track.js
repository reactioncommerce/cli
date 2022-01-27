import Configstore from "configstore";
import ga4 from "../utils/ga4.js";
import env from "../config.js";
import pkg from "../package.json";
import Logger from "./logger.js";
import getVersions from "./versions.js";
import getLocation from "./getLocation.js";

const config = new Configstore(pkg.name);

/**
 * @summary turn version information into custom dimensions for GA
 * @param {Object} versions - The versions object
 * @param {String} countryCode - The country code based on IP
 * @returns {Object} - version information as custom dimensions object to pass to set
 */
function setCustomDimensions(versions, countryCode) {
  const customDimensions = {
    cd1: versions.os,
    cd2: versions.osVersion,
    cd3: versions.node,
    cd4: versions.npm,
    cd5: versions.docker,
    cd7: countryCode,
  };
  if (versions.ocVersion !== null) {
    customDimensions.cd6 = versions.ocVersion;
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
  const client = ga4(userId);
  const customDimensions = setCustomDimensions(versions, countryCode);
  const response = await client.pageview(command, customDimensions, true);
  if (env.SHOW_VERBOSE_TELEMETRY_DATA) {
    Logger.success(command, { options, customDimensions, userId });
    Logger.success(JSON.stringify(response));
  }
}
