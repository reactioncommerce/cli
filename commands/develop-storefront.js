import { spawn } from "child_process";
import diehard from "diehard";
import Logger from "../utils/logger.js";
import checkBeforeDevelop from "../utils/checkBeforeDevelop.js";

/**
 * @summary start develop mode for storefront
 * @param {Object} options - Any options for project creation
 * @returns {Boolean} true for success
 */
export default async function developStorefront(options) {
  if (!await checkBeforeDevelop("storefront")) return;
  Logger.info("Starting Open Commerce Admin Application Server in dev mode", { options });
  const storefront = spawn("yarn", ["run", "start:dev:latest"]);
  storefront.stdout.on("data", (data) => {
    // eslint-disable-next-line no-console
    console.log(data.toString().trim()); // Echo output of command to console
  });

  storefront.stderr.on("data", (data) => {
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
