import { spawn } from "child_process";

/**
 * @summary run a command in a blocking method using a promise
 * @param {String} command - The command to run
 * @param {Array<String>} args - The arguments to pass to the command as an array
 * @param {Object} options - The options to pass to the spawn as an object
 * @returns {Promise<Boolean>} true if successful
 */
export default async function runCommandInSpawn(command, args, options = {}) {
  return new Promise((resolve) => {
    const cmd = spawn(command, args, options);
    cmd.stdout.on("data", (data) => {
      // eslint-disable-next-line no-console
      console.log(data.toString().trim()); // Echo output of command to console
    });
    cmd.stderr.on("data", (data) => {
      // eslint-disable-next-line no-console
      console.log(data.toString().trim()); // Echo error output
    });
    cmd.stdout.on("close", () => resolve(true));
  });
}
