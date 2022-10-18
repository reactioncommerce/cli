import fs from "fs";
import Logger from "./logger.js";

const validProjectTypes = ["api", "admin-meteor", "storefront-example"];

/**
 * @summary check if projectType exists, if not return empty string
 * @returns {String} - The project type
 */
export default async function getProjectType() {
  Logger.info("Getting project type");
  try {
    const packageJson = fs.readFileSync("package.json", {
      encoding: "utf8",
      flag: "r"
    });
  } catch (err) {
    if (err.code === 'ENOENT') {
      Logger.error("Cannot read package.json in current directory");
      return "";
    } else {
      throw err;
    }
  }
  try {
    const packageJsonData = JSON.parse(packageJson);
  } catch (err) {
    Logger.error("Error while parsing package.json");
    return "";
  }
  const { projectType } = packageJsonData;

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
