import { spawn } from "child_process";
import diehard from "diehard";
import Logger from "../utils/logger.js";
import checkBeforeDevelop from "../utils/checkBeforeStart.js";

/**
 * @summary start develop mode for admin
 * @param {Object} options - Any options for project creation
 * @returns {Boolean} true for success
 */
export default async function developAdmin(options) {
  if (!await checkBeforeDevelop()) return;
  Logger.info("Starting Open Commerce Admin Application Server in dev mode", { options });
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
    done();
  });

  diehard.listen();
}
