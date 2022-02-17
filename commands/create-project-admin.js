import simpleGit from "simple-git";
import { copy } from "fs-extra";
import Logger from "../utils/logger.js";
import installMeteorIfMissing from "../utils/installMeteorIfMissing.js";


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
  Logger.success("Admin project created. You can change to this directory and run `npm install`");
  return true;
}

