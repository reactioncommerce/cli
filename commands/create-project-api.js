import { mkdir, writeFile } from "fs/promises";
import { copy } from "fs-extra";
import simpleGit from "simple-git";
import wget from "../utils/wget.js";
import pathExists from "../utils/pathExists.js";
import Logger from "../utils/logger.js";


const reactionRepoRoot = "https://raw.githubusercontent.com/reactioncommerce/reaction/trunk";

/**
 * @summary create project directory
 * @param {String} projectName - The name of the directory to create
 * @returns {Promise<Boolean>} true if success
 */
async function makeProject(projectName) {
  await mkdir(projectName);
  // create utils directory
  await mkdir(`${projectName}/utils`);
  await mkdir(`${projectName}/custom-packages`);
}


/**
 * @summary modify package.json for use as a thin development project
 * @param {String} packageJson - The contents of package.json
 * @param {String} projectName - The name of the project
 * @returns {Promise<string>} The modified contents
 */
async function rewriteScripts(packageJson, projectName) {
  const newScripts = {
    "start": "node --experimental-modules --experimental-json-modules ./index.js",
    "start:dev": "npm run check-node-version && NODE_ENV=development NODE_OPTIONS='--experimental-modules --experimental-json-modules' nodemon ./index.js",
    "inspect": "NODE_ENV=development node --experimental-modules --experimental-json-modules --inspect ./src/index.js",
    "inspect-brk": "NODE_ENV=development node --experimental-modules --experimental-json-modules --inspect-brk ./src/index.js",
    "check-node-version": "node ./utils/checkNodeVersion.cjs",
    "test": "jest --runInBand",
    "lint": "eslint .",
    "npm-check": "npm-check -u"
  };
  const packageData = JSON.parse(packageJson);
  packageData.scripts = newScripts;
  packageData.name = projectName
  delete packageData.release;
  delete packageData.homepage;
  delete packageData.url;
  delete packageData.email;
  delete packageData.repository;
  delete packageData.author;
  delete packageData.bugs;
  packageData.main = "./index.js";
  return JSON.stringify(packageData, null, 2);
}

/**
 * @summary get a single file via HTTP
 * @param {String} fileName - The file to get
 * @returns {Promise<string|*>} The contents of the file
 */
async function getFileFromCore(fileName) {
  const contents = await wget(`${reactionRepoRoot}/${fileName}`);
  return contents;
}

/**
 * @summary get files directory from core repo
 * @param {String} projectName - The name of the project we are creating
 * @returns {Promise<Boolean>} True if success
 */
async function getFilesFromCore(projectName) {
  // get files directly from repo so it's always up-to-date
  const packageJson = await getFileFromCore("package.json");
  const updatedPackageJson = await rewriteScripts(packageJson, projectName);
  await writeFile(`${projectName}/package.json`, updatedPackageJson);

  const pluginsJson = await getFileFromCore("plugins.json");
  // Add example plugin to plugins.json
  const pluginsData = JSON.parse(pluginsJson);
  pluginsData.example = "./custom-packages/simple-example/index.js";
  await writeFile(`${projectName}/plugins.json`, JSON.stringify(pluginsData, null, 2));

  const checkNode = await getFileFromCore("src/checkNodeVersion.cjs");
  await writeFile(`${projectName}/utils/checkNodeVersion.sjs`, checkNode);

  const nvmrc = await getFileFromCore(".nvmrc");
  await writeFile(`${projectName}/.nvmrc`, nvmrc);
  return true;
}


/**
 * @summary git init the newly created project
 * @param {String} projectName - The project to init
 * @returns {Promise<Boolean>} true if success
 */
async function gitInitDirectory(projectName) {
  const gitOptions = {
    baseDir: `${process.cwd()}/${projectName}`,
    binary: "git",
    maxConcurrentProcesses: 6
  };
  const git = simpleGit(gitOptions);
  try {
    await git.init();
  } catch (error) {
    Logger.error(error);
  }
}


/**
 * @summary clones projects locally from repo
 * @param {String} projectName name of the project to create
 * @param {Object} options - Any options for project creation
 * @returns {Boolean} true for success
 */
export default async function createProjectApi(projectName, options) {
  Logger.info({ projectName, options }, "Creating API project");
  if (await pathExists(projectName)) {
    Logger.error(`Cannot create directory ${projectName}, already exists`);
    return;
  }
  // create directories
  await makeProject(projectName);

  // copy files from local template (this may also eventually come from core, so it's all in one place)
  await copy("./templates/api-project/", projectName);

  // copy files directly from core that we want to be current
  await getFilesFromCore(projectName);

  // git init the new project
  await gitInitDirectory(projectName);

  Logger.info("Project creation complete. Change to your directory and run `npm install`");
}
