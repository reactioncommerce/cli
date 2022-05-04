import fs from "fs";
import Logger from "../utils/logger.js";
import checkDependencies from "../utils/checkDependencies.js";
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

const validProjectTypes = ["api", "admin-meteor", "storefront-example"];

/**
 * @summary check if reactionProjectType exists, if not return empty string
 * @returns {String} - The project type
 */
async function getProjectType() {
  Logger.info("Getting project type");
  const packageJson = fs.readFileSync("package.json", { encoding: "utf8", flag: "r" });
  const packageJsonData = JSON.parse(packageJson);
  const projectType = packageJsonData.reactionProjectType;

  if (!projectType || projectType === "") {
    Logger.error("No project type found in package.json");
    return "";
  }

  if (!validProjectTypes.includes(projectType)) {
    Logger.error("No valid project type found in package.json");
    return "";
  }

  switch (projectType) {
    case "api":
      Logger.info("Found project type: api");
      return "api";
    case "admin-meteor":
      Logger.info("Found project type: admin-meteor");
      return "admin";
    case "storefront-example":
      Logger.info("Found project type: storefront-example");
      return "storefront";
    default:
      Logger.error("No valid project type found in package.json");
      return "";
  }
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
