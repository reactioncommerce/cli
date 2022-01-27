import updateNotifier from "update-notifier";

import constants from "../utils/constants.js";

const { PACKAGE_NAME, PACKAGE_VERSION } = constants;

const pkg = {
  name: PACKAGE_NAME,
  version: PACKAGE_VERSION
};

/**
 * @summary Check if new version is available and notify user if so
 * @returns {Promise<void>} undefined
 */
export default async function checkForNewVersion() {
  const notifier = updateNotifier({ pkg });
  notifier.notify();
}
