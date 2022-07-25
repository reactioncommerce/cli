import getProjectType from "./getProjectType.js";
import Logger from "./logger.js";

/**
 * @summary Check if the current project is of a desired type.
 * @param {String} expectedProjectType - The project type to check for.
 * @returns {boolean} - The expected project type
 */
export default async function isProjectOfType(expectedProjectType) {
  const actualProjectType = await getProjectType();
  if (!actualProjectType || actualProjectType === "") {
    return false;
  }
  const isOfProjectType = actualProjectType === expectedProjectType;

  if (!isOfProjectType) {
    Logger.error(`Project type should be of type ${expectedProjectType}`);
    return false;
  }

  return true;
}
