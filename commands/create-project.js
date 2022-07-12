import Logger from "../utils/logger.js";
import checkDependencies from "../utils/checkDependencies.js";
import createProjectApi from "./create-project-api.js";
import createProjectAdmin from "./create-project-admin.js";
import createProjectKinetic from "./create-project-kinetic.js";
import createProjectStorefront from "./create-project-storefront.js";
import createProjectDemo from "./create-project-demo.js";

const methodMap = {
  api: createProjectApi,
  admin: createProjectAdmin,
  storefront: createProjectStorefront,
  kinetic: createProjectKinetic,
  demo: createProjectDemo
};

const extraDependencyMap = {
  storefront: ["yarn"],
  kinetic: ["pnpm"]
};

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
