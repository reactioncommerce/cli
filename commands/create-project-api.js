import { mkdir, writeFile } from "fs/promises";
import { parse, stringify } from "envfile";
import simpleGit from "simple-git";
import getFilesFromRepo from "../utils/getFilesFromRepo.js";
import pathExists from "../utils/pathExists.js";
import Logger from "../utils/logger.js";
import getFileFromCore, { reactionRoot } from "../utils/getFileFromCore.js";
import copyTests from "../utils/copyTests.js";

/**
 * @summary create project directory
 * @param {String} projectName - The name of the directory to create
 * @returns {Promise<Boolean>} true if success
 */
async function makeProject(projectName) {
  await mkdir(projectName);
  // create src, custom-packages & tests directory
  await mkdir(`${projectName}/src`);
  await mkdir(`${projectName}/custom-packages`);
  await mkdir(`${projectName}/tests`);
}

/**
 * @summary fetch the right nodemon from root
 * @return {Promise<string>} - the nodemon package.json line
 */
async function getDevDependenciesFromRoot() {
  const rootPackage = await getFileFromCore("package.json", reactionRoot);
  const packageData = JSON.parse(rootPackage);
  return packageData.devDependencies;
}


/**
 * @summary modify package.json for use as a thin development project
 * @param {String} packageJson - The contents of package.json
 * @param {String} projectName - The name of the project
 * @returns {Promise<string>} The modified contents
 */
async function updatePackageJson(packageJson, projectName) {
  const newScripts = {
    "start": "node --experimental-modules --experimental-json-modules ./index.js",
    "start:dev": "npm run check-node-version && NODE_ENV=development NODE_OPTIONS='--experimental-modules --experimental-json-modules' nodemon ./index.js",
    "inspect": "NODE_ENV=development node --experimental-modules --experimental-json-modules --inspect ./src/index.js",
    "inspect-brk": "NODE_ENV=development node --experimental-modules --experimental-json-modules --inspect-brk ./src/index.js",
    "check-node-version": "node ./src/checkNodeVersion.cjs",
    "test": "jest --runInBand",
    "lint": "eslint ."
  };
  const packageData = JSON.parse(packageJson);
  packageData.scripts = newScripts;
  packageData.name = projectName;
  packageData.version = "1.0.0";
  packageData.projectType = "api";
  delete packageData.release;
  delete packageData.homepage;
  delete packageData.url;
  delete packageData.email;
  delete packageData.repository;
  delete packageData.author;
  delete packageData.bugs;
  packageData.main = "./index.js";
  packageData.nodemonConfig.watch.push("custom-packages");
  packageData.devDependencies = {
    ...packageData.devDependencies,
    ...(await getDevDependenciesFromRoot())
  };

  delete packageData?.devDependencies["graphql-schema-linter"];
  delete packageData["graphql-schema-linter"];
  return JSON.stringify(packageData, null, 2);
}

/**
 * @summary update dotenv file to point to local mongo
 * @param {String} envData - file extracted from the reaction repo
 * @returns {String} updated env file
 */
function updateEnv(envData) {
  const env = parse(envData);
  env.MONGO_URL = "mongodb://localhost:27017/reaction";
  return stringify(env);
}

/**
 * @summary get files directory from core repo
 * @param {String} projectName - The name of the project we are creating
 * @returns {Promise<Boolean>} True if success
 */
async function getFilesFromCore(projectName) {
  // get files directly from repo so it's always up-to-date
  const packageJson = await getFileFromCore("package.json");
  const updatedPackageJson = await updatePackageJson(packageJson, projectName);
  await writeFile(`${projectName}/package.json`, updatedPackageJson);
  const pluginsJson = await getFileFromCore("plugins.json");
  // Add example plugin to plugins.json
  const pluginsData = JSON.parse(pluginsJson);
  pluginsData.example = "./custom-packages/simple-example/index.js";
  await writeFile(`${projectName}/plugins.json`, JSON.stringify(pluginsData, null, 2));

  const checkNode = await getFileFromCore("src/checkNodeVersion.cjs");
  await writeFile(`${projectName}/src/checkNodeVersion.cjs`, checkNode);

  const nvmrc = await getFileFromCore(".nvmrc", reactionRoot);
  await writeFile(`${projectName}/.nvmrc`, nvmrc);

  const dotenv = await getFileFromCore(".env.example");
  const updatedDotEnv = updateEnv(dotenv);
  await writeFile(`${projectName}/.env`, updatedDotEnv);
  const babelConfig = await getFileFromCore("babel.config.cjs");
  const eslintConfig = await getFileFromCore(".eslintrc.cjs", reactionRoot);
  await Promise.all([
    copyTests("/apps/reaction/tests/", `${projectName}`),
    writeFile(`${projectName}/babel.config.cjs`, babelConfig),
    writeFile(`${projectName}/.eslintrc.cjs`, eslintConfig)]);
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
  Logger.info("Creating API project", { projectName, options });
  if (await pathExists(projectName)) {
    Logger.error(`Cannot create directory ${projectName}, already exists`);
    return;
  }
  // create directories
  await makeProject(projectName);

  await getFilesFromRepo("/templates/api-project/", projectName);

  // copy files directly from core that we want to be current
  await getFilesFromCore(projectName);

  // git init the new project
  await gitInitDirectory(projectName);

  Logger.success("Project creation complete. Change to your directory and run `npm install`");
}
