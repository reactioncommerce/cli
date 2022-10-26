import path from "path";
import os from "os";
import fs from "fs";
import { writeFile, rm, readFile } from "fs/promises";
import { copy } from "fs-extra";
import getFilesFromReactionRepo from "./getFilesFromReactionRepo.js";
import updateJestProcessEnv from "./updateJestProcessEnv.js";
import getFileFromCore from "./getFileFromCore.js";

/**
 * This only copies the test utilities from upstream (git) to the target folder
 * @param {String} sourcePath git sub-path from which the document will be fetched
 * @param {String} destinationPath destination folder
 * @returns {Boolean} {Promise<boolean>} return true when successful
 */
export default async function copyTests(sourcePath, destinationPath) {
  const appPrefix = `test_utils${(Math.random() + 1).toString(36).substring(7)}`;
  /**
   * Create a temporary directory to update the jestProcessEnv received from upstream
   */
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), appPrefix));
  await getFilesFromReactionRepo(sourcePath, tempDirectory);
  const jestProcessEnvConfig = await readFile(path.join(tempDirectory, "util", "jestProcessEnv.json"));
  /* write the updated jestProcessEnv in the file available in the temporary directory*/
  await writeFile(path.join(tempDirectory, "util", "jestProcessEnv.json"), JSON.stringify(updateJestProcessEnv(jestProcessEnvConfig), null, 2));
  const jestConfig = await getFileFromCore("jest.config.cjs");
  await Promise.all([copy(tempDirectory, `${destinationPath}/tests`), writeFile(`${destinationPath}/jest.config.cjs`, jestConfig)]);
  /* Clean up the temporary directory*/
  await rm(tempDirectory, { recursive: true });
  return true;
}
