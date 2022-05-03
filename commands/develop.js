import fs from "fs";
import checkDependencies from "../utils/checkDependencies.js";
import developStorefront from "./develop-storefront.js";
import developAdmin from "./develop-admin.js";
import developApi from "./develop-api.js";
import Logger from "../utils/logger.js";

const functionMap = {
  api: developApi,
  admin: developAdmin,
  storefront: developStorefront
};

const extraDependencyMap = {
  storefront: ["yarn"]
};

const validProjectTypes = ['api', 'admin', 'storefront'];

/**
 * @summary check if reactionProjectType exists, if not return empty string
 * @returns {String} - The project type
 */
 async function getProjectType() {
  Logger.info("Getting project type");
  const packageJson = fs.readFileSync("package.json", { encoding: "utf8", flag: "r" });
  const packageJsonData = JSON.parse(packageJson);
  const projectType = packageJsonData.reactionProjectType;
  if (!projectType) {
    Logger.info("No project type found in package.json");
    return "";
  }
  const finalProjectType = projectType.split("-")[0];
  if (!finalProjectType || finalProjectType === "" || (!validProjectTypes.includes(finalProjectType))) {
    Logger.info("No valid project type found in package.json");
    return "";
  }
  Logger.info("Found project type in package.json");
  return finalProjectType;
 }
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
  if (!projectTypeFound) {
    Logger.error("No project type found");
    return false;
  }
  const dependenciesOk = await checkDependencies(extraDependencyMap[projectTypeFound]);
  if (dependenciesOk) {
    return functionMap[projectTypeFound](options);
  }
  return false;
}
