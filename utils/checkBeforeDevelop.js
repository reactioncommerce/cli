import Logger from "../utils/logger.js";
import pathExists from "./pathExists.js";
import checkPort from "./checkPort.js";

/**
 * @summary check that the API server is running
 * @returns {Promise<boolean|*>} - whether the api server is running
 */
async function checkForApi() {
  const api = await checkPort("http://localhost:3000");
  return api;
}

/**
 * @summary checks if the local directory is ready to run develop
 * @param {String} type - The project type
 * @returns {Promise<boolean>} - If everything is ready for develop
 */
export default async function checkBeforeDevelop(type = "api") {
  if (!await pathExists("node_modules")) {
    if (type === "storefront") {
      Logger.error("It looks like you have not run `yarn install` in this directory");
      Logger.error("Please run `yarn install` and try again");
    } else {
      Logger.error("It looks like you have not run `npm install` in this directory");
      Logger.error("Please run `npm install` and try again");
    }
    return false;
  }
  if (type !== "api") {
    const apiRunning = await checkForApi();
    if (!apiRunning) {
      Logger.error("The API server must be running in order for this service to work");
      Logger.error("Please start the api service and try again");
      return false;
    }
  }
  return true;
}
