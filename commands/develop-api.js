import { spawn } from "child_process";
import diehard from "diehard";
import Logger from "../utils/logger.js";
import checkBeforeDevelop from "../utils/checkBeforeDevelop.js";
import runCommandInSpawn from "../utils/runCommandInSpawn.js";

/**
 * @summary run project in development mode
 * @param {Object} options - Any options for project creation
 * @returns {Boolean} true for success
 */
export default async function developApi(options) {
  const { mongoShutdown } = options;
  if (!await checkBeforeDevelop("api")) return;
  Logger.info("starting development on api", { options });
  Logger.info("Starting Mongo docker image");
  const mongo = await runCommandInSpawn("docker-compose", ["up", "-d"]);
  if (!mongo) {
    Logger.error("Was unable to start MongoDb container. Cannot run develop");
  }
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

    if (mongoShutdown) {
      Logger.info("Shutting down mongo instance");
      await runCommandInSpawn("docker-compose", ["down"]);
    } else {
      done();
    }
  });

  diehard.listen();
}
