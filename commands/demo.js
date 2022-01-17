import path from "path";
import { mkdir } from "fs/promises";
import { spawn } from "child_process";
import { copy } from "fs-extra";
import diehard from "diehard";
import Logger from "../utils/logger.js";
import portCheck from "../utils/portCheck.js";
import pathExists from "../utils/pathExists.js";

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
 * @returns {Boolean} true if successful
 the demo directory
 */
export default async function demo(demoPath) {
  if (await pathExists(demoPath)) {
    Logger.error(`Cannot create directory ${demoPath}, already exists`);
    return false;
  }
  const { portsResults, portsMap } = await portCheck();
  const portsAvailable = !portsResults.some((portResults) => portResults === true);
  if (!portsAvailable) {
    Logger.error("One of the ports (3000/4000/4080) required to run this project are already in use");
    Logger.error("Cannot continue", portsMap);
    return false;
  }
  await createDemoDirectory(demoPath);
  await copy("./templates/demo/", demoPath);
  const options = {
    cwd: path.join(process.cwd(), demoPath)
  };
  const dockerCompose = spawn("docker-compose", ["up", "-d"], options);
  dockerCompose.stdout.on("data", (data) => {
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
  Logger.info("or use demo-destroy to completely remove a demo");
  return true;
}
