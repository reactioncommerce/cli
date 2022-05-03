import { writeFile } from "fs/promises";
import fs from "fs";
import simpleGit from "simple-git";
import { copy } from "fs-extra";
import { parse, stringify } from "envfile";
import Logger from "../utils/logger.js";
import installMeteorIfMissing from "../utils/installMeteorIfMissing.js";
import updatePackageJson from "../utils/updatePackageProjectType.js";

/**
 * @summary update env file with correct mongo information
 * @param {String} envData - data from file
 * @returns {string} - Updated file data
 */
function updateEnv(envData) {
  const env = parse(envData);
  env.MONGO_OPLOG_URL = "mongodb://localhost:27017/local";
  env.MONGO_URL = "mongodb://localhost:27017/reaction";
  const updatedEnv = stringify(env);
  return updatedEnv;
}

/**
 * @summary clones projects locally from repo
 * @param {String} projectName name of the project to create
 * @param {Object} options - Any options for project creation
 * @returns {Boolean} true for success
 */
export default async function createProjectAdmin(projectName, options) {
  const { skipMeteorInstall } = options;
  // this is so tests can run without having to install Meteor every time
  if (!skipMeteorInstall) {
    const success = await installMeteorIfMissing();
    if (!success) {
      Logger.warn("No Meteor installed and Meteor installation unsuccessful. Aborting project creation");
      return false;
    }
  }
  Logger.info("Creating admin", { projectName, options });
  const gitOptions = {
    baseDir: `${process.cwd()}`,
    binary: "git",
    maxConcurrentProcesses: 6
  };
  const git = simpleGit(gitOptions);
  Logger.info("Cloning project");
  try {
    await git.clone("https://github.com/reactioncommerce/reaction-admin.git", projectName);
  } catch (error) {
    Logger.error(error);
    return false;
  }
  await copy(`${projectName}/.env.example`, `${projectName}/.env`);
  const dotEnv = fs.readFileSync(`${projectName}/.env.example`, { encoding: "utf8" });
  const updatedDotEnv = updateEnv(dotEnv);
  await writeFile(`${projectName}/.env`, updatedDotEnv);
  const currentPackageJson = fs.readFileSync(`${projectName}/package.json`, { encoding: "utf8" });
  const updatedPackageJson = updatePackageJson(currentPackageJson, 'admin', projectName);
  await writeFile(`${projectName}/package.json`, updatedPackageJson);
  Logger.success("Admin project created. You can change to this directory and run `npm install`");
  return true;
}

