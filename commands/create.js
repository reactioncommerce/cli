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
 * @summary clone the reaction project into a local dir and copy over .env files
 * @param {String} projectDir - The directory to clone into, defaults to reaction
 * @returns {Promise<void>} undefined
 */
async function createCore(projectDir = "./reaction") {
  const alreadyCloned = await pathExists(projectDir);
  if (!alreadyCloned) {
    const git = simpleGit(gitOptions);
    Logger.info("Cloning core");
    await git.clone("git@github.com:reactioncommerce/reaction.git");
  }

  const destinationFile = `${projectDir}/.env`;
  const alreadyCopied = await pathExists(destinationFile);

  if (!alreadyCopied) {
    Logger.info("copying over example .env files");
    const sourceFile = `${projectDir}/.env.example`;
    await copyFile(sourceFile, destinationFile);
  }

  Logger.info("Core Creation Complete");
}

/**
 * @summary clones projects locally from repo
 * @param {String} project - The project to clone
 * @returns {undefined} undefined
 */
export default async function create(project = "core") {
  if (project === "core") {
    await createCore();
  } else if (project === "storefront") {
    Logger.warn("Storefront creation not implemented");
  } else if (project === "admin") {
    Logger.warn("Admin creation not implemented");
  }
}
