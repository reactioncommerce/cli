import { spawn } from "child_process";
import diehard from "diehard";
import Logger from "../utils/logger.js";

/**
 * @summary clones projects locally from repo
 * @param {Object} options - Any options for project creation
 * @returns {Boolean} true for success
 */
export default async function developAdmin(options) {
  Logger.info({ options }, "Starting Open Commerce Admin Application Server in dev mode");
  const api = spawn("npm", ["run", "start:dev"]);
  api.stdout.on("data", (data) => {
    // eslint-disable-next-line no-console
    console.log(data.toString().trim()); // Echo output of command to console
  });

  diehard.register(async (signal, uncaughtErr, done) => {
    if (signal === "SIGINT") {
      Logger.warn("Shutting down from Ctrl-C");
    }
    await spawn("docker-compose", ["down"], { PORT: 4080 });
    done();
  });

  diehard.listen();
}
