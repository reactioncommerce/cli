import path from "path";
import fs from "fs";
import rimraf from "rimraf";
import simpleGit from "simple-git";
import pathExists from "../utils/pathExists.js";
import Logger from "../utils/logger.js";

/**
 * @summary Clone the new plugin from the example
 * @param {String} pluginPath - The path of the new plugin
 * @returns {Promise<Boolean>} - true if successful
 */
async function cloneFromExample(pluginPath) {
  const gitOptions = {
    baseDir: `${process.cwd()}`,
    binary: "git",
    maxConcurrentProcesses: 6
  };
  const git = simpleGit(gitOptions);
  try {
    await git.clone("https://github.com/reactioncommerce/api-plugin-example.git", pluginPath);
  } catch (error) {
    Logger.error(error);
  }
  return true;
}

/**
 * @summary remove the git directory created when cloning
 * @param {String} pluginPath - The path of the created plugin
 * @returns {Promise<Boolean>} - True if successful
 */
async function removeGitDirectory(pluginPath) {
  await rimraf.sync(path.join(pluginPath, ".git"));
  return true;
}


/**
 * @summary git init the newly created plugin
 * @param {String} pluginName - The project to init
 * @returns {Promise<Boolean>} true if success
 */
async function gitInitDirectory(pluginName) {
  const gitOptions = {
    baseDir: `${process.cwd()}/${pluginName}`,
    binary: "git",
    maxConcurrentProcesses: 6
  };
  const git = simpleGit(gitOptions);
  try {
    await git.init();
  } catch (error) {
    Logger.error(error);
  }
}

/**
 * @summary add the newly created plugin to plugins.json, so it will load
 * @param {String} pluginName - The name of the created plugin
 * @returns {Promise<Object>} - The updated plugins.json data
 */
async function addToPluginsJson(pluginName) {
  Logger.info("Updated plugins.json");
  const pluginJson = fs.readFileSync("plugins.json", { encoding: "utf8", flag: "r" });
  const pluginData = JSON.parse(pluginJson);
  const pluginLine = `./custom-packages/${pluginName}/index.js`;
  pluginData[pluginName] = pluginLine;
  const updatedPluginsJson = JSON.stringify(pluginData, null, 4);
  fs.writeFileSync("plugins.json", updatedPluginsJson, { encoding: "utf8" });
  return pluginData;
}


/**
 * @summary clones projects locally from repo
 * @param {String} pluginName name of the project to create
 * @param {Object} options - Any options for project creation
 * @returns {Boolean} true for success
 */
export default async function createPluginApi(pluginName, options) {
  Logger.info("Creating API plugin", { pluginName, options });
  const pluginPath = path.join("custom-packages", pluginName);
  if (await pathExists(pluginPath)) {
    Logger.error(`Cannot create directory ${pluginName}, already exists`);
    return;
  }

  await cloneFromExample(pluginPath);
  await removeGitDirectory(pluginPath);
  await gitInitDirectory(pluginPath);
  await addToPluginsJson(pluginName);
  Logger.info("Plugin creation complete");
}
