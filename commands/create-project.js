import checkDependencies from "../utils/checkDependencies.js";
import createProjectApi from "./create-project-api.js";
import createProjectAdmin from "./create-project-admin.js";
import createProjectStorefront from "./create-project-storefront.js";

const methodMap = {
  api: createProjectApi,
  admin: createProjectAdmin,
  storefront: createProjectStorefront
};

/**
 * @summary create one of the project types
 * @param {String} projectType - One of the project types
 * @param {String} projectName - The name of the project to create
 * @param {Object} options - Project options
 * @returns {Promise<Boolean>} - True if success
 */
export default async function createProject(projectType, projectName, options) {
  if (await checkDependencies()) {
    const results = await methodMap[projectType](projectName, options);
    return results;
  }
  return false;
}
