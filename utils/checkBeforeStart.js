import Logger from "../utils/logger.js";
import pathExists from "./pathExists.js";

/**
 * @summary checks if the local directory is ready to run develop
 * @returns {Promise<boolean>} - If everything is ready for develop
 */
export default async function checkBeforeDevelop() {
  if (!await pathExists("node_modules")) {
    Logger.error("It looks like you have not run `npm install` in this directory");
    Logger.error("Please run `npm install` and try again");
    return false;
  }
  return true;
}
