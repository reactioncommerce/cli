import Logger from "../utils/logger.js";
import checkDependencies from "../utils/checkDependencies.js";
import getProjectType from "../utils/getProjectType.js";
import developStorefront from "./develop-storefront.js";
import developAdmin from "./develop-admin.js";
import developApi from "./develop-api.js";

const functionMap = {
  api: developApi,
  admin: developAdmin,
  storefront: developStorefront
};

const extraDependencyMap = {
  storefront: ["yarn"]
};

/**
 * @summary Run api in development mode
 * @param {String} projectType - Which project type to develop on
 * @param {Object} options - Develop options
 * @returns {Promise<Boolean>} True for success
 */
export default async function develop(projectType, options) {
  Logger.info("Developing project", { projectType, options });
  let projectTypeFound = "";
  if (projectType) {
    projectTypeFound = projectType;
  } else {
    projectTypeFound = await getProjectType();
  }
  if (!projectTypeFound || projectTypeFound === "") {
    Logger.error("No project type found");
    return false;
  }

  const dependenciesOk = await checkDependencies(extraDependencyMap[projectTypeFound]);
  if (dependenciesOk) {
    return functionMap[projectTypeFound](options);
  }
  return false;
}
