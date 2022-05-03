import fs from "fs";
import { writeFile } from "fs/promises";
import simpleGit from "simple-git";
import { copy } from "fs-extra";
import Logger from "../utils/logger.js";
import updatePackageJson from "../utils/updatePackageProjectType.js";


/**
 * @summary clones projects locally from repo
 * @param {String} projectName name of the project to create
 * @param {Object} options - Any options for project creation
 * @returns {Boolean} true for success
 */
export default async function createProjectStorefront(projectName, options) {
  Logger.info("Creating Storefront", {
    projectName,
    options
  });
  const gitOptions = {
    baseDir: `${process.cwd()}`,
    binary: "git",
    maxConcurrentProcesses: 6
  };
  const git = simpleGit(gitOptions);
  try {
    await git.clone("https://github.com/reactioncommerce/example-storefront.git", projectName);
  } catch (error) {
    Logger.error(error);
  }
  await copy(`${projectName}/.env.example`, `${projectName}/.env`);
  const currentPackageJson = fs.readFileSync(`${projectName}/package.json`, { encoding: "utf8" });
  const updatedPackageJson = updatePackageJson(currentPackageJson, 'storefront', projectName);
  await writeFile(`${projectName}/package.json`, updatedPackageJson);
  Logger.success("Storefront project created. You can change to this directory and run `yarn install`");
  return true;
}
