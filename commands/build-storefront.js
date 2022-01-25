import { spawn } from "child_process";
import diehard from "diehard";
import Logger from "../utils/logger.js";

/**
 * @summary Build the storefront image from local code
 * @param {Object} options - Any options for docker
 * @returns {Boolean} true for success
 */
export default async function buildStorefront(options) {
  Logger.info("Building Storefront Image");
  const docker = spawn("docker", ["build", "."], options);
  docker.stdout.on("data", (data) => {
    // eslint-disable-next-line no-console
    console.log(data.toString().trim()); // Echo output of command to console
  });

  diehard.register(async (signal, uncaughtErr, done) => {
    if (signal === "SIGINT") {
      Logger.warn("Shutting down from Ctrl-C");
    }
    done();
  });

  diehard.listen();
}
