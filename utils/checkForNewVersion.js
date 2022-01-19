import fs from "fs";
import updateNotifier from "update-notifier";

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"));

/**
 * @summary Check if new version is available and notify user if so
 * @returns {Promise<void>} undefined
 */
export default async function checkForNewVersion() {
  const notifier = updateNotifier({ pkg });
  notifier.notify();
}
