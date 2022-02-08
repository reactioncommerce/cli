import { spawn } from "child_process";

/**
 * @summary spans a node process for testing
 * @param {String} processPath - The path of the process
 * @param {Array} args - The arguments for the process
 * @param {String} env - The environment
 * @returns {ChildProcessWithoutNullStreams} - The results of the process
 */
export default function createProcess(processPath, args = [], env = null) {
  const funcArgs = [processPath].concat(args);

  return spawn("node", ["--experimental-json-modules", "--no-warnings", ...funcArgs], {
    env: Object.assign(
      {
        ...process.env,
        NODE_ENV: "test"
      },
      env
    )
  }).on("error", (error) => {
    throw error;
  });
}
