import updateNotifier from "update-notifier";

import { version } from "./version.js";
import PACKAGE_NAME from "./constants.js";

const notifierPackage = {
  name: PACKAGE_NAME,
  version
};

/**
 * @summary Check if new version is available and notify user if so
 * @returns {Promise<void>} undefined
 */
export default async function checkForNewVersion() {
  const notifier = updateNotifier({ pkg: notifierPackage });
  notifier.notify();
}
