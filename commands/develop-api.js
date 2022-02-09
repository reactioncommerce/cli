import { spawn } from "child_process";
import diehard from "diehard";
import Logger from "../utils/logger.js";
import checkBeforeDevelop from "../utils/checkBeforeStart.js";

/**
 * @summary run project in development mode
 * @param {Object} options - Any options for project creation
 * @returns {Boolean} true for success
 */
export default async function developApi(options) {
  if (!await checkBeforeDevelop()) return;
  Logger.info("starting development on api", { options });
  Logger.info("Starting Mongo docker image");
  const mongo = spawn("docker-compose", ["up", "-d"]);
  mongo.stdout.on("data", (data) => {
    // eslint-disable-next-line no-console
    console.log(data.toString().trim()); // Echo output of command to console
  });
  Logger.info("Starting Open Commerce API Server in dev mode");
  const api = spawn("npm", ["run", "start:dev"]);
  api.stdout.on("data", (data) => {
    // eslint-disable-next-line no-console
    console.log(data.toString().trim()); // Echo output of command to console
  });

  api.stderr.on("data", (data) => {
    // eslint-disable-next-line no-console
    console.log(data.toString().trim()); // Echo error output
  });

  diehard.register(async (signal, uncaughtErr, done) => {
    if (signal === "SIGINT") {
      Logger.warn("Shutting down from Ctrl-C");
    }
    await spawn("docker-compose", ["down"]);
    done();
  });

  diehard.listen();
}
