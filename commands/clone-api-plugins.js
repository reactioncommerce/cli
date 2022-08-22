import { spawn } from "child_process";
import fs from "fs";
import inquirer from "inquirer";
import isProjectOfType from "../utils/isProjectOfType.js";
import Logger from "../utils/logger.js";
import wget from "../utils/wget.js";

/**
 * @summary Get and parse local plugins.json file
 * @returns {Object} - return the local plugins.json as object
 */
async function getRemotePluginsJson() {
  const remotePackageJsonUrl = "https://raw.githubusercontent.com/reactioncommerce/reaction/trunk/plugins.json";
  try {
    const pluginsJson = await wget(remotePackageJsonUrl);

    return JSON.parse(pluginsJson);
  } catch (error) {
    Logger.error("Unable to get local plugins.json");
    Logger.error(error);
    throw error;
  }
}

/**
 * @summary Get the list of all upstream plugins defined in the plugins.json file of the official repo
 * @return {Promise<String[]>} - list of all plugins
 */
async function getAllPlugins() {
  const plugins = await getRemotePluginsJson();
  return Object.values(plugins)
    .map((plugin) => plugin.replace("@reactioncommerce/", ""));
}

/**
 * @summary Creates api-plugins directory in it doesn't exist
 * @return {void}
 */
function ensureApiPluginsDirectoryExists() {
  const apiPluginsDir = `${process.cwd()}/api-plugins`;
  if (!fs.existsSync(apiPluginsDir)) {
    Logger.info("Creating api-plugins directory");
    fs.mkdirSync(apiPluginsDir);
  }
}

/**
 * @summary Checks if plugin is already cloned
 * @param {String} plugin - key of the plugin
 * @return {boolean} - true if plugin is already cloned
 */
function isPluginAlreadyCloned(plugin) {
  const apiPluginsDir = `${process.cwd()}/api-plugins`;
  const pluginDir = `${apiPluginsDir}/${plugin}`;
  const pluginAlreadyCloned = fs.existsSync(pluginDir);
  if (pluginAlreadyCloned) {
    Logger.info(`Plugin ${plugin} already cloned`);
  }
  return pluginAlreadyCloned;
}

/**
 * @summary Generate the repo url for a plugin
 * @param {String} plugin - key of the plugin
 * @return {String} - the repo url
 */
function buildRepoUrlForPlugin(plugin) {
  return `https://github.com/reactioncommerce/${plugin}.git`;
}

/**
 * @summary Clones a plugin in the api-plugins directory
 * @param {String} plugin - key of the plugin
 * @return {Promise<void>} - promise that resolves when the plugin is cloned
 */
async function clonePlugin(plugin) {
  const apiPluginRepoUrl = buildRepoUrlForPlugin(plugin);

  return new Promise((resolve, reject) => {
    spawn("git", ["clone", apiPluginRepoUrl], {
      stdio: [process.stdout, process.stderr, process.stdin],
      cwd: `${process.cwd()}/api-plugins`
    })
      .on("exit", (errorCode) => {
        if (errorCode === 0) {
          resolve();
        }
        reject("Error cloning plugin");
      });
  });
}

/**
 * @summary Opens a prompt for manually selecting plugins to clone
 * @param {String[]} allPlugins - list of all plugins
 * @return {Promise<String[]>} - list of the selected plugins
 */
async function getManuallySelectedPlugins(allPlugins) {
  const { plugins } = await inquirer.prompt([{
    type: "checkbox",
    message: "Select the plugins you want to clone:",
    name: "plugins",
    choices: allPlugins,
    validate: (ans) => {
      if (ans.length === 0) {
        return "You must choose at least one plugin.";
      }
      return true;
    }
  }]);
  return plugins;
}

/**
 * @summary Get the plugins.json file
 * @return {Object} - the plugins.json as an object
 */
function getPluginsJson() {
  const pluginsJson = fs.readFileSync(`${process.cwd()}/plugins.json`, "utf8");
  return JSON.parse(pluginsJson);
}

/**
 * @summary Link a local plugin in the plugins.json file
 * @param {String} plugin - name of the plugin
 * @return {void}
 */
function linkLocalPlugin(plugin) {
  Logger.info(`Linking local plugin ${plugin} in plugins.json`);
  const pluginsJson = getPluginsJson();
  for (const key in pluginsJson) {
    if (pluginsJson[key] === `@reactioncommerce/${plugin}`) {
      pluginsJson[key] = `./api-plugins/${plugin}/index.js`;
      break;
    }
  }
  fs.writeFileSync(`${process.cwd()}/plugins.json`, JSON.stringify(pluginsJson, null, 2));
}

/**
 * @summary Clone all official Open Commerce API plugins in the api project
 * @param {Object} options - Options for cloning api plugins command
 * @returns {Promise<boolean>} - return true if successful
 */
export default async function cloneApiPlugins({
  manualSelect,
  link
}) {
  const isApiProject = await isProjectOfType("api");
  if (!isApiProject) {
    return false;
  }

  const allPlugins = await getAllPlugins();

  ensureApiPluginsDirectoryExists();

  const manuallySelectedPlugins = manualSelect && await getManuallySelectedPlugins(allPlugins);

  const pluginsToClone = manuallySelectedPlugins || allPlugins;

  const cloneAndLinkPromises = pluginsToClone.map(async (plugin) => {
    if (!isPluginAlreadyCloned(plugin)) {
      await clonePlugin(plugin);
    }
    if (link) {
      linkLocalPlugin(plugin);
    }
  });

  try {
    await Promise.all(cloneAndLinkPromises);
  } catch (error) {
    Logger.error(error);
    return false;
  }
  return true;
}
