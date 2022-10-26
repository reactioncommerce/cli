import Logger from "../utils/logger.js";
import checkDependencies from "../utils/checkDependencies.js";
import createProjectApi from "./create-project-api.js";
import createProjectAdmin from "./create-project-admin.js";
import createProjectStorefront from "./create-project-storefront.js";
import createProjectDemo from "./create-project-demo.js";

const methodMap = {
  api: createProjectApi,
  admin: createProjectAdmin,
  storefront: createProjectStorefront,
  demo: createProjectDemo,
  all: createProjectAll
};

const extraDependencyMap = {
  storefront: ["yarn"]
};

/**
 * @summary creates api, admin, and storefront projects at same time in separate directories.
 * @param {String} projectName - The name of the project to create
 * @param {Object} options - Project options
 * @returns {Boolean} {Promise<boolean>} return true when successful
 */
export async function createProjectAll(projectName, options) {
  createProjectApi(`${projectName}Api`, options);
  createProjectAdmin(`${projectName}Admin`, options);
  createProjectStorefront(`${projectName}Storefront`, options);
  return true;
}

/**
 * @summary create one of the project types
 * @param {String} projectType - One of the project types
 * @param {String} projectName - The name of the project to create
 * @param {Object} options - Project options
 * @returns {Promise<Boolean>} - True if success
 */
export default async function createProject(projectType, projectName, options) {
  const dependenciesOk = await checkDependencies(extraDependencyMap[projectType]);
  if (dependenciesOk) {
    const results = await methodMap[projectType](projectName, options);
    return results;
  }
  Logger.error("Dependency check failed. Command could not complete");
  return false;
}
