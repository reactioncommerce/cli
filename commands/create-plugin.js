import Logger from "../utils/logger.js";

/**
 * @summary create a new plugin from template
 * @param {String} pluginName - The name of the plugin to create
 * @returns {Promise<Boolean>} True for success
 */
export default async function createPlugin(pluginName) {
  Logger.info("Creating plugin", { pluginName });
}
