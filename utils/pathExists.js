import { stat } from "fs/promises";
import Logger from "../utils/logger.js";

/**
 * @summary checks if a file or directory exists
 * @param {String} path - The path to check
 * @returns {Promise<boolean>} if the path exists
 */
export default async function pathExists(path) {
  try {
    const pathInfo = await stat(path);
    return !!pathInfo.size;
  } catch (error) {
    if (error.errno !== -2) {
      Logger.error(error);
    }
  }
  return false;
}
