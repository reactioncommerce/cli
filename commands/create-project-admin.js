import simpleGit from "simple-git";
import { copy } from "fs-extra";
import Logger from "../utils/logger.js";


/**
 * @summary clones projects locally from repo
 * @param {String} projectName name of the project to create
 * @param {Object} options - Any options for project creation
 * @returns {Boolean} true for success
 */
export default async function createProjectAdmin(projectName, options) {
  Logger.info({ projectName, options }, "Creating admin");
  const gitOptions = {
    baseDir: `${process.cwd()}`,
    binary: "git",
    maxConcurrentProcesses: 6
  };
  const git = simpleGit(gitOptions);
  try {
    await git.clone("https://github.com/reactioncommerce/reaction-admin.git", projectName);
  } catch (error) {
    Logger.error(error);
  }
  await copy(`${projectName}/.env.example`, `${projectName}/.env`);
  Logger.info("Admin project created. You can change to this directory and run `npm install`");
  return true;
}

