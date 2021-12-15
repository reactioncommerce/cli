// This plugin example is only to show you how plugins can be added. For a more complete plugin template
// use the `create-plugin` command
import Logger from "@reactioncommerce/logger";
import packageData from "./package.json";

const { version } = packageData;


/**
 * @summary register plugin
 * @param {Object} app - The application
 * @returns {Promise<void>} undefined
 */
export default async function register(app) {
  await app.registerPlugin({
    name: "example-plugin",
    version
  });
  Logger.info("Your custom Reaction plugin has loaded");
}
