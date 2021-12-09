import { copyFile } from "fs/promises";
import simpleGit from "simple-git";
import pathExists from "../utils/pathExists.js";
import Logger from "../utils/logger.js";

const gitOptions = {
  baseDir: process.cwd(),
  binary: "git",
  maxConcurrentProcesses: 6
};


/**
 * @summary clones projects locally from repo
 * @param {String} projectName name of the project to create
 * @param {Object} options - Any options for project creation
 * @returns {Boolean} true for success
 */
export default async function createProjectApi(projectName, options) {
  Logger.info({ projectName, options }, "Creating API project");
}
