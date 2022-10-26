import fs from "fs";
import path from "path";
import os from "os";
import simpleGit from "simple-git";
import isCI from "is-ci";
import { copy } from "fs-extra";
import rimraf from "rimraf";
import Logger from "./logger.js";
import getFileFromCore from "./getFileFromCore.js";

/**
 * @summary Make local copies of files from remote git repository.  It only fetches the contents from reactCommerce.reaction
 * @param {String} sourcePath - Where to get the files from the local clone
 * @param {String} destinationPath - Where to put the copied files
 * @returns {Promise<Boolean>} - true if successful
 */
const getFilesFromReactionRepo = async (sourcePath, destinationPath) => {
  const appPrefix = "reactioncommerce-reaction";
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), appPrefix));
  const gitOptions = {
    baseDir: `${tmpDir}`,
    binary: "git",
    maxConcurrentProcesses: 6
  };
  const git = await simpleGit(gitOptions);
  const reactCommerceReactionPackage = await getFileFromCore("package.json");
  const parsedPackage = JSON.parse(reactCommerceReactionPackage);
  const { repository: { url: cliRepo } } = parsedPackage;
  // On the CI, we need token to access the repo till it's private
  const gitRepo = isCI ? `https://${process.env.GH_PUBLISHING_TOKEN}@github.com/reactioncommerce/reaction.git` : cliRepo;
  try {
    await git.clone(gitRepo, tmpDir, {
      "--depth": 1
    });
  } catch (error) {
    Logger.error(error);
  }
  await copy(`${tmpDir}${sourcePath}`, destinationPath);
  await rimraf.sync(tmpDir);
  return true;
};

export default getFilesFromReactionRepo;
