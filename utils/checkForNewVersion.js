import updateNotifier from "update-notifier";

import pkg from "../package.json";


/**
 * @summary Check if new version is available and notify user if so
 * @returns {Promise<void>} undefined
 */
export default async function checkForNewVersion() {
  const notifier = updateNotifier({ pkg });
  notifier.notify();
}
