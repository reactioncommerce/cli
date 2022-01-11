import path from "path";
import { mkdir } from "fs/promises";
import { spawn } from "child_process";
import { copy } from "fs-extra";
import diehard from "diehard";
import Logger from "../utils/logger.js";

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
 * @returns {undefined} undefined
 * @param {String} demoPath - Where to create the demo directory
 */
export default async function demo(demoPath) {
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
  Logger.info("Run `docker-compose down` to stop");
}
