import { writeFile, readFile } from "fs/promises";
import simpleGit from "simple-git";
import { copy } from "fs-extra";
import Logger from "../utils/logger.js";

/**
 * @summary modify package.json for use as a thin development project
 * @param {String} packageJson - The contents of package.json
 * @param {String} projectName - The name of the project
 * @returns {String} The modified contents
 */
function updatePackageJson(packageJson, projectName) {
  const packageData = JSON.parse(packageJson);
  packageData.name = projectName;
  packageData.version = "1.0.0";
  packageData.projectType = "kinetic";
  return JSON.stringify(packageData, null, 2);
}

/**
 * @summary Update the core file for this project
 * @param {String} projectName - The name of the project we are creating
 * @returns {Promise<Boolean>} True if success
 */
async function updateCoreFile(projectName) {
  const packageJsonPath = `${projectName}/package.json`;
  const packageJson = await readFile(packageJsonPath, { encoding: "utf8", flag: "r" });
  const updatedPackageJson = updatePackageJson(packageJson, projectName);
  await writeFile(packageJsonPath, updatedPackageJson);
  return true;
}

/**
 * @summary clones projects locally from repo
 * @param {String} projectName name of the project to create
 * @returns {Boolean} true for success
 */
export default async function createProjectKinetic(projectName) {
  Logger.info("Creating kinetic", { projectName });
  const gitOptions = {
    baseDir: `${process.cwd()}`,
    binary: "git",
    maxConcurrentProcesses: 6
  };
  const git = simpleGit(gitOptions);
  Logger.info("Cloning project");
  try {
    await git.clone("git@github.com:reactioncommerce/kinetic.git", projectName);
  } catch (error) {
    Logger.error(error);
    return false;
  }
  await updateCoreFile(projectName);
  await copy(`${projectName}/.env.example`, `${projectName}/.env`);
  Logger.success("Kinetic project created. You can change to this directory and run `pnpm install`");
  return true;
}

