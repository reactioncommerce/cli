/**
 * @summary update package.json with projectType information
 * @param {String} currentPackageJson - data from file
 * @param {String} projectType - current project type
 * @param {String} projectName - current project name
 * @returns {string} - Updated file data
 */

export default function updatePackageJson(currentPackageJson, projectType, projectName) {
  const packageJson = JSON.parse(currentPackageJson);
  packageJson.reactionProjectType = `${projectType}-${projectName}`;
  return JSON.stringify(packageJson, null, 2);
}
