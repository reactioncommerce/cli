import { createRequire } from "module";
import updateNotifier from "update-notifier";


const require = createRequire(import.meta.url);
const pkg = require("../package.json");


/**
 * @summary Check if new version is available and notify user if so
 * @returns {Promise<void>} undefined
 */
export default async function checkForNewVersion() {
  const notifier = updateNotifier({ pkg });
  const updateCommand = "npm i -g reaction-cli";
  const updateMessage = `Run ${updateCommand} to update.`;
  notifier.notify({ message: updateMessage });
}
