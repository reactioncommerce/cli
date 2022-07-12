import fs from "fs/promises";
import { execSync } from "child_process";
import inquirer from "inquirer";
import compareVersions from "compare-versions";

import Logger from "../utils/logger.js";
import wget from "../utils/wget.js";
import pathExists from "../utils/pathExists.js";

const PACKAGE_JSON_PATH = "package.json";

/**
 * @summary Get and parse local package.json file
 * @returns {Object} - return the local package.json as object
 */
export const getLocalPackageJson = async () => {
  try {
    const packageJson = await fs.readFile(PACKAGE_JSON_PATH, { encoding: "utf8", flag: "r" });
    return JSON.parse(packageJson);
  } catch (error) {
    Logger.error("Unable to get local package.json");
    Logger.error(error);
    throw error;
  }
};

/**
 * @summary Get and parse remote package.json file
 * @returns {Object} - return the remote dependencies as object
 */
export const getRemoteDependencies = async () => {
  const remotePackageJsonUrl = "https://raw.githubusercontent.com/reactioncommerce/reaction/trunk/package.json";
  try {
    const remotePackageJson = await wget(remotePackageJsonUrl);
    return (JSON.parse(remotePackageJson)).dependencies;
  } catch (error) {
    Logger.error("Unable to load current reaction package.json", error);
    throw error;
  }
};

/**
 * @summary Clean the version string
 * @param {String} originVersion - The origin version string
 * @returns {String} - Cleaned version string
 */
export const cleanVersion = (originVersion = "") => originVersion.replace(/[^\d.]/g, "");

/**
 * @summary Get plugin chooses list should to update
 * @param {Array<string>} plugins - Plugins need to update
 * @returns {Array<string>} - return array of plugin chooses
 */
export const getShouldUpdatePlugins = (plugins) => plugins.map(({ name, version, remoteVersion }) => ({
  name: `${name}\t ${version} -> ${remoteVersion}`
}));

/**
 * @summary Update the package json data
 * @param {Object} answers - Answer object
 * @returns {Object} - return updated package json data
 */
export const updatePackageJson = ({ answers, localPacakgeJson, outdatedPackages }) => {
  const updatedPackageJson = { ...localPacakgeJson };

  if (answers && answers.plugins) {
    const pendingPlugins = answers.plugins.map((plugin) => plugin.split("\t")[0]);
    outdatedPackages.forEach(({ name, remoteVersion }) => {
      if (pendingPlugins.includes(name)) {
        updatedPackageJson.dependencies[name] = remoteVersion;
      }
    });
  } else {
    outdatedPackages.forEach(({ name, remoteVersion }) => {
      updatedPackageJson.dependencies[name] = remoteVersion;
    });
  }
  return updatedPackageJson;
};

/**
 * @summary allow user can update plugins
 * @param {Object} options - Any options for project creation
 * @returns {boolean} - return true if successful
 */
export default async function update(options) {
  if (!await pathExists(PACKAGE_JSON_PATH)) {
    Logger.error("The current directory does not contain package.json");
    return false;
  }

  Logger.info("Getting the local dependencies");
  const packageJsonData = await getLocalPackageJson();
  const { dependencies } = packageJsonData;
  if (!dependencies) {
    Logger.error("Dependencies object not found");
    return false;
  }

  const packagePrefix = "@reactioncommerce/";
  const pluginPackages = Object.entries(dependencies)
    .map(([name, version]) => ({ name, version }))
    .filter(({ name }) => name.startsWith(packagePrefix));

  if (pluginPackages.length === 0) {
    Logger.info("Plugins not found.");
    return true;
  }

  Logger.info("Getting the remote dependencies");
  const remoteDependencies = await getRemoteDependencies();

  const outdatedPackages = pluginPackages
    .map(({ name, version }) => ({
      name,
      version,
      remoteVersion: remoteDependencies[name],
      outdated: compareVersions.compare(cleanVersion(remoteDependencies[name]), cleanVersion(version), ">")
    }))
    .filter(({ outdated }) => outdated);

  if (outdatedPackages.length === 0) {
    Logger.info("All plugins are up to date.");
    return true;
  }

  Logger.info(`Found ${pluginPackages.length} plugins. ${outdatedPackages.length} outdated plugins.`);


  const answers = options.all ? null : await inquirer.prompt([
    {
      type: "list",
      name: "kind",
      message: "Do want to update your outdated plugins?",
      choices: ["Update all outdated plugins", "Choose a part"]
    },
    {
      type: "checkbox",
      message: "Select the plugins you want to update:",
      name: "plugins",
      choices: getShouldUpdatePlugins(outdatedPackages),
      when: (ans) => ans.kind === "Choose a part",
      validate: (ans) => {
        if (ans.length === 0) {
          return "You must choose at least one plugin.";
        }
        return true;
      }
    }
  ]);

  const updatedPackageJson = updatePackageJson({
    answers,
    localPacakgeJson: packageJsonData,
    outdatedPackages
  });

  Logger.info("Update your package.json file");
  await fs.writeFile(PACKAGE_JSON_PATH, JSON.stringify(updatedPackageJson, null, "\t"));

  Logger.info("Update your plugins");
  execSync("npm install", { stdio: "inherit" });

  Logger.success("The plugins has been updated successfully");

  return true;
}
