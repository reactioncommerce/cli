import fs from "fs";
import path from "path";
import os from "os";
import { createRequire } from "module";
import simpleGit from "simple-git";
import { copy } from "fs-extra";
import rimraf from "rimraf";
import Logger from "./logger.js";


const require = createRequire(import.meta.url);
const pkg = require("../package.json");


/**
 * @summary Make local copies of files from remote git repository
 * @param {String} sourcePath - Where to get the files from the local clone
 * @param {String} destinationPath - Where to put the copied files
 * @returns {Promise<Boolean>} - true if successful
 */
export default async function getFilesFromRepo(sourcePath, destinationPath) {
  const { repository: { url: cliRepo } } = pkg;
  const appPrefix = "reaction-cli";
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), appPrefix));
  const gitOptions = {
    baseDir: `${tmpDir}`,
    binary: "git",
    maxConcurrentProcesses: 6
  };
  const git = simpleGit(gitOptions);
  try {
    await git.clone(cliRepo, tmpDir, { "--depth": 1 });
  } catch (error) {
    Logger.error(error);
  }
  await copy(`${tmpDir}${sourcePath}`, destinationPath);
  await rimraf.sync(tmpDir);
}
