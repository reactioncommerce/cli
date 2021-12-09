import Logger from "../utils/logger.js";

/**
 * @summary clones projects locally from repo
 * @param {String} projectName name of the project to create
 * @param {Object} options - Any options for project creation
 * @returns {Boolean} true for success
 */
export default async function createProjectAdmin(projectName, options) {
  Logger.info({ projectName, options }, "Creating admin");
}
