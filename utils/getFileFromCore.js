import wget from "./wget.js";
import Logger from "./logger.js";

export const reactionAppRoot = "https://raw.githubusercontent.com/reactioncommerce/reaction/trunk/apps/reaction";
export const reactionRoot = "https://raw.githubusercontent.com/reactioncommerce/reaction/trunk/";

/**
 * @summary get a single file via HTTP
 * @param {String} fileName - The file to get
 * @param {String} rootDir - path to root for file
 * @returns {Promise<string|*>} The contents of the file
 */
export default async function getFileFromCore(fileName, rootDir = reactionAppRoot) {
  try {
    return wget(`${rootDir}/${fileName}`);
  } catch (error) {
    Logger.error(`Unable to get file from ${rootDir}/${fileName}`);
    throw error;
  }
}
