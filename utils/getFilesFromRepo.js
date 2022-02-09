import fs from "fs";
import path from "path";
import os from "os";
import { createRequire } from "module";
import simpleGit from "simple-git";
import { copy } from "fs-extra";
import rimraf from "rimraf";
import isCI from "is-ci";
import Logger from "./logger.js";

const require = createRequire(import.meta.url);
const pkg = require("../package.json");

const { repository: { url: cliRepo } } = pkg;

/**
 * @summary Make local copies of files from remote git repository
 * @param {String} sourcePath - Where to get the files from the local clone
 * @param {String} destinationPath - Where to put the copied files
 * @returns {Promise<Boolean>} - true if successful
 */
export default async function getFilesFromRepo(sourcePath, destinationPath) {
  const appPrefix = "reaction-cli";
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), appPrefix));
  const gitOptions = {
    baseDir: `${tmpDir}`,
    binary: "git",
    maxConcurrentProcesses: 6
  };
  const git = await simpleGit(gitOptions);
  // On the CI, we need token to access the repo till it's private
  const gitRepo = isCI ? `https://${process.env.GH_PUBLISHING_TOKEN}@github.com/reactioncommerce/cli.git` : cliRepo;
  try {
    await git.clone(gitRepo, tmpDir, {
      "--depth": 1
    });
  } catch (error) {
    Logger.error(error);
  }
  await copy(`${tmpDir}${sourcePath}`, destinationPath);
  await rimraf.sync(tmpDir);
}
