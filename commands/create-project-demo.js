import path from "path";
import { mkdir } from "fs/promises";
import { spawn } from "child_process";
import diehard from "diehard";
import Logger from "../utils/logger.js";
import portCheck from "../utils/portCheck.js";
import pathExists from "../utils/pathExists.js";
import getFilesFromRepo from "../utils/getFilesFromRepo.js";

/**
 * @summary create project directory
 * @param {String} demoPath - The name of the directory to create
 * @returns {Promise<Boolean>} true if success
 */
async function createDemoDirectory(demoPath) {
  await mkdir(demoPath);
  return true;
}


/**
 * @summary download demo files and runs docker-compose
 * @param {String} demoPath - Where to create
 * @param {Object} options - Other command options
 * @returns {Boolean} true if successful
 the demo directory
 */
export default async function createProjectDemo(demoPath, options) {
  const { dontStartDemo } = options;
  if (await pathExists(demoPath)) {
    Logger.error(`Cannot create directory ${demoPath}, already exists`);
    return false;
  }
  const { portsMap } = await portCheck();
  let portsAvailable = true;
  portsMap.forEach((portMap) => {
    if (portMap.inUse) {
      Logger.error(`Port ${portMap.port} is not available and is required to run the demo`);
      portsAvailable = false;
    }
  });
  if (!portsAvailable) return false;
  await createDemoDirectory(demoPath);
  await getFilesFromRepo("/templates/demo/", demoPath);
  const dockerOptions = {
    cwd: path.join(process.cwd(), demoPath)
  };
  if (dontStartDemo) return true;
  const dockerCompose = spawn("docker-compose", ["up", "-d"], dockerOptions);
  dockerCompose.stdout.on("data", (data) => {
    // eslint-disable-next-line no-console
    console.log(data.toString().trim()); // Echo output of command to console
  });

  dockerCompose.stderr.on("data", (data) => {
    // eslint-disable-next-line no-console
    console.log(data.toString().trim()); // Echo output of command to console
  });

  diehard.register(async (signal, uncaughtErr, done) => {
    if (signal === "SIGINT") {
      Logger.warn("Shutting down from Ctrl-C");
    }
    await spawn("docker-compose", ["down"]);
    done();
  });

  diehard.listen();
  Logger.info("After a few seconds the following sites should be available");
  Logger.info("API Server on localhost:3000");
  Logger.info("Admin panel on localhost:4080");
  Logger.info("Example Storefront on localhost:4000");
  Logger.info("Run cd <mydemo directory> and then docker-compose down to stop");
  return true;
}
