import path from "path";
import fs from "fs-extra";

/**
 * @summary read package.json and return its contents
 * @param {String} packagePath - path to package files
 * @returns {Promise<Object>} - The contexts of the package file
 */
export default function getPackageData(packagePath = "") {
  let packageFile;
  if (!packagePath) {
    packageFile = path.join(process.cwd(), "package.json");
  } else {
    packageFile = packagePath;
  }
  const packageData = fs.readJSONSync(packageFile);
  return packageData;
}
