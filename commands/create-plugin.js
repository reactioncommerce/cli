import createPluginApi from "./create-plugin-api.js";

const functionMap = {
  api: createPluginApi
};


/**
 * @summary create a new plugin from template
 * @param {String} type - The type of plugin to create
 * @param {String} pluginName - The name of the plugin to create
 * @param {Object} options = Any extra options passed to the command line
 * @returns {Promise<Boolean>} True for success
 */
export default async function createPlugin(type, pluginName, options) {
  const results = await functionMap[type](pluginName, options);
  return results;
}
